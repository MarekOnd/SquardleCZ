

// date
let originDate = new Date("Thu Jun 30 2022 08:41:21 GMT+0200 (Central European Summer Time)")
let indexOfSquardle;
  //let indexOfSquardle = Math.floor((date.getTime() - originDate.getTime())/(3600*24*1000));

// information
let numberOfSquardles = 22;


// input data
let S;


let libraryName = "czech.json"
let LIBRARY = [];

// variables for finding word
let mousePressed = false;
let wordPath = {
    positions:[]
}

// progress
let wordsFound = []; // bool array
let bonusWordsFound = [];

let isNewSave;

// board
let board = document.getElementById("board");


async function initialize(){
    LIBRARY = await getJson("./libraries/" + libraryName)
}
// LOAD DATA
async function loadSquardle(squardleToLoad)
{
    S = squardleToLoad;

    // if(S.wordsToFind[0].positions[0].x === undefined)// this means its in old style
    // {
    //     isNewSave = false;
    //     let newWordsToFindPaths = []
    //     for (let i = 0; i < S.wordsToFind.length; i++) {
    //         const element = S.wordsToFind[i];
    //         let tmpPath = [];
    //         for (let y = 0; y < element.positions.length; y++) {
    //             const oldPos = element.positions[y];
    //             element.positions[y] = new Position(oldPos[0], oldPos[1])
    //             //tmpPath.push(new Position(oldPos[0],oldPos[1]));
                
    //         }
    //         newWordsToFindPaths.push(tmpPath);
    //     }
    // }
    // else
    // {
    //     newSave = true;
    // }

    // loading progress
    // wordsFound = [];
    // bonusWordsFound = [];
    // let savedProgress = localStorage.getItem(hashSquardle(S));
    // console.log(savedProgress)
    // if(savedProgress !== null)
    // {
    //     let parseSavedProgress = JSON.parse(savedProgress);
    //     wordsFound = parseSavedProgress.wordsFound;
    //     bonusWordsFound = parseSavedProgress.bonusWordsFound;
    // }
    // else
    // {
    //     wordsFound = [];
    //     for (let i = 0; i < S.wordsToFind.length; i++) {
    //         wordsFound.push(false);
    //     }
    // }
    squardleLoadProgress();

    // CAN LOOK FOR WORDS
    document.getElementById("board").classList.remove("disabled")


    window.addEventListener("pointerup",()=>{mouseUp()})
    createBoard();
    updateScore();
    updateFound();
    updateLettersInBoard()
    
    // // index
    // if(localStorage.getItem("index")!==null)
    // {
    //     indexOfSquardle = JSON.parse(localStorage.getItem("index"))
    // }
    // else
    // {
    //     indexOfSquardle = 0;
    // }


    // // loading structure
    // let squardle = await getJson("./data/squardle_" + indexOfSquardle +".json");
    // S.letters = JSON.parse(JSON.stringify(squardle.letters));

    // // words
    // S.wordsToFind = squardle.wordsToFind;
    // // load progress
    // if(localStorage.getItem("progress_" + indexOfSquardle) !== null)
    // {
    //     wordsFound = [];
    //     wordsFound = JSON.parse(localStorage.getItem("progress_" + indexOfSquardle));
    // }
    // else
    // {
    //     for (let i = 0; i < S.wordsToFind.length; i++) {
    //         const element = S.wordsToFind[i];
    //         wordsFound.push(false);
    //     }
    // }

    // bonusWordsFound = [];
    // if(localStorage.getItem("bonus_" + indexOfSquardle) !== null)
    // {
    //     bonusWordsFound = JSON.parse(localStorage.getItem("bonus_" + indexOfSquardle));
    // }

    // LIBRARY
    
}

// SAVE SQUARDLE USER IS PLAYING
// function changeIndex()
// {   
//     saveProgress();
//     let newIndex = document.getElementById("index-selector").selectedIndex;
//     localStorage.setItem("index", JSON.stringify(newIndex))
//     initialize();
// }

