

async function pageStart()
{
    // loads libraries and squardles
    initialize();
    await loadSquardlesData();
    loadAllSaves();
    // loads selected tab and squardle from localStorage
    loadCurrentSquardle();
    let lastTab = localStorage.getItem("currentTab");
    if(lastTab === null)
    {
        openTab("game")
    }
    else
    {
        openTab(JSON.parse(lastTab))
    }
    
}


// LOADING AND SAVING WHICH SQUARDLE IS OPEN
let squardlesCasual;
let squardlesWeekly;
let squardlesSpecial;
let squardlesShared;

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
        squardlesCasual.push(await getJson("./data/" + casualNameList[i] +".json"))
    }

    squardlesWeekly = [];
    let weeklyNameList = await getJson("./data/squardlesWeekly.json");
    for (let y = 0; y < weeklyNameList.length; y++) {
        squardlesWeekly.push(await getJson("./data/" + weeklyNameList[y] +".json"))
    }

    squardlesSpecial = []
    let specialNameList = await getJson("./data/squardlesSpecial.json");
    for (let y = 0; y < specialNameList.length; y++) {
        squardlesSpecial.push(await getJson("./data/" + specialNameList[y] +".json"))
    }

    squardlesShared = [];
    squardlesShared = localStorage.getItem("squardlesShared") | "";
}

// for moderat loading from console: loadSquardle(getSquardle(new searchParameters("weekly",1)))
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
    if(allSaves === null)
    {
        allSaves = [];
        localStorage.setItem("allSaves",JSON.stringify(allSaves));
    }
}

function setSave(s)
{
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
        existed:false
    }
    return defaultSave;
}

function getSquardleSave(sq)
{
    for (let i = 0; i < allSaves.length; i++) {
        if(allSaves[i].hash === hashSquardle(sq))
        {
            return allSaves[i];// is already saved
        }
    }
    let defaultSave = {// isn't saved yet, creates new save
        hash:hashSquardle(sq),
        wordsFound:[],
        bonusWordsFound:[],
        existed:true
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
    result += sq.name + "\n";
    let save = getSquardleSave(sq);
    result += countTrue(save.wordsFound) + "/" + save.wordsFound.length + "\n";
    return result;
}



