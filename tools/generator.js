// requirements
const fs = require('fs');

// sources
let ABC = "abcdefghijklmnopqrstuvwxyzáéíýóúřčěš"
let LIBRARY = JSON.parse(fs.readFileSync("libraries/libraryConnected.json"));

// parameters
let size = 3;
let fileName = "5"
let minWordSize = 3;
let maxWordSize = 5;
let numWordsToHide = 3;

// output
let squardle ={
    letters:[],
    wordsToFind:[],
}


// variables
let board;
let wordsInBoard = [];
let wordLibrary = LIBRARY;



let progress = 0;

// START
function initialize()
{
    LIBRARY = shuffle(LIBRARY)
    wordLibrary = findSimilarWords(LIBRARY, numWordsToHide + 5, 0.3)
    console.log(wordLibrary)
    abc = blend(wordLibrary)
    board = generateRandomBoard();
    while(wordsInBoard.length < numWordsToHide)
    {
        board = nextBoardPermutation(board);
        //console.log(board)
        wordsInBoard = findWordsInBoard();
        lockPaths(wordsInBoard)
        if(wordsInBoard.length > progress)
        {
            progress = wordsInBoard.length
            console.log(progress)
        }
        //console.log(wordsInBoard.length)
        //printWords();
    }
    wordLibrary = LIBRARY;
    wordsInBoard = findWordsInBoard();
    squardle.letters = board.letters;
    squardle.wordsToFind = wordsInBoard;
    save();
}


// BOARD
abc = "abcde"
function generateRandomBoard(oldBoard = null, abcLocal = abc)
{
    let newBoard;
    if(oldBoard) // is already generated
    {
        newBoard = {
            letters: [],
            locked: oldBoard,
        }
        for(let i = 0; i < size; i++)
        {
            let rowLetters = [];
            for(let y = 0; y < size; y++)
            {
                if(newBoard.locked[i][y])
                {
                    rowLetters.push(oldBoard[i][y]);
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



//SAVING
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
    let jsonLetters = JSON.stringify(toArray(squardle.letters));
    fs.writeFileSync('data/Board'+fileName  + '.json', jsonLetters);
    // save found words
    let jsonWords = JSON.stringify(squardle.wordsToFind);
    fs.writeFileSync('data/WordsToFind'+fileName+'.json', jsonWords);
}

initialize();