// async function initSelector()
// {
//     let selector = document.getElementById("index-selector");
//     while(selector.firstChild)
//     {
//         selector.removeChild(selector.firstChild)
//     }
//     let i = 0;
//     let squardle
//     do{
//         squardle = await getJson("./data/squardle_" + i +".json");
//         let newItem = document.createElement("option");
//         newItem.textContent = squardle.name;
//         newItem.value = i-1;
//         selector.appendChild(newItem);
//         i++;
//     }while(i <= numberOfSquardles)
//     document.getElementById("index-selector").selectedIndex = indexOfSquardle
// }

// BOARD
function createBoard()
{
    let board = document.getElementById("board");
    let table = document.getElementById("table");
    // deletes existing children
    while(table.firstChild)
    {
        table.removeChild(table.firstChild)
    }
    // creates new board
    for(var i = 0; i < S.letters.length; i++)
    {
        let row = document.createElement("tr");
        row.className = "row";

        for(var j = 0; j < S.letters[i].length; j++)
        {
            
            // celle and button
            let cell = document.createElement("td");
            cell.className = "cell";
            
            let button = document.createElement("div");
            button.className = "boardButton";
            if(S.letters[i][j] === "0")
            {
                button.style.display = "none";
            }

            // how many words use this letter, how many start with letter

            let letter = document.createElement("div")
            letter.className = "button-letter";
            let text = document.createTextNode(S.letters[i][j]);
            letter.appendChild(text);
            button.appendChild(letter)

            let use = document.createElement("div");
            use.className = "button-use";
            let start = document.createElement("div");
            start.className = "button-start";
            button.appendChild(use);
            button.appendChild(start);

            // text
            

            // events
            let x = i;
            let y = j;
            
            button.addEventListener("click",function(){mouseClick(x,y)});
            button.addEventListener("pointerdown",function(){mouseDown(x,y)});
            button.addEventListener("pointerup", function(){mouseUp()});
            button.addEventListener("pointerenter",function(){mouseEnter(x,y)});
            button.addEventListener("gotpointercapture",(e)=>{e.target.releasePointerCapture(e.pointerId)})

            // final apendage
            
            cell.appendChild(button);
            row.appendChild(cell);

        }
        table.appendChild(row);
    }
}
function getButton(x,y)
{
    let but = document.getElementsByClassName("row")[x].childNodes[y].firstChild;
    if(but)
    {
        return but;
    }
    else
    {
        return null;
    }
}

function updateLettersInBoard()
{
    let allIncludedPositions = [];
    let startingPositions = [];
    for (let i = 0; i < S.wordsToFind.length; i++) {
        if(!wordsFound[i])
        {
            for (let y = 0; y < S.wordsToFind[i].positions.length; y++) {
                allIncludedPositions.push(S.wordsToFind[i].positions[y]);
            }
            
            startingPositions.push(S.wordsToFind[i].positions[0])
        }
        
    }
    

    for (let i = 0; i < S.letters.length; i++) {
        
        for (let y = 0; y < S.letters.length; y++) {
            let button = getButton(i,y);
            if(!button)
            {
                continue;
            }
            let timesUsedInWord = allIncludedPositions.filter(el=>(el.x==i&&el.y==y)).length


            
            let use = button.getElementsByClassName("button-use")[0]; // button always has one
            let start = button.getElementsByClassName("button-start")[0]; // button always has one
            // update active letters
            if(!button.classList.contains("allWereFound") && timesUsedInWord === 0)
            {
                button.classList.add("allWereFound");
                use.textContent = ""
                start.textContent = ""
            }
            else
            {
                // update times used in a word
                //let use = button.getElementsByClassName("button-use")[0]; // button always has one
                if(timesUsedInWord > 0)
                {
                    use.textContent = timesUsedInWord;
                }
                else
                {
                    use.textContent = ""
                }
                

                // update first time in words
                //let start = button.getElementsByClassName("button-start")[0]; // button always has one
                let timesStartingWithThis = startingPositions.filter(el=>(el.x==i&&el.y==y)).length;
                if(timesStartingWithThis > 0)
                {
                    start.textContent = timesStartingWithThis
                }
                else
                {
                    start.textContent = ""
                }

            }
            

        }
    }
    

}

