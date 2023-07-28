

async function pageStart()
{
    //precaching stuff
    try {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {

        for(let registration of registrations) {
    
                registration.unregister()
    
        }}).catch(function(err) {
    
            console.log('Service Worker registration failed: ', err);
    
        });
    } catch (error) {
        
    }

    // if ("serviceWorker" in navigator) {
    //     // register service worker
    //     navigator.serviceWorker.register("service-worker.js");
    //     console.log("service worker registered")
    // }
    



    // loads libraries and squardles
    initialize();
    initUpdate();
    initializeSettings();
    await loadSquardlesData();
    loadAllSaves();
    // loads selected tab and squardle from localStorage
    loadCurrentSquardle();

    let lastTab = localStorage.getItem("currentTab");
    if(lastTab === null)
    {
        lastTab = "guide";
    }
    else
    {
        lastTab = JSON.parse(lastTab)
    }
    if(lastTab === "game" && !isSquardleActive(getSquardle(currentSquardle)))
    {
        lastTab = "browser"
    }
    openTab(lastTab);
}


// LOADING AND SAVING WHICH SQUARDLE IS OPEN
let squardlesCasual;
let squardlesWeekly;
let squardlesSpecial;
let squardlesShared;
let sharedHistory;

class searchParameters{
    type;
    index;
    constructor(t,i)
    {
        this.type = t;
        this.index = i;
    }
}
let currentSquardle;
function getSquardle(params)
{
    switch(params.type)
    {
        case "casual":
            return squardlesCasual[params.index];
        case "weekly":
            return squardlesWeekly[params.index];
        case "shared":
            return squardlesShared[params.index];
        case "special":
            return squardlesSpecial[params.index];
        default:
            console.log("ERROR, INVALID TYPE")
            break;
    }
}

async function loadSquardlesData()
{
    squardlesCasual = [];
    let casualNameList = await getJson("./data/squardlesCasual.json");
    for (let i = 0; i < casualNameList.length; i++) {
        squardlesCasual.push(await getJson("./data/casual/" + casualNameList[i] +".json"))
    }

    squardlesWeekly = [];
    let weeklyNameList = await getJson("./data/squardlesWeekly.json");
    for (let y = 0; y < weeklyNameList.length; y++) {
        squardlesWeekly.push(await getJson("./data/weekly/" + weeklyNameList[y] +".json"))
    }

    squardlesSpecial = []
    let specialNameList = await getJson("./data/squardlesSpecial.json");
    for (let y = 0; y < specialNameList.length; y++) {
        squardlesSpecial.push(await getJson("./data/special/" + specialNameList[y] +".json"))
    }

    if(localStorage.getItem("squardlesShared") === undefined || localStorage.getItem("squardlesShared") === null)
    {
        squardlesShared = [];
    }
    else
    {
        squardlesShared = JSON.parse(localStorage.getItem("squardlesShared"));
    }
    if(localStorage.getItem("sharedHistory"))
    {
        sharedHistory = JSON.parse(localStorage.getItem("sharedHistory"));
    }
    else
    {
        sharedHistory = [];
    }
}

function addToSharedSquardlesHistory(hash)
{
    if(!sharedHistory.includes(hash))
    {
        sharedHistory.push(hash);
    }
    localStorage.setItem("sharedHistory", JSON.stringify(sharedHistory));
}
function getSaves(hashes)
{
    let saves = [];
    for (let i = 0; i < hashes.length; i++) {
        saves.push(getSave(hashes[i]));
    }
    return saves;
}
// for moderator loading from console: loadSquardle(getSquardle(new searchParameters("weekly",1)))
function loadCurrentSquardle()
{
    let tmpSqr = localStorage.getItem("currentSquardle")
    if(tmpSqr !== null)
    {
        currentSquardle = JSON.parse(tmpSqr)
    }
    else
    {
        currentSquardle = new searchParameters("casual",0)
    }
}

function saveCurrentSquardle()
{
    localStorage.setItem("currentSquardle", JSON.stringify(currentSquardle))
}
//-------------------------------------------------
// SAVE FILE
let allSaves;

function loadAllSaves()
{
    allSaves = JSON.parse(localStorage.getItem("allSaves"));
    if(!allSaves)
    {
        allSaves = [];
        localStorage.setItem("allSaves",JSON.stringify(allSaves));
    }
}

function setSave(s)
{
    s.existed = true;
    // tries to find save to overwrite
    let indexToSave = null;
    for (let i = 0; i < allSaves.length; i++) {
        const element = allSaves[i];
        if(element.hash === s.hash)
        {
            indexToSave = i;
            break;
        }
    }
    // if none then add, else overwrite
    if(indexToSave === null)
    {
        allSaves.push(s);
    }
    else
    {
        allSaves[indexToSave] = s;
    }
    localStorage.setItem("allSaves",JSON.stringify(allSaves));// saves to storage
}

function getSave(hash)
{
    for (let i = 0; i < allSaves.length; i++) {
        if(allSaves[i].hash === hash)
        {
            return allSaves[i];// is already saved
        }
    }
    let defaultSave = {// isn't saved yet, creates new save
        hash:hash,
        wordsFound:[],
        bonusWordsFound:[],
        numberOfWrongTries:0,
        timePlayed:0,
        existed:false
    }
    return defaultSave;
}

function getSquardleSave(sq)
{
    for (let i = 0; i < allSaves.length; i++) {
        if(allSaves[i].hash === hashSquardle(sq))
        {
            //compatibility with old saves
            if(!allSaves[i].numberOfWrongTries)
            {
                allSaves[i].numberOfWrongTries = 0;
            }
            if(!allSaves[i].timePlayed)
            {
                allSaves[i].timePlayed = 0;
            }


            return allSaves[i];// is already saved
        }
    }
    let defaultSave = {// isn't saved yet, creates new save
        hash:hashSquardle(sq),
        wordsFound:[],
        bonusWordsFound:[],
        numberOfWrongTries:0,
        timePlayed:0,
        existed:false
    }
    for (let i = 0; i < sq.wordsToFind.length; i++) {
        defaultSave.wordsFound.push(false)
    }
    return defaultSave;
}

function formatSquardleResult(sq)
{
    let result = "";
    result += "SquardleCZ\n";
    for (let i = 0; i < squardlesWeekly.length; i++) {
        const element = squardlesWeekly[i];
        if(hashSquardle(element) === hashSquardle(sq))
        {
            result += "Týdenní #" + (i+1) + "\n ";
            break;
        }
    }
    result += sq.name + " - " + sq.author + "\n";
    let save = getSquardleSave(sq);
    result += countTrue(save.wordsFound) + "/" + save.wordsFound.length + " +" + save.bonusWordsFound.length + " bonusových slov\n";
    result += "https://marekond.github.io/SquardleCZ/"
    return result;
}


// IMPORT SQUARDLE
async function importSquardle()
{
    let json = await (document.getElementById("import-file").files[0]).text();
    if(json === null || json === undefined)
    {
        return;
    }
    let newSq = JSON.parse(json);
    let allSq = allSquardles()
    if(allSq.find((sq)=>{return hashSquardle(sq)===hashSquardle(newSq)}) === undefined)
    {
        squardlesShared.push(newSq);
        addToSharedSquardlesHistory(hashSquardle(newSq))
        localStorage.setItem("squardlesShared", JSON.stringify(squardlesShared));
        updateBrowserContent();
    }
    else
    {
        alert("Tento squardle již existuje (jako oficiální či sdílený)");
    }
    
    
}


function allSquardles()
{
    
    return squardlesCasual.concat(squardlesShared.concat(squardlesSpecial.concat(squardlesWeekly)));
}


