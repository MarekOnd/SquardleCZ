



let S ={
    name:"",
    letters:[],
    wordsToFind:[],
}




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
        const text = createWord(S, S.wordsToFind[legitWords[i]]);
        let word = document.createElement("button")
        word.textContent = text
        word.className = "word"
        word.addEventListener("click",()=>(moveWord(JSON.parse(JSON.stringify(legitWords[i])))))
        legitWords_place.appendChild(word)
    }
    let bonusWords_place = document.getElementById("bonusWords");
    clearChildren(bonusWords_place)
    for (let i = 0; i < bonusWords.length; i++) {
        const text = createWord(S, S.wordsToFind[bonusWords[i]]);
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
let set = new settings();


async function createSquardleFromParameters()
{
    updateSettings();

    if(set.name == "" ||
    set.size == "" || 
    set.minWordSize == "" || 
    set.maxWordSize == "" ||
    set.numWordsToInput == "" ||
    set.numWordsToHide == "" ||
    !set.size  ||
    !set.minWordSize || 
    !set.maxWordSize ||
    !set.numWordsToInput ||
    !set.numWordsToHide)
    {
        window.alert("Všechny parametry nebyly zadány")
        return;
    }
    if(parseInt(set.numWordsToInput) > 0)
    {
        set.useInputWords = true;
        
        let words = document.getElementById("wordsToHide").childNodes;
        for (let i = 0; i < words.length; i++) {
            set.inputWords.push(words[i].value)
            console.log(words[i].value)
        }
    }
    else
    {
        set.useInputWords = false;
    }
    S = await createSquardle(set)
    createBoard()
    setupWords()
    let header = document.getElementById("squardleHeader");
    header.textContent = S.name
}

function updateSettings()
{
    set.name = document.getElementById("name").value;
    set.size = parseInt(document.getElementById("size").value);
    set.minWordSize  = parseInt(document.getElementById("minWordSize").value);
    set.maxWordSize  = parseInt(document.getElementById("maxWordSize").value);
    set.numWordsToInput = parseInt(document.getElementById("numWordsToInput").value);
    set.numWordsToHide = parseInt(document.getElementById("numWordsToHide").value);
    set.useInputWords;
    set.inputWords = [];
    set.inputBoard = getInputBoard();

    
}

function updateWordInputMenu()
{
    let input = document.getElementById("numWordsToInput");
    if(isNaN(input.value))
    {
        clearChildren(input)
        input.value = "";
    }
    else
    {
        let wordsToHide = document.getElementById("wordsToHide");
        createNewChildren(wordsToHide,parseInt(input.value),"textarea","wordToHideInput")
    }
}

function updateBoardInputMenu()
{
    updateSettings();
    if(!set.size)// if the board size wasnt entered
    {
        return;
    }
    let boardInput = document.getElementById("boardInput");
    clearChildren(boardInput);
    for (let i = 0; i < set.size; i++) {
        let row = document.createElement("div")
        row.className = "boardRow"
        for (let y = 0; y < set.size; y++) {
            let inputBox = document.createElement("textarea");
            inputBox.className = "boardLetter";
            inputBox.addEventListener('input',boardLetterUpdate);
            inputBox.addEventListener('focus',(event)=>{
                setSelected(newInst(i),newInst(y))
            })
            


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
    if(x < 0 || x >= set.size || y < 0 || y > set.size)
    {
        return;
    }
    selected.x = x;
    selected.y = y;
    getLetterOnPosition(selected.x,selected.y).focus()
}

function getLetterOnPosition(x, y)
{
    if(x < 0 || x >= set.size || y < 0 || y > set.size)
    {
        return null;
    }
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
    console.log(tmp_inputBoard)
    return tmp_inputBoard;
}

// DEFAULT VALUES

function initialize()
{
    document.getElementById("name").value = "default"
    document.getElementById("size").value = "5"
    document.getElementById("minWordSize").value = "4"
    document.getElementById("maxWordSize").value = "8"
    document.getElementById("numWordsToInput").value ="1"
    document.getElementById("numWordsToHide").value = "1"
    updateWordInputMenu();
    updateBoardInputMenu();

    document.addEventListener("keydown",(event)=>{
        console.log(event.key)
        switch(event.key)
        {
            case 'ArrowUp':
                setSelected(selected.x - 1, selected.y);
                break;
            case 'ArrowDown':
                setSelected(selected.x + 1, selected.y);
                break;  
            case 'ArrowLeft':
                setSelected(selected.x, selected.y - 1);
                break;
            case 'ArrowRight':
                setSelected(selected.x, selected.y + 1);
                break;
        }
    })
}



initialize()