// SELECTING WORD
function mouseClick()
{
    //mouseUp();
}
function mouseDown(x,y)
{
    // disable
    if(board.classList.contains("disabled"))
    {
        return;
    }
    //--
    // mouse is pressed now
    mousePressed = true;
    // changes button color etc.
    let button = getButton(x,y);

    button.classList.add("selected");
    // saves position to wordPath
    wordPath.positions.push(new Position(x,y));

    updateWord(createWord(wordPath), "white")
    updateLine()
}
function mouseUp()
{
    // disable
    if(board.classList.contains("disabled"))
    {
        return;
    }
    //--
    mousePressed = false;
    if(wordPath.positions.length == 0)
    {
        return;
    }
    // unselects button
    wordPath.positions.forEach(element => {
        let button = getButton(element.x,element.y);
        button.classList.remove("selected");
    });
    testMainWord();
    // resets array
    wordPath.positions = [];

    updateLine()
    
}
function mouseEnter(x,y)
{
    // disable
    if(board.classList.contains("disabled"))
    {
        return;
    }
    //--
    if(!mousePressed)
    {
        return;
    }
    let button = getButton(x,y);
    if(wordPath.positions.length > 0 && wordPath.positions.filter(element => element.x === x && element.y === y).length > 0)// if position was already visited
    {
        if(wordPath.positions.length > 1 && wordPath.positions[wordPath.positions.length-2].x === x && wordPath.positions[wordPath.positions.length-2].y === y)// if user is going back
        {
            // deletes last position
            let top = wordPath.positions.pop();
            // unselects last button
            getButton(top.x,top.y).classList.remove("selected");
        }
    }
    else if(wordPath.positions.length > 0 && Math.abs(wordPath.positions[wordPath.positions.length-1].x - x) <=1  && Math.abs(wordPath.positions[wordPath.positions.length-1].y - y) <=1 )
    {
        button.classList.add("selected");
        wordPath.positions.push(new Position(x,y));
    }
    updateWord(createWord(wordPath), "white");

    updateLine()
}

// OUTPUT WORD
function createWord(path)
{
    let string = "";
    path.positions.forEach(element => {
        string += S.letters[element.x][element.y];
    });
    return string;
}

function createWords(paths)
{
    let words = [];
    for (let i = 0; i < paths.length; i++) {
        const element = paths[i];
        words.push(createWord(element));
    }
    return words;
}

let timeout;
let secondTimeout;
function updateWord(word, color = null)
{
    let wordBox = document.getElementById("output");
    wordBox.textContent = word;
    if(color)
    {
        wordBox.style.cssText += 'color: ' + color;
    }
    clearTimeout(timeout);
    clearTimeout(secondTimeout)
    timeout = setTimeout(()=>{
        let points = [
            { color: 'rgb(0,0,0,0)'},
        ];
        let timing ={
            duration: 1000,
            iterations: 1,
        }
        wordBox.animate(points,timing);
        secondTimeout = setTimeout(()=>{
            updateWord("")
        },900)
        
    },2000)

}

// FINDING WORDS

