// requirements
const fs = require('fs');

// sources
let ABC = "abcdefghijklmnopqrstuvwxyzáéíýóúřčěš"
let LIBRARY = JSON.parse(fs.readFileSync("libraries/library_syn2015.json"));

// parameters
let size = 5;
let squardleName = "Omega"
let fileName = "15"
let minWordSize = 4;
let maxWordSize = 14;
let numWordsToHide = 5;

let useInputWords = true
let inputWords = [
    "alfa",
    "beta",
    "gama",
    "delta",
    "théta",
    "kapa",
    "omega",
    "epsilon",
];

// output
let squardle ={
    name:"",
    letters:[],
    wordsToFind:[],
}


// variables
let board;
let wordsInBoard = [];
let wordsInBoardFromPrevious = [];
let wordLibrary;

let progress = 0;

// START
function initialize()
{
    
    if(!useInputWords)
    {
        LIBRARY = shuffle(LIBRARY)
        wordLibrary = findSimilarWords(LIBRARY, numWordsToHide + 5, 0.6)
        console.log(wordLibrary)
    }
    else
    {
        LIBRARY = LIBRARY.concat(inputWords);
        wordLibrary = inputWords;
    }


    
    
    let numOfTries = 0
    abc = blend(wordLibrary)
    board = generateRandomBoard();
    while(wordsInBoard.length < numWordsToHide && numOfTries < Math.pow(abc.length,size*size-countTrue(board.locked)) )
    {
        board = nextBoardPermutation(board);
        wordsInBoard = findWordsInBoard();
        
        lockPaths(wordsInBoard);
        if(wordsInBoard.length > progress)
        {
            progress = wordsInBoard.length
            console.log("Found words in board: "+progress)
            console.log(board.letters)
            console.log(board.locked)
            numOfTries = 0;
            for (let i = 0; i < wordsInBoard.length; i++) {
                const element = wordLibrary[i];
                wordLibrary.splice(wordLibrary.indexOf(element),1);
                
                console.log("Found word: " + element + " Remaining:" + wordLibrary);
                
                
                
            }
            abc = blend(wordLibrary)
            board = generateRandomBoard(board, true);

        }
        if(numOfTries++%10000 == 0)
        {
            console.log(abc)
            console.log("Number of tries: "+numOfTries + "/" + Math.pow(abc.length,size*size-countTrue(board.locked)))
        }
    }

    console.log("All possibilities tried. Searching through library")

    // FINAL CHANGES
    wordLibrary = LIBRARY
    board = generateRandomBoard(board, true, ABC)
    while(countTrue(board.locked) != size*size)
    {
        board = nextBoardPermutation(board, ABC)
        wordsInBoard = findWordsInBoard();
        lockPaths(wordsInBoard);
    }
    

    squardle.name = squardleName;
    squardle.letters = board.letters;
    squardle.wordsToFind = wordsInBoard;
    save();
}




