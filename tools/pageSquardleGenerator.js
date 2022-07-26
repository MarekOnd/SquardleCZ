
// sources
let ABC = "abcdefghijklmnopqrstuvwxyzáéíýóúřčěš"
let LIBRARY;

// parameters
let size = 5;
let squardleName = "Omega"
let fileName = "15"
let minWordSize = 4;
let maxWordSize = 14;
let numWordsToHide = 5;

let useInputWords = false
let inputWords = [
];

// output
let squardle = new Squardle();

// variables
let board;
let wordsInBoard = [];
let wordsInBoardFromPrevious = [];
let wordLibrary;


let progress = 0;

// START
async function createSquardle(sqSettings)
{
    // resetting old parameters
    squardle = new Squardle();
    wordsInBoard = [];
    wordsInBoardFromPrevious = [];
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
        console.log("Hledám " + element);//§§§

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
            console.log("Slovo " + element + " bylo nalezeno");
        }
        else
        {
            console.log("Slovo " + element + " nebylo nalezeno")
        }
        board.lockPaths(wordsInBoard)
    }
    

    console.log("All possibilities tried. Searching through library")

    // FINAL CHANGES

    board.library = LIBRARY;
    wordsInBoard = board.findWordsInBoard();
    board.lockPaths(wordsInBoard)
    board.alphabet = ABC;
    board.generateRandomBoard(true)
    wordsInBoard = board.findWordsInBoard();

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



// BOARD
abc = "abcde"


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
        console.log(createWord(board, element))
    }
}



