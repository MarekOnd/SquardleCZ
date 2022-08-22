

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
                                                new Range(500, 1000), 
                                                new Range(260,300), 
                                                new Range(20,200), 
                                                true,
                                                false,
                                                3);
                createParticle(mouseParticle)
                currentWait = 0;
            }
            
        }
    })
    
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





















