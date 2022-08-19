

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
let board = document.querySelector("#board");

let winplayed;

// part of IMPORTANT
let mouseParticleWait = 5;
let currentWait = 0;
let mouseParticlesModel = "*"
async function initialize(){
    LIBRARY = await getJson("./libraries/" + libraryName)
    window.addEventListener("pointerup",(e)=>{mouseUp()})

    
    window.addEventListener("pointermove",(e)=>{
        if(getSettingsProperty('showMouseParticles') === false)
        {
            return;
        }
        if(e.buttons > 0)
        {
            currentWait++;
            if(currentWait > mouseParticleWait)
            {
                let mouseParticle = new Particle([mouseParticlesModel],
                                                ["mouseParticle1","mouseParticle2"], 
                                                new Range2D(new Range(e.pageX), new Range(e.pageY)), 
                                                0, 
                                                new Range(500, 1000), 
                                                new Range(260,300), 
                                                new Range(20,200), 
                                                true,
                                                false,
                                                5);
                createParticle(mouseParticle)
                currentWait = 0
            }
            
        }
    })
    
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
    document.querySelector("#board").classList.remove("disabled");

    
    createBoard();

    // add share result
    let share = document.getElementById("share");
    share.removeEventListener("pointerup", openShareWindow);
    share.addEventListener("pointerup", (e)=>{openShareWindow(S)});
    updateWord("","white")
    updateAll();
 
    document.querySelector(":root").style.setProperty('--boardSize',S.letters.length);
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
    let board = document.querySelector("#board");
    board.style.gridTemplateColumns = "1fr ".repeat(S.letters.length)
    // deletes existing children
    clearChildren(board)

    // creates new board
    for(var i = 0; i < S.letters.length; i++)
    {
        // let row = document.createElement("tr");
        // row.className = "row";

        for(var j = 0; j < S.letters[i].length; j++)
        {
            
            let x = i;
            let y = j;

            // cell and button
            let cell = document.createElement("div");
            cell.className = "cell";
            
            let button = document.createElement("div");
            button.className = "boardButton";
            if(S.letters[i][j] === "0")
            {
                button.style.display = "none";
            }
            else
            {
                // hitbox for better selecting
                let hitbox = document.createElement("div");
                hitbox.className = "hitbox";
                hitbox.addEventListener("click",function(){mouseClick(x,y)});
                hitbox.addEventListener("pointerdown",function(){mouseDown(x,y)});
                hitbox.addEventListener("pointerup", function(){mouseUp()});
                hitbox.addEventListener("pointerenter",function(){mouseEnter(x,y)});
                hitbox.addEventListener("gotpointercapture",(e)=>{e.target.releasePointerCapture(e.pointerId)})
                cell.appendChild(hitbox);
            }

            // how many words use this letter, how many start with letter
            let letterWrapper = document.createElement("div")
            let letter = document.createElement("div")
            letterWrapper.className = "button-letter";
            let text = document.createTextNode(S.letters[i][j]);
            letter.appendChild(text);
            letterWrapper.appendChild(letter)
            button.appendChild(letterWrapper)

            let use = document.createElement("div");
            use.className = "button-use";
            let start = document.createElement("div");
            start.className = "button-start";
            button.appendChild(use);
            button.appendChild(start);
            
            board.style.fontSize = `calc(min(600px,90vw)/${S.letters.length*2})`
            
            // final appendage
            
            cell.appendChild(button);
            // row.appendChild(cell);
            board.appendChild(cell);
        }
    }
}
function getButton(x,y)
{
    let but = document.querySelector("#board").childNodes[x*(S.letters.length)+y].querySelector(".boardButton");
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
    if(board.classList.contains("disabled") || !mousePressed || wordPath.positions.length === 0)
    {
        return;
    }
    clearTimeout(timeout);
    clearTimeout(secondTimeout);
    let lastPosition = wordPath.positions[wordPath.positions.length-1];
    if(lastPosition.x === x && lastPosition.y === y)
    {
        return;
    }
    let positionBefore = wordPath.positions[wordPath.positions.length-2];

    let button = getButton(x,y);
    
    if(isSelected(x,y))// if position was already visited
    {
        if(wordPath.positions.length > 1 && positionBefore.x === x && positionBefore.y === y)// if user is going back
        {
            // deletes last position
            let top = wordPath.positions.pop();
            // unselects last button
            getButton(top.x,top.y).classList.remove("selected");
        }
    }
    else if(Math.abs(lastPosition.x - x) <=1  && Math.abs(lastPosition.y - y) <=1 )// going forward
    {
        button.classList.add("selected");
        wordPath.positions.push(new Position(x,y));
    }
    else if(lastPosition.x === x && !isSelectedLineX(x,lastPosition.y,y))// further in x line
    {
        if(lastPosition.y < y)
        {
            for (let i = lastPosition.y + 1; i <= y; i++) {
                getButton(x,i).classList.add("selected");
                wordPath.positions.push(new Position(x,i));
            }
        }
        else
        {
            for (let i = lastPosition.y - 1; i >= y; i--) {
                getButton(x,i).classList.add("selected");
                wordPath.positions.push(new Position(x,i));
            }
        }
    }
    else if(lastPosition.y === y && !isSelectedLineY(y,lastPosition.x,x))// further in y line
    {
        if(lastPosition.x < x)
        {
            for (let i = lastPosition.x + 1; i <= x; i++) {
                getButton(i,y).classList.add("selected");
                wordPath.positions.push(new Position(i,y));
            }
        }
        else
        {
            for (let i = lastPosition.x - 1; i >= x; i--) {
                getButton(i,y).classList.add("selected");
                wordPath.positions.push(new Position(i,y));
            }
        }
    }
    else if((lastPosition.y-y) === (lastPosition.x-x) && !isSelectedLineDiagonalRight(lastPosition, new Position(x,y)))// further in y line
    {
        if(lastPosition.x < x)
        {
            for (let i = lastPosition.x + 1; i <= x; i++) {
                getButton(i,lastPosition.y + i - lastPosition.x).classList.add("selected");
                wordPath.positions.push(new Position(i,lastPosition.y + i - lastPosition.x));
            }
        }
        else
        {
            for (let i = lastPosition.x - 1; i >= x; i--) {
                getButton(i,lastPosition.y + i - lastPosition.x).classList.add("selected");
                wordPath.positions.push(new Position(i,lastPosition.y + i - lastPosition.x));
            }
        }
    }
    else if((lastPosition.y-y) === -(lastPosition.x-x) && !isSelectedLineDiagonalLeft(lastPosition, new Position(x,y)))// further in y line
    {
        if(lastPosition.x < x)
        {
            for (let i = lastPosition.x + 1; i <= x; i++) {
                getButton(i,lastPosition.y - i + lastPosition.x).classList.add("selected");
                wordPath.positions.push(new Position(i,lastPosition.y - i + lastPosition.x));
            }
        }
        else
        {
            for (let i = lastPosition.x - 1; i >= x; i--) {
                getButton(i,lastPosition.y - i + lastPosition.x).classList.add("selected");
                wordPath.positions.push(new Position(i,lastPosition.y - i + lastPosition.x));
            }
        }
    }
    updateWord(createWord(wordPath), "white");
    updateLine()
}

