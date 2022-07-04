

// date
let originDate = new Date("Thu Jun 30 2022 08:41:21 GMT+0200 (Central European Summer Time)")
let date = new Date();
// input data
let size = 10; // size of board
let lettersInBoard = []; // letters in board
let wordsToFind =[];
let wordsFound = []; // bool array
// variables for finding word
let mousePressed = false;
let wordPath = {
    positions:[]
}

//design



async function initialize(){
    await loadData();

    createBoard();
    updateScore();
    updateFound();
}
// LOAD DATA
async function loadData()
{
    // index
    let indexOfSquardle = Math.floor((date.getTime() - originDate.getTime())/(3600*24*1000));
    indexOfSquardle = 3;//----------------------------------------------
    // letters
    let tmpBoard = await getJson("./data/Board" + indexOfSquardle +".json");
    size = tmpBoard.length;
    for (let i = 0; i < tmpBoard.length; i++) {
        const element = tmpBoard[i];
        for (let j = 0; j < element.length; j++) {
            const subElement = element[j];
            lettersInBoard.push(subElement);
        }
    }

    
    // words
    wordsToFind = await getJson("./data/WordsToFind" + indexOfSquardle +".json");

    console.log(localStorage.getItem("progress"))
    // load progress
    if(localStorage.getItem("progress") !== null)
    {
        wordsFound = [];
        wordsFound = JSON.parse(localStorage.getItem("progress"));
    }
    else
    {
        for (let i = 0; i < wordsToFind.length; i++) {
            const element = wordsToFind[i];
            wordsFound.push(false);
        }

    }

}

async function getJson(url){
    const obj = await fetch(url)
    const jsonObj = await obj.json()
    return jsonObj
}


// BOARD
function createBoard()
{
    let table = document.createElement("table");
    
    for(var i = 0; i < size; i++)
    {
        let row = document.createElement("tr");
        row.className = "row";

        for(var j = 0; j <size; j++)
        {
            let cell = document.createElement("td");
            cell.className = "cell";
            let button = document.createElement("button");
            button.className = "button";
            
            let text = document.createTextNode(lettersInBoard[i*size + j]);
            let x = i;
            let y = j;
            
            // button.addEventListener("click",function(){console.log("POMOC");mouseClick()});
            // button.addEventListener("mousedown",function(){mouseDown(x,y)});
            // button.addEventListener("mouseup", function(){mouseUp()});
            // button.addEventListener("mouseenter",function(){mouseEnter(x,y)});
            button.addEventListener("click",function(){mouseClick(x,y)});
            button.addEventListener("pointerdown",function(){mouseDown(x,y)});
            button.addEventListener("pointerup", function(){mouseUp()});
            button.addEventListener("pointerenter",function(){mouseEnter(x,y)});


            button.appendChild(text);
            cell.appendChild(button);
            row.appendChild(cell);

        }
        table.appendChild(row);
    }

    let board = document.getElementById("board");
    board.appendChild(table);
}
function getButton(x,y)
{
    
    return document.getElementsByClassName("row")[x].childNodes[y].firstChild;

}

// SELECTING WORD
function mouseClick()
{
    //mouseUp();
}
function mouseDown(x,y)
{
    // mouse is pressed now
    mousePressed = true;
    // changes button color etc.
    let button = getButton(x,y);

    button.classList.add("selected");
    // saves position to wordPath
    wordPath.positions.push([x,y]);

    updateWord()
    
}
function mouseUp()
{
    mousePressed = false;
    // unselects button
    wordPath.positions.forEach(element => {
        let button = getButton(element[0],element[1]);
        button.classList.remove("selected");
    });
    testMainWord();
    // resets array
    wordPath.positions = [];
    
}
function mouseEnter(x,y)
{
    if(!mousePressed)
    {
        return;
    }
    let button = getButton(x,y);
    if(wordPath.positions.length > 0 && wordPath.positions.filter(element => element[0] == x && element[1] == y).length > 0)// if position was already visited
    {
        if(wordPath.positions.length > 0 && wordPath.positions[wordPath.positions.length-2][0] == x && wordPath.positions[wordPath.positions.length-2][1] == y)// if user is going back
        {
            // deletes last position
            let top = wordPath.positions.pop();
            // unselects last button
            getButton(top[0],top[1]).classList.remove("selected");
        }
    }
    else if(wordPath.positions.length > 0 && Math.abs(wordPath.positions[wordPath.positions.length-1][0] - x) <=1  && Math.abs(wordPath.positions[wordPath.positions.length-1][1] - y) <=1 )
    {
        button.classList.add("selected");
        wordPath.positions.push([x,y]);
    }
    updateWord(createWord(wordPath));
}

// OUTPUT WORD
function createWord(path)
{
    let string = "";
    path.positions.forEach(element => {
        string += lettersInBoard[size*element[0] + element[1]];
    });
    return string;
}
function updateWord(word)
{
    let wordBox = document.getElementById("output");
    wordBox.textContent = word;

}

// FINDING WORDS

function testMainWord() //<= goes here from mouseUp
{
    console.log("---------------")
    let mainWord = createWord(wordPath);
    for (let i = 0; i < wordsToFind.length; i++) {
        const element = createWord(wordsToFind[i]);
        console.log(element);
        if(mainWord == element)
        {
            if(wordsFound[i] == true)
            {
                // already found
            }
            else
            {
                // new
                wordsFound[i] = true;
            }
        }
    }
    updateScore();
    updateFound();

}

function updateScore()
{
    
    let score = 0;
    for (let i = 0; i < wordsFound.length; i++) {
        if(wordsFound[i])
        {
            let word = createWord(wordsToFind[i]);
            score += word.length * word.length;
        }
        
    }
        
    let scoreBox = document.getElementById("score");
    scoreBox.textContent = score + " bodů";
}

function updateFound()
{
    
    let textBox = document.getElementById("found");
    while(textBox.firstChild)
    {
        textBox.removeChild(textBox.firstChild);
        
    }
    let numOfFound = 0
    for (let i = 0; i < wordsFound.length; i++) {
        if(wordsFound[i])
        {
            numOfFound++;
        }
    }
    let numText = document.createElement("p");
    numText.textContent = "Nalezená slova (" + numOfFound + "/" + wordsFound.length + ")";
    numOfFound.id = "numFound";
    textBox.appendChild(numText);




    
    for (let i = 0; i < wordsFound.length; i++) {
        if(wordsFound[i])
        {
            let word = createWord(wordsToFind[i]);
            let paragraph = document.createElement("p");
            paragraph.textContent = word;
            paragraph.classList.add("foundWord");
            textBox.appendChild(paragraph);
        }
        
    }
    saveProgress();
    
}

function saveProgress()
{
    localStorage.setItem("progress",JSON.stringify(wordsFound));
}


// calls starting program function
initialize()