function testMainWord() //<= goes here from mouseUp
{
    let output = document.getElementById("output")
    let mainWord = createWord(wordPath);
    for (let i = 0; i < S.wordsToFind.length; i++) {
        const element = createWord(S.wordsToFind[i]);
        if(mainWord === element)
        {
            if(wordsFound[i] === true)
            {
                // already found
                updateWord("Již nalezeno", "white")
            }
            else
            {
                // new
                wordsFound[i] = true;
                updateScore();
                updateFound();
                updateLettersInBoard()
                updateWord("Nalezeno slovo", "green")
            }
            return;
        }
    }
    if(LIBRARY.includes(mainWord))
    {
        if(mainWord.length < 4)
        {
            updateWord("Slovo není dostatečně dlouhé", "red")
            return;
        }
        if(!bonusWordsFound.includes(mainWord))
        {
            bonusWordsFound.push(mainWord);
            updateFound();
            updateWord("Bonusové slovo", "cyan")
        }
        else
        {
            updateWord("Již nalezeno (bonusové)", "cyan")
        }
        return;
    }
    updateWord("Není slovo","red")
}

function updateScore()
{
    let score = 0;
    let maxScore = 0
    for (let i = 0; i < wordsFound.length; i++) {
        let word = createWord(S.wordsToFind[i]);
        maxScore += word.length * word.length;
        if(wordsFound[i])
        {
            score += word.length * word.length;
        }
    }
    let scoreBox = document.getElementById("score-points");

    let scoreBar = document.getElementById("score-bar");
    scoreBar.style.width = String(score/maxScore*100) + "%"

    if(score === maxScore)
    {
        win();
    }

    scoreBox.textContent = score + " bodů";
}

// FOUND WORDS LIST

function updateFound()
{
    let headerBox = document.getElementById("found-header");
    let textBox = document.getElementById("found-words");
    // deletes subdivisions
    while(textBox.firstChild)
    {
        textBox.removeChild(textBox.firstChild);
    }
    while(headerBox.firstChild)
    {
        headerBox.removeChild(headerBox.firstChild);
        
    }
    // creates header
    let numOfFound = 0
    for (let i = 0; i < wordsFound.length; i++) {
        if(wordsFound[i])
        {
            numOfFound++;
        }
    }
    //let numText = document.createElement("p");
    headerBox.textContent = "Nalezená slova (" + numOfFound + "/" + wordsFound.length + ")";
    numOfFound.id = "numFound";
    //headerBox.appendChild(numText);

    // appends found words
    let paragraph = document.createElement("div");


    let wordsToFindStrings = createWords(S.wordsToFind);
    let words = []
    for (let i = 0; i < wordsFound.length; i++) {
        if(wordsFound[i])
        {
            words.push(wordsToFindStrings[i])          
        }
    }


    words.sort()
    // THE ULTIMATE FUNCTION TO PRINT FOUND WORDS!!!
    for (let i = 0; i < 20; i++) {
        if(howManyXLongWords(i,wordsToFindStrings) > 0)
        {
            fastAppendText(i + " písmenná slova:", paragraph, "foundWord-letterHeader")
            fastAppendText(words.filter(w=>w.length==i).join("  "), paragraph, "foundWord-words")
            let missing = howManyXLongWords(i,wordsToFindStrings)-howManyXLongWords(i,words)
            if(missing > 0)
            {
                fastAppendText(" + zbývá najít " + missing,paragraph,"foundWord-missing")
            }
            
        }
    }
    fastAppendText("Bonusová slova:" + "(" + bonusWordsFound.length + ")", paragraph,"foundWord-letterHeader")
    fastAppendText(bonusWordsFound.join("  "), paragraph,"foundWord-words")// POTREBA SORTNOUT

    paragraph.classList.add("foundWord");
    textBox.appendChild(paragraph);
    squardleSaveProgress();
    
}

function sortWords(words)
{
    let alphabeticalWords = JSON.parse(JSON.stringify(words)).sort();
    let sortedWords = [];
    for (let i = 0; i < 20; i++) {
        let element = alphabeticalWords.filter(word=>word.length)
        
    }
    return sortedWords;
}