function isSelected(x,y)
{
    return wordPath.positions.filter(element => element.x === x && element.y === y).length > 0 || S.letters[x][y] === "0";
}

function isSelectedLineX(x, yStart, yEnd)
{
    if(yStart > yEnd)
    {
        return isSelectedLineX(x, yEnd, yStart);
    }
    for (let i = yStart + 1; i < yEnd; i++) {
        if(isSelected(x,i))
        {
            return true;
        }
    }
    return false;
}
function isSelectedLineY(y, xStart, xEnd)
{
    if(xStart > xEnd)
    {
        return isSelectedLineX(y, xEnd, xStart);
    }
    for (let i = xStart + 1; i < xEnd; i++) {
        if(isSelected(i,y))
        {
            return true;
        }
    }
    return false;
}
function isSelectedLineDiagonalRight(start, end)// /
{
    if(start.x > end.x)
    {
        return isSelectedLineDiagonalRight(end, start);
    }
    for (let i = start.x + 1; i < end.x; i++) {
        if(isSelected(i,start.y + i - start.x))
        {
            return true;
        }
    }
    return false;
}
function isSelectedLineDiagonalLeft(start, end)// \
{
    if(start.x > end.x)
    {
        return isSelectedLineDiagonalLeft(end, start);
    }
    for (let i = start.x + 1; i < end.x; i++) {
        if(isSelected(i,start.y + start.x - i ))
        {
            return true;
        }
    }
    return false;
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
    clearTimeout(timeout);
    clearTimeout(secondTimeout);

    for (let i = 0; i < S.wordsToFind.length; i++) {
        const element = createWord(S.wordsToFind[i]);
        if(mainWord === element)
        {
            if(wordsFound[i] === true)
            {
                // already found
                updateWord("Již nalezeno", "white");
                
                
            }
            else
            {
                // new
                wordsFound[i] = true;
                updateAll();
                updateWord("Nalezeno slovo", "green");
                // SHOWING PLUS POINTS AS PARTICLEs
                // OPTION 1 - MANY PARTICLES
                // for (let i = 0; i < element.length*element.length; i++) {
                //     let left = output.getBoundingClientRect().left + output.getBoundingClientRect().width;
                //     let top = output.getBoundingClientRect().top + output.getBoundingClientRect().height;
                //     let plusPointsParticle = new Particle("+1", "particle", new Range2D(new Range(left - 20, left + 100), new Range(top - 100,top + 100)), i*10, 1000, "up", new Range(1000,1000+i*100), false);
                //     createParticle(plusPointsParticle);
                // }
                // OPTION 2 - JUST ONE PARTICLE
                let scoreBoundingBox = document.querySelector("#current-points").getBoundingClientRect()
                let left = scoreBoundingBox.left + scoreBoundingBox.width;
                let top = scoreBoundingBox.top;
                let plusPointsParticle = new Particle(
                    ["+" + element.length*element.length + "bodů"], 
                    ["plusPoints"], 
                    new Range2D(new Range(left), new Range(top)), 
                    2000, 
                    new Range(1000), 
                    "up", 
                    new Range(30), 
                    true
                );
                
                createParticle(plusPointsParticle);
            }
            setOutputAnimation();
            
            return;
        }
    }

    if(LIBRARY.includes(mainWord))
    {
        if(mainWord.length < 4)
        {
            updateWord("Krátké!", "red");
            return;
        }
        if(!bonusWordsFound.includes(mainWord))
        {
            bonusWordsFound.push(mainWord);
            updateFound();
            updateWord("Bonusové slovo", "cyan");
        }
        else
        {
            updateWord("Již nalezeno", "cyan");
        }
        setOutputAnimation();
        return;
    }
    updateWord("Není slovo","red");
    setOutputAnimation();
}

