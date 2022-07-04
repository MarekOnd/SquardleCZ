const fs = require('fs');

// parameters
let size = 5;
let fileName = "0";
let minWordSize = 3;
let maxWordSize = 6;
let wordsToHide = 10;
// sources
let abc = "abcdefghijklmnopqrstuvwxyzáéíýóúřčěš"
let wordLibrary = JSON.parse(fs.readFileSync("./libraryConnected.json"));

// variables
let board;
let foundWordPaths = [];
let wordPath = {
    positions:[],
};

let count = 0;
function start()
{
    setupBlendedLibrary();
    permutationsFindSolutions();
    save();
    //snakesFindSolution();
    //save();
}

function randomFindSolutions()
{

    do
    {
        foundWordPaths = [];
        if(count++%10000==0)
        {
            console.log(count);
        }
        generateBoardLetters();
        findWordsInBoard();
        console.log(foundWordPaths.length )
        
    }while(foundWordPaths.length < wordsToHide)
    
}
// GENERATE PERMUTATION OF BOARD

function permutationsFindSolutions()
{
    generateBoardWithAll(0);
    do
    {
        findWordsInBoard()
        if(foundWordPaths.length != 0)
        {
            console.log(foundWordPaths.length )
        }
        //
    }while(foundWordPaths.length < wordsToHide)
}
function nextBoardPermutation()
{

    let overflow = false;
    for(let i = 0; i < size; i++)
    {
        for(let y = 0; y < size; y++)
        {
            overflow = false;
            let nextIndex = abc.indexOf(board[i][y]) + 1;
            if(nextIndex >= abc.length)
            {
                board[i][y] = abc[0];
                overflow = true;
            }
            else
            {
                board[i][y] = abc[nextIndex];
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
    //numOfPermutations++;
}
function generateBoardWithAll(indexInAbc)
{
    board = []
    for(let i = 0; i < size; i++)
    {
        let row = [];
        for(let y = 0; y < size; y++)
        {
            row.push(abc[indexInAbc]);
        }
        board.push(row);
    }
}



// RANDOM LETTERS GEN
function generateBoardLetters()
{
    board = [];
    for(let i = 0; i < size; i++)
    {
        let row = [];
        for(let y = 0; y < size; y++)
        {
            row.push(abc[Math.floor(Math.random() * abc.length)]);
        }
        board.push(row);
    }
}

function toArray(b)
{
    let arr = [];
    b.forEach(element => {
       arr.push(element); 
    });
    return arr;
}

// RECURSIVE SEARCH THROUGH BOARD
// 

function findWordsInBoard()
{
    for(let x = 0; x < size; x++)
    {
        for(let y = 0; y < size; y++)
        {
            const X = x;
            const Y = y
            wordPath.positions.push([X,Y]);
            constuctWord(X,Y);
            wordPath.positions.pop();
        }
    }
}
function constuctWord(x, y)// x y is where to start
{ 
    if(wordPath.positions.length > maxWordSize)// too long
    {
        return;
    }
    if(wordPath.positions.length >= minWordSize)// if not too short, try to find it in library
    {
        testWord();
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
                    constuctWord(X,Y);
                    wordPath.positions.pop();
                }
            }
        }
    }

}
let timesTested = 0;
function testWord()
{
    // if(timesTested++%1000==0)
    // {
    //     console.log("tests: " + timesTested);
    // }
    let w = createWord(wordPath);
    let length = w.length;
    let isInLibrary = false;
    for (let i = 0; i < wordLibrary.length; i++) {
        const element = wordLibrary[i];
        if(element == w)
        {
            isInLibrary = true;
        }
        
    }
    if(!isInLibrary)
    {
        return;
    }
    for (let i = 0; i < foundWordPaths.length; i++) {
        const element = foundWordPaths[i];
        if(createWord(element) === w)
        {
            return;
        }
        
    }
    foundWordPaths.push(JSON.parse(JSON.stringify(wordPath)));

}
function createWord(path)
{
    let string = "";
    path.positions.forEach(element => {
        string += board[element[0]][element[1]];
    });
    return string;
}


// SIMILARITY OF WORDS
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

function getRandomWords(amount)
{
    if(amount == 1)
    {
        return getRandomWord();
    }
    let words = [];
    for (let i = 0; i < amount; i++) {
        words.push(getRandomWord());
    }
    return words;
}

function getRandomWord()
{
    return wordLibrary[Math.floor(wordLibrary.length*Math.random())];
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

// constructing new library
function setupBlendedLibrary()
{
    let verySimilarWords;
    let shuffledLibrary = shuffle(wordLibrary)
    do
    {
        shuffledLibrary = shuffle(shuffledLibrary)
        //console.log(shuffledLibrary)
        verySimilarWords = findSimilarWords(shuffledLibrary,wordsToHide,0.7);
        abc = blend(verySimilarWords);
        console.log(verySimilarWords);
        console.log(similarityOfArrayOfWords(verySimilarWords));
        console.log(abc)
    }
    while(abc.length > 10)

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


// SNAKES


// 1 2 3
// 4 5 6
// 7 8 9
function snakesFindSolution(words)
{
    emptyBoard();
    for (let i = 0; i < words.length; i++) {
        const element = words[i];
        addWordSnake(element);
        
    }
}

function addWordSnake(word)
{
    // random positioning order
    let order = getNumArray(size*size);
    order = shuffle(order);
    // random direction order is from filtering order
    let notBestWordPath = {
        positions:[],
    }
    let scoreOfWordPath = 0;


    
    for (let y = 0; y < word.length; y++)// for each letter
    {
        let localOrder;
        if(notBestWordPath.positions.length == 0)// first letter can go anywhere
        {
            localOrder = order;
        }
        else // others must be connected
        {
            let lastPosition = notBestWordPath.positions[notBestWordPath.positions.length - 1];
            localOrder = order.filter(element =>
                (Math.abs(indexToPos(element)[0] - lastPosition[0]) <= 1) && 
                (Math.abs(indexToPos(element)[1] - lastPosition[1]) <= 1) &&
                (lastPosition != indexToPos(element))
            )
        }

        for (let i = 0; i < localOrder.length; i++)// try place on every place in local order
        {
            let nextPosition = indexToPos(localOrder[i]);
            if(!notBestWordPath.positions.includes(nextPosition))
            {
                
            }
            
    
            
        }
        
        
    }
    


}

function getLetterAtPosition(pos)
{
    return board[pos[0],pos[1]];
}


function emptyBoard()
{
    board = [];
    for(let i = 0; i < size; i++)
    {
        let row = [];
        for(let y = 0; y < size; y++)
        {
            row.push("0");
        }
        board.push(row);
    }
}

function getNumArray(size)
{
    let array = [];
    for (let i = 0; i < size; i++) {
        array.push(i);
    }
    return array;
}


function indexToPos(index)
{
    return [Math.floor(index/size),index - Math.floor(index/size)];
}
function posToIndex(pos)
{
    return pos[0]*size + pos[1];
}












function save()
{
    // save letters in board
    let b = toArray(board);
    let jsonLetters = JSON.stringify(b);
    fs.writeFileSync('./Squardle/data/Board'+fileName  + '.json', jsonLetters);
    // save found words
    let jsonWords = JSON.stringify(foundWordPaths);
    fs.writeFileSync('./Squardle/data/WordsToFind'+fileName+'.json', jsonWords);
}



start()