let foundWordsPopUp = false;
function toggleFoundWordsPopUp()
{
    let foundWords = document.getElementById("found");
    if(foundWordsPopUp)
    {
        foundWords.style.display = "none";

    }
    else
    {
        foundWords.style.display = "block";
    }
    foundWordsPopUp = !foundWordsPopUp;
}
// SAVING AND LOADING
function getCurrentSquardleSave()
{
    let save = {
        hash:hashSquardle(S),
        wordsFound:wordsFound,
        bonusWordsFound:bonusWordsFound,
        existed:true
    }
    return save;
}
function squardleSaveProgress()
{
    // localStorage.setItem("progress_" + indexOfSquardle,JSON.stringify(wordsFound));
    // localStorage.setItem("bonus_" + indexOfSquardle, JSON.stringify(""))
    // localStorage.setItem("bonus_" + indexOfSquardle, JSON.stringify(bonusWordsFound));
    console.log(getCurrentSquardleSave())
    setSave(getCurrentSquardleSave())
}

function squardleLoadProgress()
{
    let save = getSquardleSave(S);
    console.log(save)
    if(save.existed === false)
    {
        for (let i = 0; i < S.wordsToFind.length; i++) {
            save.wordsFound.push(false);
        }
    }
    applySave(save)
}

function applySave(save)
{
    wordsFound = save.wordsFound;
    bonusWordsFound = save.bonusWordsFound;
}

// CREATING LINE
function updateLine()
{
    let line = document.getElementById("line")
    while(line.firstChild)
    {
        line.removeChild(line.firstChild);
    }
    line.appendChild(connectButtons(wordPath))
}

function connectButtons(path)
{
    let positions = []
    for (let i = 0; i < path.positions.length; i++) {
        const element = path.positions[i]
        let button = document.getElementsByClassName("row")[element.x].childNodes[element.y].getBoundingClientRect()
        positions.push([button.left + button.width/2 - 20 +  window.scrollX, button.top - 235 + window.scrollY])
    }
    return drawLine(positions)
}

function drawLine(points)
{
    let line = document.createElement("div");
    for (let i = 1; i < points.length; i++) {
        const prevElement = points[i-1]
        const element = points[i];
        line.appendChild(createLine(prevElement[0],prevElement[1],element[0],element[1]));
    }
    return line;

}

// DRAW LINE
function createLineElement(x, y, length, angle) {
    var line = document.createElement("div");
    var styles = 'border: 10px solid rgb(20, 218, 218,0.1); '
               + 'width: ' + length + 'px; '
               + 'height: 0px; '
               + "background-color:rgb(20, 218, 218, 0.5);"
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'position: absolute; '
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; '
               + 'border-radius: 10px;'
               + 'z-index: 2';

    line.setAttribute('style', styles);  
    return line;
}

function createLine(x1, y1, x2, y2) {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y, c, alpha);
}



function fastAppendText(text,where,className="")
{
    let textDiv =document.createElement("div")
    textDiv.textContent = text;
    if(className!="")
    {
        textDiv.classList.add(className)
    }
    where.appendChild(textDiv);
    return textDiv;
}

function howManyXLongWords(x,words)
{
    return words.filter(el=>el.length == x).length;
}

function joinArrays(arrays)
{
    let megaArray = [];
    for (let i = 0; i < arrays.length; i++) {
        for (let y = 0; y < arrays[i].positions.length; y++) {
            megaArray.push(arrays[i].positions[y])
        }
    }
    return megaArray;
}


function win()
{
    let board = document.getElementById("board")
    let points = [
        { transform: 'rotate(0) scale(1)' },
        { transform: 'rotate(-90deg) scale(1.2)' },
        { transform: 'rotate(180deg) scale(1.5)' },
        { transform: 'rotate(360deg) scale(1)' }
    ];
      
    for (let i = 0; i < S.letters.length; i++) {
        
        for (let y = 0; y < S.letters.length; y++) {
            let button = getButton(i,y);
            const timing = {
                duration: 2000-(y+1)*300 - (i+1)*100,
                iterations: 1,
            }
            // button.setAttribute('style','animation-delay: -20000;');
            setTimeout(()=>{
                button.animate(points,timing);
            },(y+1)*300 + (i+1)*100)
            
        }
    }
    
}


// calls starting program function
