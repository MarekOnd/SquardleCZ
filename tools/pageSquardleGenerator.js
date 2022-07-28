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
                for(let y = 0; y < this.size; y++)
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
            for(let i = 0; i < this.size; i++)
            {
                let rowLetters = [];
                let rowLocked = [];
                for(let y = 0; y < this.size; y++)
                {
                    rowLetters.push(this.alphabet[Math.floor(Math.random() * this.alphabet.length)]);
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
        for(let i = 0; i < this.size; i++)
        {
            for(let y = 0; y < this.size; y++)
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
            if(overflow === false)
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
    fullyLocked()
    {
        if(this.countLocked() === this.size*this.size)
        {
            return true;
        }
        else
        {
            return false;
        }
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
                if(this.library.length > 100000) // progress is needed only with large libraries
                {
                    logPost(searchProgress++ + '/' + this.size*this.size)
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
        
        if(wordPath.positions.length >= this.range.min && wordPath.positions.length <= this.range.max)// if not too short, try to find it in library
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
                //console.log(JSON.stringify(output))
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
function newInst(obj)
{
    return JSON.parse(JSON.stringify(obj))
}
function logPost(text)
{
    postMessage({
        title:"log",
        mess:text
    })
}



// START
async function createSquardle(sqSettings)
{
    // parameters in function try
    // sources
    let ABC = "abcdefghijklmnopqrstuvwxyzáéíýóúřčěš"
    let LIBRARY;

    // parameters
    let size;
    let squardleName;
    let fileName;
    let minWordSize;
    let maxWordSize;
    let numWordsToHide;

    let useInputWords = false
    let inputWords = [
    ];

    // output
    let squardle;

    // variables
    let board;

    let wordsInBoard = [];
    let wordLibrary;






    

    // resetting old parameters
    squardle = new Squardle();
    wordsInBoard = [];
    wordLibrary = [];


    // loading parameters
    size = sqSettings.size
    squardleName = sqSettings.name
    minWordSize = sqSettings.minWordSize
    maxWordSize =  sqSettings.maxWordSize
    numWordsToHide = sqSettings.numWordsToHide
    if(sqSettings.useInputWords)
    {
        useInputWords = true
        inputWords = sqSettings.inputWords;
    }

    // loads starting board
    board = new Board(size, "", minWordSize, maxWordSize)
    board.loadBoard(sqSettings.inputBoard)

    // getting library
    LIBRARY = await getJson("../libraries/huge_library.json")
    if(!useInputWords)
    {
        LIBRARY = shuffle(LIBRARY)
        wordLibrary = findSimilarWords(LIBRARY, numWordsToHide + 5, 0.6)
        
    }
    else
    {
        LIBRARY = LIBRARY.concat(inputWords);
        board.library = inputWords;
    }


    for (let i = 0; i < inputWords.length; i++) {
        let numOfTries = 0
        const element = inputWords[i];
        logPost("Hledám " + element);//§§§

        board.alphabet = element
        board.generateRandomBoard(true);
        wordsInBoard = board.findWordsInBoard();
        while(!createWords(board.letters, wordsInBoard).includes(element) && numOfTries++ <= 100000)
        {
            board.nextBoardPermutation();
            wordsInBoard = board.findWordsInBoard();
            if(numOfTries%10000 == 0)//§§§
            {
                console.log(numOfTries)
            }
        }
        if(createWords(board.letters, wordsInBoard).includes(element))
        {
            logPost("Slovo " + element + " bylo nalezeno");
        }
        else
        {
            logPost("Slovo " + element + " nebylo nalezeno")
        }
        board.lockPaths(wordsInBoard)
    }
    

    logPost("Všechny variace vyzkoušeny")

    // FINAL CHANGES

    board.library = LIBRARY;
    wordsInBoard = board.findWordsInBoard();
    board.lockPaths(wordsInBoard)
    if(!board.fullyLocked())
    {
        board.alphabet = ABC;
        board.generateRandomBoard(true)
        wordsInBoard = board.findWordsInBoard();
    }

    // while(countLocked(board.locked) != size*size)
    // {
    //     board = nextBoardPermutation(board, ABC)
    //     wordsInBoard = findWordsInBoard();
    //     lockPaths(wordsInBoard);
    //     console.log("currently locked: " + countLocked(board.locked))
    // }
    

    squardle.name = squardleName;
    squardle.letters = board.letters;
    squardle.wordsToFind = wordsInBoard;
    return squardle;
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

// getting words form board
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


// SIMILAR WORDS
// function similatiryOfWords(word1, word2)
// {
//     if(word1.length > word2.length)
//     {
//         return similatiryOfWords(word2,word1);
//     }
//     if(word1.length == 0)
//     {
//         return 0;
//     }
//     // just to be sure they dont get edited
//     word1 = JSON.parse(JSON.stringify(word1))
//     word2 = JSON.parse(JSON.stringify(word2))
//     // sum letters in both 
//     let numOfLettersInBoth = 0;  
//     for(let i = 0; i < word1.length; i++) {
//         const element = word1[i];
//         let index = word2.indexOf(element)
//         if(index != -1)
//         {
//             word2 = word2.replace(word2[index],"");
//             numOfLettersInBoth++;
//         }
//     }
//     let first = numOfLettersInBoth/word1.length;
//     let second = numOfLettersInBoth/(numOfLettersInBoth+word2.length)
//     return (first);
// }
// function similarityOfArrayOfWords(words)
// {
//     let currentThresholds = []
//     for (let i = 0; i < words.length; i++) {
//         for (let y = 0; y < words.length; y++) {
//             if(i != y)
//             {
//                 currentThresholds.push(similatiryOfWords(words[i],words[y]));
//             }
//         }
//     }
//     return calculateAverage(currentThresholds);
// }
// function findSimilarWords(library, amount, threshold)
// {
    
//     let words;
//     if(amount == 1)
//     {
//         words = [];
//     }
//     else
//     {
//         words = findSimilarWords(library, amount - 1, threshold)
//     }
//     let anotherWord;
//     let i = 0;
//     do
//     {
//         anotherWord = library[i]
//         i++;
        
//     }while(!isInLimits(anotherWord)||words.includes(anotherWord)||(similarityOfArrayOfWords([...words,anotherWord])<threshold));
//     return words.concat([anotherWord]);
// }
// function blend(words)
// {
//     let newABC = "";
//     words.map((word)=>{
//         for (let i = 0; i < word.length; i++) {
//             const element = word[i];
//             if(!newABC.includes(element))
//             {
//                 newABC+=element;
//             }
//         }
//     })
//     return newABC;
// }
// function calculateAverage(array) {
//     var total = 0;
//     var count = 0;

//     array.forEach(function(item, index) {
//         total += item;
//         count++;
//     });

//     return total / count;
// }
// function isInLimits(word)
// {
//     if(word.length > minWordSize && word.length < maxWordSize)
//     {
//         return true;
//     }
//     return false;

// }
function shuffle(array)
{
    let newArr = [];
    let oldArr = JSON.parse(JSON.stringify(array));
    while (0 < oldArr.length) {
        const rnd = Math.floor(oldArr.length*Math.random());
        newArr.push(oldArr[rnd]);
        oldArr.splice(rnd,1);
        
    }
    return newArr;
}

// DEBUG FUNCTIONS
function printWords()
{
    for (let i = 0; i < wordsInBoard.length; i++) {
        const element = wordsInBoard[i];
        console.log(createWord(board, element))
    }
}


onmessage = async (e)=>{
    if(e.data === "close")
    {
        close();
        return;
    }
    console.log("Generátor pracuje")
    logPost("Generátor pracuje")
    let result = await createSquardle(e.data);
    console.log(result)
    postMessage({
        title:"result",
        mess:JSON.stringify(result)
    })
}




