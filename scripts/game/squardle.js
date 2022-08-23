

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

// board
let board = document.querySelector("#board");
let currentBoardRotation = 0;



// part of mouse particles
let mouseParticleWait = 5;
let currentWait = 0;

// tries and speed
let interval;
let timePlayed;
let numberOfWrongTries;


async function initialize(){
    LIBRARY = await getJson("./libraries/" + libraryName)
    window.addEventListener("pointerup",(e)=>{mouseUp()})

    window.addEventListener("pointermove",(e)=>{
        
        if(getSettingsProperty('showMouseParticles') === true && e.buttons > 0)
        {
            currentWait++;
            if(currentWait > mouseParticleWait)
            {
                
                let mouseParticle = new Particle(getSettingsProperty('mouseParticlesModel'),
                                                ["mouseParticle1","mouseParticle2"], 
                                                new Range2D(new Range(e.pageX), new Range(e.pageY)), 
                                                0, 
                                                new Range(500, 2000), 
                                                new Range(200,360), 
                                                new Range(20,80), 
                                                true,
                                                false,
                                                5);
                createParticle(mouseParticle)
                currentWait = 0;
            }
            
        }
    })
    updateLayout()
    
}

let preview;
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
    if(!preview)
    {
        if(board.classList.contains("disabled"))
        {
            board.classList.remove("disabled");
        }
        interval = setInterval(()=>{if(timePlayed++%60===0){squardleSaveProgress()}},1000);// changes time + triggers save every 60 seconds
    }
    else
    {
        if(!board.classList.contains("disabled"))
        {
            board.classList.add("disabled");
        }
        
    }
    

    createBoard();
    initializeBoardButtons();

    // add share result
    let share = document.getElementById("share");
    share.removeEventListener("pointerup", openShareWindow);
    share.addEventListener("pointerup", (e)=>{openShareWindow(S)});
    updateWord("","white")
    updateAll();
 
    document.querySelector(":root").style.setProperty('--boardSize', S.letters.length);

    board.addEventListener("pointerup", function(){mouseUp()});

    updateBoardCoordinates();
    updateLayout();
    
}

function leftSquardle()
{
    if(S)
    {
        squardleSaveProgress();
        clearInterval(interval)
    }
    document.querySelector("#share").hidden = true;
    document.querySelector("#share-spacer").hidden = false;
    
}

function updateAll()
{
    updateHints();
    updateScore();
    updateFound();
    updateLettersInBoard();
}




function updateLayout()
{
    if(JSON.parse(localStorage.getItem("currentTab")) !== "game")
    {
        return;
    }
    let foundWords =  document.querySelector("#found");
    let boardAndOutput = document.querySelector("#boardAndOutput");
    let score = document.querySelector("#score");
    score.removeEventListener("pointerup", toggleFoundWordsPopUp);
    if(window.innerWidth <= window.innerHeight)
    {
        let foundWords =  document.querySelector("#found");
        let boardAndOutput = document.querySelector("#boardAndOutput");
        foundWords.style.display = "none";
        foundWordsPopUp = false;
        foundWords.style.marginRight = "0";
        boardAndOutput.style.display = "inline-block";
        document.querySelector("#score").addEventListener("pointerup", toggleFoundWordsPopUp);
        foundWords.querySelector("#found-exit").style.display = "block";
        
    }
    else
    {
        foundWords.style.display = "inline-block";
        foundWords.style.marginRight = "5vw";
        foundWords.querySelector("#found-exit").style.display = "none";

        boardAndOutput.style.display = "inline-block";
    }
}





















