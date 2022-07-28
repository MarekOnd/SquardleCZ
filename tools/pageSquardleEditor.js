



let S = new Squardle()
let legitWords = [];
let bonusWords = [];


//________________________________________________________PART I
// LOADING SQUARDLES

async function loadData()
{
    S ={
        name:"",
        letters:[],
        wordsToFind:[],
    }
    
    legitWords = [];
    bonusWords = [];


    

    let name = document.getElementById("textarea").value
    let squardle_ = await getJson("../data/" + name +".json");
    S = JSON.parse(JSON.stringify(squardle_))
    

    createBoard()
    setupWords()
    let header = document.getElementById("squardleHeader");
    header.textContent = S.name
}
async function getFile(url)
{
    try{
        return await fetch(url);
    }
    catch(error){
        console.log("error")
        console.log(error);
    }
    return false;
}
async function getJson(url){
    const obj = await getFile(url);
    if(obj == false)
    {
        return false;
    }
    const jsonObj = await obj.json();
    return jsonObj;
}


// BOARD PREVIEW
function createBoard()
{
    deleteBoard();
    let b = document.getElementById("board");
    let table = document.createElement("table");
    table.className = "board_table"

    for (let i = 0; i < S.letters.length; i++) {
        const row = S.letters[i];
        let r = document.createElement("tr");
        r.className = "row";
        for (let y = 0; y < row.length; y++) {
            const letter = row[y];
            let l = document.createElement("td");
            l.className = "letter";
            l.textContent = letter;
            r.appendChild(l)
        }
        table.appendChild(r)
    }
    b.appendChild(table)

}

function deleteBoard()
{
    clearChildren(document.getElementById("board"));
}

// WORDS IN FORM
function setupWords()
{
    legitWords = []
    bonusWords = []
    for (let i = 0; i < S.wordsToFind.length; i++) {
        legitWords.push(i);
    }
    updateWords();
}

function updateWords()
{
    let legitWords_place = document.getElementById("wordsToFind");
    clearChildren(legitWords_place)
    for (let i = 0; i < legitWords.length; i++) {
        const text = createWord(S.letters, S.wordsToFind[legitWords[i]]);
        let word = document.createElement("button")
        word.textContent = text
        word.className = "word"
        word.addEventListener("click",()=>(moveWord(JSON.parse(JSON.stringify(legitWords[i])))))
        legitWords_place.appendChild(word)
    }
    let bonusWords_place = document.getElementById("bonusWords");
    clearChildren(bonusWords_place)
    for (let i = 0; i < bonusWords.length; i++) {
        const text = createWord(S.letters, S.wordsToFind[bonusWords[i]]);
        let word = document.createElement("button")
        word.textContent = text
        word.className = "word" 
        word.addEventListener("click",()=>(moveWord(JSON.parse(JSON.stringify(bonusWords[i])))))
        bonusWords_place.appendChild(word)
    }

}

function moveWord(index)
{
    console.log(index);
    if(legitWords.includes(index))
    {
        legitWords.splice(legitWords.indexOf(index),1)
        bonusWords.push(index)
        updateWords()
        return;
    }
    if(bonusWords.includes(index))
    {
        bonusWords.splice(bonusWords.indexOf(index),1)
        legitWords.push(index)
        updateWords()
        return;
    }
    console.log("OPS a lost word")
}




// EXPORT into text area as json
function exportSquardle()
{
    let output = document.getElementById("output-text")

    let newWordsToFind = [];
    for (let i = 0; i < legitWords.length; i++) {
        const index = legitWords[i];
        newWordsToFind.push(S.wordsToFind[index]);
    }
    let oldWordsBackup = S.wordsToFind;

    S.wordsToFind = newWordsToFind;
    output.value = JSON.stringify(S);

    S.wordsToFind = oldWordsBackup;

}



//________________________________________________________PART II CREATION


let Generator = new Worker("./pageSquardleGenerator.js");
let generatorWorking = false;
async function createSquardleFromParameters()
{
    if(generatorWorking == true)
    {
        if(confirm("Generátor již pracuje. Pokud ho chcete zastavit, stiskněte znovu načtěte stránku."))
        {
            generatorWorking = false;
            Generator.postMessage("close")

        }
        else
        {
            return;
        }
        
    }
    
    S = new Squardle();
    let set = getSettings();
    if(set.name === "" ||
    set.size === "" || 
    set.minWordSize === "" || 
    set.maxWordSize === "" ||
    set.numWordsToInput === "" ||
    set.numWordsToHide === "" ||
    set.size === undefined ||
    set.minWordSize === undefined|| 
    set.maxWordSize === undefined||
    set.numWordsToInput === undefined||
    set.numWordsToHide=== undefined)
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
        break;
        case "result":
            generatorWorking = false;
            S = new Squardle();
            S = JSON.parse(e.data.mess);
            createBoard();
            setupWords();
            let header = document.getElementById("squardleHeader");
            header.textContent = S.name;
        break;
    }
    
    
}



function updateWordInputMenu(_settings)
{
    let place = document.getElementById("wordsToHide");
    let wordsToHideArray = place.childNodes;
    let last = 0;
    for (let i = 0; i <= _settings.numWordsToInput; i++) {
        if(wordsToHideArray[i] !== undefined)
        {
            wordsToHideArray[i].value = _settings.inputWords[i];
        }
        else
        {
            let newArea = createChild(wordsToHide,_settings.inputWords[i],"textarea","wordToHideInput");
        }
        last = i;
    }
    while (last + 1 < wordsToHideArray.length) {
        place.removeChild(place.childNodes[last])
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
            if(_settings.inputBoard !== null)
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
    let _settings = new settings()
    _settings.name = document.getElementById("name").value;
    _settings.size = parseInt(document.getElementById("size").value);
    _settings.minWordSize  = parseInt(document.getElementById("minWordSize").value);
    _settings.maxWordSize  = parseInt(document.getElementById("maxWordSize").value);
    _settings.numWordsToInput = parseInt(document.getElementById("numWordsToInput").value);
    _settings.numWordsToHide = parseInt(document.getElementById("numWordsToHide").value);
    getInputWords(_settings);
    _settings.inputBoard = getInputBoard();
    return _settings;
}
function getInputWords(_settings)
{
    _settings.inputWords = []
    if(_settings.numWordsToInput > 0)
    {
        _settings.useInputWords = true;
        let words = document.getElementById("wordsToHide").childNodes;
        for (let i = 0; i < words.length; i++) {
            _settings.inputWords.push(words[i].value)
        }
    }
    else
    {
        _settings.useInputWords = false;
    }
}

function loadSettings(_settings)
{
    document.getElementById("name").value = _settings.name;
    document.getElementById("size").value = _settings.size;
    document.getElementById("minWordSize").value = _settings.minWordSize;
    document.getElementById("maxWordSize").value = _settings.maxWordSize;
    document.getElementById("numWordsToInput").value =_settings.numWordsToInput;
    document.getElementById("numWordsToHide").value = _settings.numWordsToHide;
    updateWordInputMenu(_settings);
    updateBoardInputMenu(_settings);
}

function saveSettings()
{
    localStorage.setItem("settings", JSON.stringify(getSettings()));
}

function resetDefaultSettings()
{
    localStorage.removeItem("settings");
    loadSettings(new settings());

}
// DEFAULT VALUES



function initialize()
{
    if(localStorage.getItem("settings"))
    {
        loadSettings(JSON.parse(localStorage.getItem("settings")));
    }
    else
    {
        resetDefaultSettings();
    }
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

}



initialize()

