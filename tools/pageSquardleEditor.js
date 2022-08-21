





let Generator = new Worker("./pageSquardleGenerator.js");
let generatorWorking = false;
async function createSquardleFromParameters()
{
    if(generatorWorking == true)
    {
        if(confirm("Generátor již pracuje. Pokud ho chcete zastavit, stiskněte znovu načtěte stránku."))
        {
            generatorWorking = false;
            Generator.postMessage("close");

        }
        else
        {
            return;
        }
        
    }
    
    S = new Squardle();
    let set = getSettings();
    if(
    set.size === "" || 
    set.minWordSize === "" || 
    set.maxWordSize === "" ||
    set.numWordsToInput === "" ||
    set.minWordSize === undefined|| 
    set.maxWordSize === undefined||
    set.numWordsToInput === undefined)
    {
        window.alert("Všechny parametry nebyly zadány")
        return;
    }
    
    Generator.postMessage(set)
    generatorWorking = true;
}

Generator.onmessage = (e) => {
    switch(e.data.title)
    {
        case "log":
            let lg = document.getElementById("log");
            lg.textContent += e.data.mess + '\n';
            lg.scrollTop = lg.scrollHeight;
        break;
        case "result":
            generatorWorking = false;
            S = new Squardle();
            S = JSON.parse(e.data.mess);
            createBoard();
            setupWords();
            
        break;
    }
    
    
}



function updateWordInputMenu(_settings)
{
    let place = document.getElementById("wordsToHide");
    clearChildren(place);
    for (let i = 0; i < _settings.numWordsToInput; i++) {
        let newArea = createChild(place,"textarea","wordToHideInput");
        if(_settings.inputWords[i] === undefined)
        {
            _settings.inputWords[i] = "";
        } 
        newArea.value = _settings.inputWords[i];
        
    }
}

function updateBoardInputMenu(_settings)
{
    
    let boardInput = document.getElementById("boardInput");
    clearChildren(boardInput);
    
    for (let i = 0; i < _settings.size; i++) {
        let row = document.createElement("div")
        row.className = "boardRow"
        for (let y = 0; y < _settings.size; y++) {
            let inputBox = document.createElement("textarea");
            inputBox.className = "boardLetter";
            inputBox.addEventListener('input',boardLetterUpdate);
            inputBox.addEventListener('focus',(event)=>{
                selected.x = newInst(i);
                selected.y = newInst(y);
            })
            inputBox.spellcheck = false;
            inputBox.autocapitalize = "none";
            if(_settings.inputBoard !== null && i < _settings.inputBoard.length && y < _settings.inputBoard[i].length)
            {
                inputBox.value = _settings.inputBoard[i][y];
            }
            row.appendChild(inputBox)
        }
        boardInput.appendChild(row)
        boardInput.appendChild(document.createElement("br"));
    }
}

let selected = {
    x:0,
    y:0,
}

function setSelected(x, y)
{
    let futureSquare = getLetterOnPosition(x,y)
    if(futureSquare)
    {
        selected.x = x;
        selected.y = y;
        futureSquare.focus()
        futureSquare.selectionEnd = 1
    }
    else
    {
        return;
    }
    
}

function getLetterOnPosition(x, y)
{
    let rowsWithBr = document.getElementById("boardInput").childNodes;
    let index = 0;
    for (let i = 0; i < rowsWithBr.length; i++) {
        const element = rowsWithBr[i];
        
        if(element.className == "boardRow")
        {
            if(index == x)
            {
                return rowsWithBr[i].childNodes[y];
            }
            index++;
        }

    }
}



function boardLetterUpdate(event)
{
    let letter = event.target
    let text = letter.value;
    if(text.length > 1)
    {
        letter.value = ""
        letter.value = text[text.length - 1];
    }
    getInputBoard()
}

function getInputBoard()
{
    let children = document.getElementById("boardInput").childNodes;
    let tmp_inputBoard = []
    let tmp_inputRow = []
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if(child.className == "boardRow")
        {
            let letters = child.childNodes;
            for (let y = 0; y < letters.length; y++) {
                tmp_inputRow.push(letters[y].value)
            }
            tmp_inputBoard.push(newInst(tmp_inputRow));
            tmp_inputRow = []
        }
        
    }
    //console.log(tmp_inputBoard)
    return tmp_inputBoard;
}

//  LOAD SETTING FROM FORM


function getSettings()
{
    let _settings = new settings();
    _settings.name = document.getElementById("name").value;
    _settings.size = document.getElementById("size").value;
    _settings.minWordSize  = document.getElementById("minWordSize").value;
    _settings.maxWordSize  = document.getElementById("maxWordSize").value;
    _settings.numWordsToInput = document.getElementById("numWordsToInput").value;
    getInputWords(_settings);
    _settings.inputBoard = getInputBoard();
    _settings.library = document.getElementById("libraryInput").value;
    return _settings;
}
function getInputWords(_settings)
{
    _settings.inputWords = []
    if(_settings.numWordsToInput > 0)
    {
        let words = document.getElementById("wordsToHide").childNodes;
        for (let i = 0; i < words.length; i++) {
            _settings.inputWords.push(words[i].value)
        }
    }
}

function loadSettings(_settings)
{
    document.getElementById("size").value = _settings.size;
    document.getElementById("minWordSize").value = _settings.minWordSize;
    document.getElementById("maxWordSize").value = _settings.maxWordSize;
    document.getElementById("numWordsToInput").value =_settings.numWordsToInput;
    updateWordInputMenu(_settings);
    updateBoardInputMenu(_settings);
    document.getElementById("libraryInput").value = _settings.library;
}

function saveSettings()
{
    localStorage.setItem("settings", JSON.stringify(getSettings()));
}

function resetDefaultSettings()
{
    // localStorage.removeItem("settings");
    if(confirm("Toto resetuje aktuální nastavení\nPokud ho nemáš uložené, navždy ho ztratíš.\nChceš pokračovat?")){
        loadSettings(new settings());
    }
}
// DEFAULT VALUES

function loadSettingsFromStorage()
{
    if(localStorage.getItem("settings"))
    {
        loadSettings(JSON.parse(localStorage.getItem("settings")));
    }
    else
    {
        resetDefaultSettings();
    }
}

function initialize()
{
    loadSettingsFromStorage();    
    document.getElementById("boardInput").addEventListener("keydown",(event)=>{
        switch(event.key)
        {
            case 'ArrowUp':
                event.preventDefault()
                setSelected(selected.x - 1, selected.y);
                break;
            case 'ArrowDown':
                event.preventDefault()
                setSelected(selected.x + 1, selected.y);
                break;  
            case 'ArrowLeft':
                event.preventDefault()
                setSelected(selected.x, selected.y - 1);
                break;
            case 'ArrowRight':
                event.preventDefault()
                setSelected(selected.x, selected.y + 1);
                break;
        }
    })

    //Select editor on page load (called twice so the button changes lol)
    openTab("squardleEditor",document.getElementById("toEditor"))
    openTab("squardleGenerator",document.getElementById("toGenerator"))
    openTab("squardleEditor",document.getElementById("toEditor"))

}



initialize()

