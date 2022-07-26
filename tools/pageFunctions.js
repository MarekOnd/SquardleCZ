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

class Squardle{
    name = ""
    author = ""
    letters = []
    wordsToFind = [] // contains structure

    difficulty // 1 to 5 stars
}

class Word{
    positions = []
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

// progress showing
let progressLog = document.getElementById("log");

function addToLog(text)
{
    progressLog.value += '\n' + text;
}




class Board{
    // variables
    
    letters = []
    locked = []
    size;
    alphabet;
    library;
    range ={
        min: 0,
        max: 0
    };

    constructor(_size,_alphabet, _minLength, _maxLength)
    {
        this.size = _size;
        this.alphabet = _alphabet;
        this.range.min = _minLength;
        this.range.max = _maxLength;
    }

    // functions
    loadBoard(_letters)
    {
        this.letters = newInst(_letters)
    
        for (let i = 0; i < this.letters.length; i++) {
            const el = this.letters[i];
            let row = []
            for (let y = 0; y < el.length; y++) {
                const elel = el[y];
                if(elel != null && elel != '')
                {
                    row.push(true)
                }
                else
                {
                    row.push(false)
                }
            }
            this.locked.push(row)
        }
    }
    generateRandomBoard(letLockedSame = false)
    {
        
        if(this.letters != []) // is already generated
        {
            let newLetters = [];
            for(let i = 0; i < this.letters.length; i++)
            {
                let rowLetters = [];
                for(let y = 0; y < size; y++)
                {
                    if(letLockedSame && this.locked[i][y])
                    {
                        rowLetters.push(this.letters[i][y]);
                    }
                    else
                    {
                        rowLetters.push(this.alphabet[Math.floor(Math.random() * this.alphabet.length)]);
                    }
                    
                }
                newLetters.push(rowLetters);
            }
            this.letters = newLetters;
        }
        else    // isnt generated
        {
            for(let i = 0; i < size; i++)
            {
                let rowLetters = [];
                let rowLocked = [];
                for(let y = 0; y < size; y++)
                {
                    rowLetters.push(abc[Math.floor(Math.random() * this.alphabet.length)]);
                    rowLocked.push(false);
                }
                this.letters.push(rowLetters);
                this.locked.push(rowLocked);
            }

        }
        
    }
    nextBoardPermutation()
    {
        let overflow = false;
        for(let i = 0; i < size; i++)
        {
            for(let y = 0; y < size; y++)
            {
                if(this.locked[i][y])
                {
                    overflow = true;
                    continue;
                }
                overflow = false;
                let nextIndex = this.alphabet.indexOf(this.letters[i][y]) + 1;
                if(nextIndex >= this.alphabet.length)
                {
                    this.letters[i][y] = this.alphabet[0];
                    overflow = true;
                }
                else
                {
                    this.letters[i][y] = this.alphabet[nextIndex];
                }
                if(overflow == false)
                {
                    break;
                }
            }
            if(overflow == false)
            {
                break;
            }
        }
        return this;
    }
    lockPath(path)
    {
        for (let i = 0; i < path.positions.length; i++) {
            const element = path.positions[i];
            this.locked[element.x][element.y] = true;  
        }
    }
    lockPaths(paths)
    {
        for (let i = 0; i < paths.length; i++) {
            this.lockPath(paths[i])
        }
    }
    countLocked()
    {
        let sum = 0;
        for (let i = 0; i < this.locked.length; i++) {
            const element = this.locked[i];
            for (let i = 0; i < element.length; i++) {
                if(element[i])
                {
                    sum++;
                }
            }
        }
        return sum;
    }
    // RECURSIVE SEARCH THROUGH BOARD


    findWordsInBoard()
    {
        let searchProgress = 1;
        let output = [];
        let wordPath = new Word();
        for(let x = 0; x < this.size; x++)
        {
            for(let y = 0; y < this.size; y++)
            {
                wordPath.positions.push(new Position(newInst(x),newInst(y)));
                this.constuctWord(wordPath, output);
                wordPath.positions.pop();
                if(this.library.length > 0) // progress is needed only with large libraries
                {
                    console.log(searchProgress++ + '/' + size*size)
                }
                
            }
        }
        return output;
    }

    constuctWord(wordPath, output)
    {
        let x = wordPath.positions[wordPath.positions.length - 1].x;
        let y = wordPath.positions[wordPath.positions.length - 1].y;
        let activeWord = createWord(this.letters,wordPath);
        if(wordPath.positions.length > this.range.max || !this.canBeInLibrary(activeWord))// too long or cant be a word
        {
            return;
        }
        
        if(wordPath.positions.length > this.range.min && wordPath.positions.length <= this.range.max)// if not too short, try to find it in library
        {
            // if(this.library.includes(activeWord))
            // {
            //     console.log(this.library + " obsahuje " + activeWord)
            // }
            // else
            // {
            //     console.log(this.library + " neobsahuje " + activeWord)
            // }
            // if(!createWords(this.letters, output).includes(activeWord))
            // {
            //     console.log(createWords(this.letters, output) + " ještě neobsahuje " + activeWord)
            // }
            // else
            // {
            //     console.log(createWords(this.letters, output) + " již obsahuje " + activeWord)
            // }
            if(this.library.includes(activeWord) && !createWords(this.letters, output).includes(activeWord)/*this.hasWordIncluded(activeWord, output)*/)
            {
                output.push(JSON.parse(JSON.stringify(wordPath)));
                console.log(JSON.stringify(output))
            }
        }
        // add another letter from adjactent tiles
        for(let i = -1; i <= 1; i++)
        {
            for(let j = -1; j <= 1; j++)
            {
                if(x + i >= 0 && x + i < this.size && y + j >= 0 && y + j < this.size && (i != 0 || j != 0))// is in board and isnt the same
                {
                    // new position
                    const X = x + i;
                    const Y = y + j;
                    if(wordPath.positions.filter(element => element.x == X && element.y == Y).length == 0)
                    {           
                        wordPath.positions.push(new Position(X,Y));
                        this.constuctWord(wordPath, output);
                        wordPath.positions.pop();
                    }
                }
            }
        }

    }
    hasWordIncluded(word, paths)// probably not necessary
    {
        for (let i = 0; i < paths.length; i++) {
            const element = createWord(this.letters, paths[i]);
            if(word == element)
            {
                return true;
            }
        }
        return false;
    }
    // OPTIMALIZATION

    //1) when bžk, then not a word
    canBeInLibrary(startOfWord)
    {
        for (let i = 0; i < this.library.length; i++) {
            const element = this.library[i];
            if(element.indexOf(startOfWord) == 0)
            {
                //console.log(element + " začíná " + startOfWord)
                return true;
            }
        }
        return false;
    }
}