// BOARD
abc = "abcde"
function generateRandomBoard(oldBoard = null, letLockedSame = false,abcLocal = abc)
{
    let newBoard;
    if(oldBoard) // is already generated
    {
        newBoard = {
            letters: [],
            locked: JSON.parse(JSON.stringify(oldBoard.locked)),
        }
        for(let i = 0; i < size; i++)
        {
            let rowLetters = [];
            for(let y = 0; y < size; y++)
            {
                if(newBoard.locked[i][y])
                {
                    rowLetters.push(oldBoard.letters[i][y]);
                }
                else
                {
                    rowLetters.push(abcLocal[Math.floor(Math.random() * abcLocal.length)]);
                }
                
            }
            newBoard.letters.push(rowLetters);
        }
    }
    else    // isnt generated
    {
        newBoard = {
            letters: [],
            locked: [],
        }
        for(let i = 0; i < size; i++)
        {
            let rowLetters = [];
            let rowLocked = [];
            for(let y = 0; y < size; y++)
            {
                rowLetters.push(abc[Math.floor(Math.random() * abcLocal.length)]);
                rowLocked.push(false);
            }
            newBoard.letters.push(rowLetters);
            newBoard.locked.push(rowLocked);
        }

    }
    return newBoard;
}
function nextBoardPermutation(oldBoard, abcLocal  = abc)
{
    let newBoard = oldBoard;
    let overflow = false;
    for(let i = 0; i < size; i++)
    {
        for(let y = 0; y < size; y++)
        {
            if(newBoard.locked[i][y])
            {
                overflow = true;
                continue;
            }
            overflow = false;
            let nextIndex = abcLocal.indexOf(newBoard.letters[i][y]) + 1;
            if(nextIndex >= abcLocal.length)
            {
                newBoard.letters[i][y] = abcLocal[0];
                overflow = true;
            }
            else
            {
                newBoard.letters[i][y] = abcLocal[nextIndex];
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
    return newBoard;
}
function lockPath(path)
{

    for (let i = 0; i < path.positions.length; i++) {
        const element = path.positions[i];
        board.locked[element[0]][element[1]] = true;  
    }
}
function lockPaths(paths)
{
    for (let i = 0; i < paths.length; i++) {
        lockPath(paths[i])
    }
}

function countTrue(boolArr)
{
    let sum = 0;
    for (let i = 0; i < boolArr.length; i++) {
        const element = boolArr[i];
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
function findWordsInBoard()
{
    let output = []
    let wordPath = {
        positions:[]
    }
    for(let x = 0; x < size; x++)
    {
        for(let y = 0; y < size; y++)
        {
            const X = x;
            const Y = y
            wordPath.positions.push([X,Y]);
            constuctWord(wordPath, output);
            wordPath.positions.pop();
        }
    }
    return output;
}
function constuctWord(wordPath, output)
{
    let x = wordPath.positions[wordPath.positions.length - 1][0];
    let y = wordPath.positions[wordPath.positions.length - 1][1];
    if(wordPath.positions.length > maxWordSize || !canBeInList(createWord(wordPath),wordLibrary))// too long or cant be a word
    {
        return;
    }
    if(wordPath.positions.length >= minWordSize)// if not too short, try to find it in library
    {
        if(wordLibrary.includes(createWord(wordPath)) && !hasWordIncluded(wordPath, output))
        {
            output.push(JSON.parse(JSON.stringify(wordPath)));
        }
    }
    // add another letter from adjactent tiles
    for(let i = -1; i <= 1; i++)
    {
        for(let j = -1; j <= 1; j++)
        {
            if(x + i >= 0 && x + i < size && y + j >= 0 && y + j < size && (i != 0 || j != 0))// is in board and isnt the same
            {
                // new position
                const X = x + i;
                const Y = y + j;
                if(wordPath.positions.filter(element => element[0] == X && element[1] == Y).length == 0)
                {           
                    wordPath.positions.push([X,Y]);
                    constuctWord(wordPath,output);
                    wordPath.positions.pop();
                }
            }
        }
    }

}
function createWord(path)
{
    let string = "";
    path.positions.forEach(element => {
        string += board.letters[element[0]][element[1]];
    });
    return string;
}
function hasWordIncluded(path, paths)
{
    let word = createWord(path)
    for (let i = 0; i < paths.length; i++) {
        const element = createWord(paths[i]);
        if(word == element)
        {
            return true;
        }
    }
    return false;
}

// SIMILAR WORDS
function similatiryOfWords(word1, word2)
{
    if(word1.length > word2.length)
    {
        return similatiryOfWords(word2,word1);
    }
    if(word1.length == 0)
    {
        return 0;
    }
    // just to be sure they dont get edited
    word1 = JSON.parse(JSON.stringify(word1))
    word2 = JSON.parse(JSON.stringify(word2))
    // sum letters in both 
    let numOfLettersInBoth = 0;  
    for(let i = 0; i < word1.length; i++) {
        const element = word1[i];
        let index = word2.indexOf(element)
        if(index != -1)
        {
            word2 = word2.replace(word2[index],"");
            numOfLettersInBoth++;
        }
    }
    let first = numOfLettersInBoth/word1.length;
    let second = numOfLettersInBoth/(numOfLettersInBoth+word2.length)
    return (first);
}
function similarityOfArrayOfWords(words)
{
    let currentThresholds = []
    for (let i = 0; i < words.length; i++) {
        for (let y = 0; y < words.length; y++) {
            if(i != y)
            {
                currentThresholds.push(similatiryOfWords(words[i],words[y]));
            }
        }
    }
    return calculateAverage(currentThresholds);
}
function findSimilarWords(library, amount, threshold)
{
    
    let words;
    if(amount == 1)
    {
        words = [];
    }
    else
    {
        words = findSimilarWords(library, amount - 1, threshold)
    }
    let anotherWord;
    let i = 0;
    do
    {
        anotherWord = library[i]
        i++;
        
    }while(!isInLimits(anotherWord)||words.includes(anotherWord)||(similarityOfArrayOfWords([...words,anotherWord])<threshold));
    return words.concat([anotherWord]);
}
function blend(words)
{
    let newABC = "";
    words.map((word)=>{
        for (let i = 0; i < word.length; i++) {
            const element = word[i];
            if(!newABC.includes(element))
            {
                newABC+=element;
            }
        }
    })
    return newABC;
}
function calculateAverage(array) {
    var total = 0;
    var count = 0;

    array.forEach(function(item, index) {
        total += item;
        count++;
    });

    return total / count;
}
function isInLimits(word)
{
    if(word.length > minWordSize && word.length < maxWordSize)
    {
        return true;
    }
    return false;

}
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
        console.log(createWord(element))
    }
}
// OPTIMALIZATION

//1) when bžk, then not a word
function canBeInList(startOfWord, list)
{
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        if(element.indexOf(startOfWord) != -1)
        {
            return true;
        }
    }
    return false;
}



// SAVING EXPORTING


function toArray(b)
{
    let arr = [];
    b.forEach(element => {
       arr.push(element); 
    });
    return arr;
}
function save()
{
    // save letters in board
    // let jsonLetters = JSON.stringify(toArray(squardle.letters));
    // fs.writeFileSync('data/Board'+fileName  + '.json', jsonLetters);
    // // save found words
    // let jsonWords = JSON.stringify(squardle.wordsToFind);
    // fs.writeFileSync('data/WordsToFind'+fileName+'.json', jsonWords);
    fs.writeFileSync('data/squardle_'+fileName  + '.json', JSON.stringify(squardle));
}

initialize();