

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

let winplayed;
async function initialize(){
    LIBRARY = await getJson("./libraries/" + libraryName)
}
// LOAD DATA
async function loadSquardle(squardleToLoad)
{
    S = squardleToLoad;

    squardleLoadProgress();

    
    if(countTrue(wordsFound) === wordsFound.length)
    {
        winplayed = true;
    }
    else
    {
        winplayed = false;
    }
    // CAN LOOK FOR WORDS
    document.getElementById("board").classList.remove("disabled")


    window.addEventListener("pointerup",()=>{mouseUp()})
    createBoard();

    // add share result
    let share = document.getElementById("share");
    share.removeEventListener("pointerup", openShareWindow);
    share.addEventListener("pointerup", (e)=>{openShareWindow(S)});
    updateWord("","white")
    updateAll();
    
}

function updateAll()
{
    updateHints();
    updateScore();
    updateFound();
    updateLettersInBoard();
}

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

                if(hintTimesIncluded && timesUsedInWord > 0)
                {
                    use.textContent = timesUsedInWord;
                }
                else
                {
                    use.textContent = ""
                }
                

                // update first time in words

                let timesStartingWithThis = startingPositions.filter(el=>(el.x==i&&el.y==y)).length;
                if(hintTimesStarting && timesStartingWithThis > 0)
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
    if(mousePressed)// mouse already pressed somewhere else
    {
        return;
    }

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


function updateWord(word, color = null)
{
    let wordBox = document.getElementById("output");
    wordBox.textContent = word;
    if(color)
    {
        wordBox.style.cssText += 'color: ' + color;
    }
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
                updateAll();
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
    updateWord("Není slovo","red");

    let wordBox = document.getElementById("output");
    let timeout;
    let secondTimeout;
    clearTimeout(timeout);
    clearTimeout(secondTimeout);

    timeout = setTimeout(()=>{
        let points = [
            { color: 'rgb(0,0,0,0)'},
        ];
        let timing ={
            duration: 2000,
            iterations: 1,
        }
        wordBox.animate(points,timing);
        secondTimeout = setTimeout(()=>{
            updateWord(mainWord)
        },1900)
        
    },2000)
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


    scoreBox.textContent = score + " bodů (" + countTrue(wordsFound) + "/" + wordsFound.length + ")";
}

// FOUND WORDS LIST

function updateFound()
{
    let headerBox = document.getElementById("found-header");
    let textBox = document.getElementById("found-words");
    // deletes subdivisions
    clearChildren(textBox);
    clearChildren(headerBox)

    // creates header
    let numOfFound = countTrue(wordsFound);

    headerBox.textContent = "Nalezená slova (" + numOfFound + "/" + wordsFound.length + ")";
    numOfFound.id = "numFound";


    // appends found words
    let paragraph = document.createElement("div");
    
    // THE ULTIMATE FUNCTION TO PRINT FOUND WORDS!!!
    let wordsToFindStrings = createWords(S.wordsToFind);
    let wordsStruct = [] // structured array with connected word and found
    for (let i = 0; i < S.wordsToFind.length; i++) {
        wordsStruct.push({
            str:wordsToFindStrings[i],
            found:wordsFound[i]
        })
    }
    for (let i = 0; i < 20; i++) {
        let iLongWords = wordsStruct.filter((el)=>{return el.str.length === i})
        iLongWords.sort();
        if(iLongWords.length > 0)// has some words of this length
        {
            // header
            fastAppendText(i + " písmenná slova:", paragraph, "foundWord-letterHeader")

            if(hintRandomLetters)
            {
                for (let i = 0; i < iLongWords.length; i++) {
                    const element = iLongWords[i];
                    if(element.found === true)// found
                    {
                        let w = fastAppendText(element.str, paragraph, "foundWord-words")
                        w.addEventListener("click",(w)=>{
                            url ='http://www.google.com/search?q=' + element.str;
                            window.open(url,'_blank');
                        })
                        w.title = "Najít význam ve slovníku";
                    }
                    else // hint
                    {
                        let hiddenWord = "";
                        let howManyLettersToShow = Math.floor(element.str.length/3)
                        for (let i = 0; i < element.str.length; i++) {
                            if(i < howManyLettersToShow)
                            {
                                hiddenWord += element.str[i]
                            }
                            else
                            {
                                hiddenWord += "*"
                            }
                            
                        }
                        fastAppendText(hiddenWord,paragraph,"foundWord-words")
                    }
                }
            }
            else
            {
                let missing = iLongWords.length;
                for (let i = 0; i < iLongWords.length; i++) {
                    const element = iLongWords[i];
                    if(element.found === true)
                    {
                        fastAppendText(element.str, paragraph, "foundWord-words")
                        missing--;
                    }
                }
                if(missing > 0)
                {
                    fastAppendText(" + zbývá najít " + missing,paragraph,"foundWord-missing")
                }
            }
            let line = document.createElement("hr");
            line.classList.add("found-words-line");
            paragraph.appendChild(line)
        }
    }
    fastAppendText("Bonusová slova:" + "(" + bonusWordsFound.length + ")", paragraph,"foundWord-letterHeader")
    bonusWordsFound.sort();
    for (let i = 0; i < bonusWordsFound.length; i++) {
        let w = fastAppendText(bonusWordsFound[i], paragraph,"foundWord-words")
        w.addEventListener("click",(w)=>{
            url ='http://www.google.com/search?q=' + bonusWordsFound[i];
            window.open(url,'_blank');
        })
        w.title = "Najít význam ve slovníku";
    }


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
    setSave(getCurrentSquardleSave())
}
function squardleLoadProgress()
{
    let save = getSquardleSave(S);
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
        positions.push([button.left + button.width/2 - 20 +  window.scrollX, button.top - 200 + window.scrollY])
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
    if(className!=="")
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


// HINTS
let hintTimesStarting;
let hintTimesIncluded;
let hintRandomLetters;

function updateHints()
{
    let progress = 1.0*getCurrentSquardleScore(S)/getMaxSquardleScore(S);
    hintTimesStarting = false;
    hintTimesIncluded = false;
    hintRandomLetters = false;
    if(progress > 0.20)
    {
        hintTimesIncluded = true;
        if(progress > 0.40)
        {
            hintTimesStarting = true;
            if(progress > 0.7)
            {
                hintRandomLetters = true;
            }
        }
    }
}


// WIN
function win()
{
    if(winplayed)
    {
        return;
    }
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
