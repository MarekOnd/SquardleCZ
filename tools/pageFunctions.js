

class settings{
    size;
    minWordSize;
    maxWordSize;
    numWordsToHide;
    numWordsToInput;
    useInputWords;
    inputWords;
    inputBoard;
    constructor(_size = 5, _minWordSize = 4, _maxWordSize = 8, _numWordsToHide = 1, _numWordsToInput = 1, _useInputWords = true, _inputWords = [""], _inputBoard = null)
    {
        this.size = _size;
        this.minWordSize = _minWordSize;
        this.maxWordSize = _maxWordSize;
        this.numWordsToHide = _numWordsToHide;
        this.numWordsToInput = _numWordsToInput;
        this.useInputWords = _useInputWords;
        this.inputWords = _inputWords;
        this.inputBoard = _inputBoard;
    }
}

class Squardle{
    name = "";
    author = "";
    letters = [];
    wordsToFind = []; // contains structure

    difficulty; // 1 to 5 stars
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
        createChild(where, howMany, objectTypeName, className)
    }
}

function createChild(where, howMany, objectTypeName, className)
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




