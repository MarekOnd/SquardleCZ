class settings{
    size
    name
    minWordSize
    maxWordSize
    numWordsToHide
    useInputWords = false
    inputWords
    inputBoard
}

function createWord(squar, path)
{
    let string = "";
    path.positions.forEach(element => {
        string += squar.letters[element[0]][element[1]];
    });
    return string;
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
        let object = document.createElement(objectTypeName)
        object.className = className
        where.appendChild(object);
    
    }
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