// animation is just one at a time so the timeouts are global and rewrite themselves
let timeout;
let secondTimeout;
function setOutputAnimation()
{
    let mainWord = createWord(wordPath);
    timeout = setTimeout(()=>{
        let points = [
            { color: 'rgb(0,0,0,0)'},
        ];
        let timing ={
            duration: 2000,
            iterations: 1,

        }
        output.animate(points,timing);
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
    let scoreBox = document.getElementById("current-points");
    let wordBox = document.getElementById("current-words");

    let scoreBar = document.getElementById("score-bar");
    scoreBar.style.width = String(score/maxScore*100) + "%"

    if(score === maxScore)
    {
        win();
    }

    wordBox.textContent = countTrue(wordsFound) + "/" + wordsFound.length 
    scoreBox.textContent = score + " bodů" ;
}

// FOUND WORDS LIST

function updateFound()
{
    //Alternatives: http://www.google.com/search?q=   https://prirucka.ujc.cas.cz/?id=
    const DICTIONARY_SEARCH_URL_BEGIN = "https://cs.wiktionary.org/w/index.php?search="
    const DICTIONARY_SEARCH_URL_END = "&title=Speci%C3%A1ln%C3%AD%3AHled%C3%A1n%C3%AD&go=J%C3%ADt+na&ns0=1"
    

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
            if(document.querySelector("#board").classList.contains("disabled"))
            {
                for (let i = 0; i < iLongWords.length; i++) {
                    const element = iLongWords[i];
                    let w;
                    if(element.found === true)// found
                    {
                        w = fastHyperlink(element.str, paragraph, "foundWord-words",DICTIONARY_SEARCH_URL_BEGIN + element.str + DICTIONARY_SEARCH_URL_END,true)
                        
                    }
                    else // show 
                    {
                        w = fastHyperlink(element.str, paragraph, "foundWord-words",DICTIONARY_SEARCH_URL_BEGIN + element.str + DICTIONARY_SEARCH_URL_END,true)
                        w.classList.add("notFound")
                    }
                    w.title = "Najít význam ve slovníku";
                }
            }
            else if(hintRandomLetters === true)
            {
                for (let i = 0; i < iLongWords.length; i++) {
                    const element = iLongWords[i];
                    if(element.found === true)// found
                    {
                        let w = fastHyperlink(element.str, paragraph, "foundWord-words",DICTIONARY_SEARCH_URL_BEGIN + element.str + DICTIONARY_SEARCH_URL_END,true)
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
                        fastHyperlink(element.str, paragraph, "foundWord-words",DICTIONARY_SEARCH_URL_BEGIN + element.str + DICTIONARY_SEARCH_URL_END,true)
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
        const element = bonusWordsFound[i];
        let w = fastHyperlink(element, paragraph, "foundWord-words", DICTIONARY_SEARCH_URL_BEGIN + element + DICTIONARY_SEARCH_URL_END, true)
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
        existed:false
    }
    if(getSquardleProgress(S) > 0)
    {
        save.existed = true;
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
    // if(save.existed === false)
    // {
    //     for (let i = 0; i < S.wordsToFind.length; i++) {
    //         save.wordsFound.push(false);
    //     }
    // }
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
    line.appendChild(connectButtons(wordPath));
    
}

function connectButtons(path)
{
    let positions = []
    for (let i = 0; i < path.positions.length; i++) {
        const element = path.positions[i]
        let button = getButton(element.x,element.y).getBoundingClientRect()// document.getElementsByClassName("row")[element.x].childNodes[element.y]
        positions.push([button.left + button.width/2 - 10 +  window.scrollX, button.top + button.height/2  - 10 + window.scrollY])
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
    line.classList.add("lineSegment");
    var styles = 'width: ' + length + 'px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; ';

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

function fastHyperlink(text,where,className="",link,newWindow=true)
{
    let linkEl =document.createElement("a")
    linkEl.textContent = text;
    if(className!=="")
    {
        linkEl.classList.add(className)
    }
    linkEl.href = link
    linkEl.target = newWindow ? "_blank" : "_self"
    where.appendChild(linkEl);
    return linkEl;
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

const defualtHintTimesStartingUnlock = 0.20;
const defualtHintTimesIncludedUnlock = 0.40;
const defualtHintRandomLettersUnlock = 0.7;

let hintTimesStartingUnlock = defualtHintTimesStartingUnlock;
let hintTimesIncludedUnlock = defualtHintTimesIncludedUnlock;
let hintRandomLettersUnlock = defualtHintRandomLettersUnlock;

function updateHints()
{

    //good code...
    hintTimesStartingUnlock = checkNullNotZero(S.hints?.hintTimesStarting) ? S.hints?.hintTimesStarting : defualtHintTimesStartingUnlock;
    hintTimesIncludedUnlock = checkNullNotZero(S.hints?.hintTimesIncluded) ? S.hints?.hintTimesIncluded : defualtHintTimesIncludedUnlock;
    hintRandomLettersUnlock = checkNullNotZero(S.hints?.hintRandomLetters) ? S.hints?.hintRandomLetters : defualtHintRandomLettersUnlock;

    hintTimesStarting = updateHint("hintTimesStarting", hintTimesStartingUnlock)
    hintTimesIncluded = updateHint("hintTimesIncluded", hintTimesIncludedUnlock)
    hintRandomLetters = updateHint("hintRandomLetters", hintRandomLettersUnlock)
}
//null->false, 0->true
function checkNullNotZero(num){
    return !(!num && num !== 0)
}

function updateHint(hintId, unlock)
{
    let progress = getSquardleProgress(S);
    //the hint image
    let hintImg = document.getElementById(hintId);
    //hint never unlocked
    if (unlock >= 1){
        hintImg.style.display = "none"
        return false
    }
    if(progress >= unlock)
    {
        hintImg.style.opacity = 0;
        hintImg.style.scale = 1;
        return true;
    }
    else
    {
        hintImg.style.opacity = 1;
        hintImg.style.left = unlock*100 + "%";
        return false;
    }
}

// WIN
function win()
{
    if(winplayed)
    {
        return;
    }
    let board = document.querySelector("#board")
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
                iterations: 1
            }
            // button.setAttribute('style','animation-delay: -20000;');
            setTimeout(()=>{
                button.animate(points,timing);
            },(y+1)*300 + (i+1)*100)
        }
    }
    
}