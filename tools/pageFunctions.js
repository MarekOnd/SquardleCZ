

class settings{
    size;
    minWordSize;
    maxWordSize;
    numWordsToHide;
    numWordsToInput;
    useInputWords;
    inputWords;
    inputBoard;
    library;

    constructor(_size = 5, _minWordSize = 4, _maxWordSize = 8, _numWordsToInput = 1, _inputWords = [""], _inputBoard = null, _library = "czech")
    {
        this.size = _size;
        this.minWordSize = _minWordSize;
        this.maxWordSize = _maxWordSize;
        this.numWordsToInput = _numWordsToInput;
        this.inputWords = _inputWords;
        this.inputBoard = _inputBoard;
        this.library = _library;
    }
}

class Squardle{
    name = "";
    author = "";
    letters = [];
    wordsToFind = []; // contains structure

    difficulty; // 1 to 5 stars

    limitedTime;
    startDate;
    endDate;
}

class Word{
    positions = [];
}

class Position{
    x
    y
    constructor(_x, _y)
    {
        this.x = _x;
        this.y = _y
    }

}

function createWord(b, path)
{
    if(path.positions.length == 0)
    {
        return ""
    }
    let string = "";
    for (let i = 0; i < path.positions.length; i++) {
        const element = path.positions[i];
        string += b[element.x][element.y];
    }
    return string;
}
function createWords(b, paths)
{
    words = [];
    for (let i = 0; i < paths.length; i++) {
        const element = paths[i];
        words.push(createWord(b, element))
    }
    return words;
}

function log2DArray(array)
{

    for (let i = 0; i < array.length; i++) {
        let row = "";
        for (let y = 0; y < array[i].length; y++) {
            row += " " + array[i][y]
        }
        console.log(row)
        
    }
}

function clearChildren(object)
{
    while(object.hasChildNodes())
    {
        object.removeChild(object.firstChild);
    }
}

function createChildren(where, howMany, objectTypeName, className)
{
    for (let i = 0; i < howMany; i++) {
        createChild(where, objectTypeName, className)
    }
}

function createChild(where, objectTypeName, className)
{
    let object = document.createElement(objectTypeName)
    object.className = className
    where.appendChild(object);
    return object;
}

function createNewChildren(where, howMany, objectType, className)
{
    clearChildren(where)
    createChildren(where,howMany, objectType,className);
}

function showSquardle(sqrdl)
{
    S = sqrdl
    createBoard()
    setupWords()
    let header = document.getElementById("squardleHeader");
    header.textContent = S.name
}

function newInst(obj)
{
    return JSON.parse(JSON.stringify(obj))
}

// progress showing
let progressLog = document.getElementById("log");

function addToLog(text)
{
    progressLog.value += '\n' + text;
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





