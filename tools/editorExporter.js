
let S = new Squardle();
let legitWords = [];
let bonusWords = [];



// LOADING SQUARDLES
async function loadData()
{
    let fil = document.getElementById("input").files[0];
    if(fil === null || fil === undefined)
    {
        alert("Nebyl vložen soubor");
        return;
    }
    S = JSON.parse(await fil.text())
    
    applySquardleToExporter();
}

function applySquardleToExporter()
{
    createBoard()
    setupWords()
    document.getElementById("name").value = S.name;
    document.getElementById("author").value = S.author;
    document.getElementById("difficulty").value = S.difficulty;
    document.getElementById("limitedTime").checked = S.limitedTime;
    if(S.limitedTime)
    {
        document.getElementById("startDate").value = S.startDate;

        let timeDelta = new Date(S.endDate)-new Date(S.startDate)
        document.getElementById("howManyDays").value = Math.floor(1.0*timeDelta/1000/60/60/24);
        document.getElementById("howManyHours").value = Math.floor(1.0*timeDelta/1000/60/60);
        document.getElementById("howManyMinutes").value = Math.floor(1.0*timeDelta/1000/60)%60;
    }

}



// BOARD PREVIEW_____________________________________________________________________________
function createBoard()
{
    deleteBoard();
    let b = document.getElementById("board");
    let table = document.createElement("table");
    table.className = "board_table"

    for (let i = 0; i < S.letters.length; i++) {
        const row = S.letters[i];
        let r = document.createElement("tr");
        r.className = "row";
        for (let y = 0; y < row.length; y++) {
            const letter = row[y];
            let l = document.createElement("td");
            l.className = "letter";
            l.textContent = letter;
            if(letter === "0")
            {
                l.style.visibility = "hidden"
            }
            r.appendChild(l)
            
        }
        table.appendChild(r)
    }
    b.appendChild(table)

}

function deleteBoard()
{
    clearChildren(document.getElementById("board"));
}


// WORDS IN FORM_____________________________________________________________________________
function setupWords()
{
    legitWords = []
    bonusWords = []
    for (let i = 0; i < S.wordsToFind.length; i++) {
        legitWords.push(i);
    }
    updateWords();
}
// MOVING WORDS
function updateWords()
{
    let legitWords_place = document.getElementById("wordsToFind");
    clearChildren(legitWords_place)
    for (let i = 0; i < legitWords.length; i++) {
        const text = createWord(S.letters, S.wordsToFind[legitWords[i]]);
        let word = document.createElement("button")
        word.textContent = text
        word.classList.add("word");
        word.classList.add("wordToFind");
        
        word.addEventListener("click",()=>{moveWord(JSON.parse(JSON.stringify(legitWords[i])));updateWords()})
        legitWords_place.appendChild(word)
    }
    let bonusWords_place = document.getElementById("bonusWords");
    clearChildren(bonusWords_place)
    for (let i = 0; i < bonusWords.length; i++) {
        const text = createWord(S.letters, S.wordsToFind[bonusWords[i]]);
        let word = document.createElement("button")
        word.textContent = text
        word.classList.add("word");
        word.classList.add("bonusWord");
        word.addEventListener("click",()=>{moveWord(JSON.parse(JSON.stringify(bonusWords[i])));updateWords()})
        bonusWords_place.appendChild(word)
    }

}

function moveWord(index)
{
    if(legitWords.includes(index))
    {
        legitWords.splice(legitWords.indexOf(index),1)
        bonusWords.push(index)
        updateWords()
        return;
    }
    if(bonusWords.includes(index))
    {
        bonusWords.splice(bonusWords.indexOf(index),1)
        legitWords.push(index)
        updateWords()
        return;
    }
    console.log("OPS a lost word")
}

// EXPORT text or file_____________________________________________________________________________


function outputSquardle()
{
    let expSq = exportSquardle();
    if(expSq !== false)
    {
        let output = document.getElementById("output-text");
        output.value = exportSquardle();
    }
    
}
function downloadSquardle()
{
    
    let expSq = exportSquardle();
    if(expSq !== false)
    {
        var element = document.createElement('a');
        element.setAttribute('href','data:JSON/plain;charset=utf-8, ' + encodeURIComponent(expSq));
        element.setAttribute('download', document.getElementById("fileName").value + ".json");
        document.body.appendChild(element);
        element.click();
    }
}

function exportSquardle()
{
    expSq = new Squardle()

    // name
    expSq.name = document.getElementById("name").value;
    // author
    expSq.author = document.getElementById("author").value;
    // difficulty
    expSq.difficulty = document.getElementById("difficulty").value;
    // limited time
    if(document.getElementById("limitedTime").checked)
    {
        expSq.limitedTime = true;
        expSq.startDate = document.getElementById("startDate").value;
        expSq.endDate = new Date(
                        new Date(document.getElementById("startDate").value).getTime() + 
                        document.getElementById("howManyDays").value*1000*24*60*60 +
                        parseFloat(document.getElementById("howManyHours").value.split(':')[0])*3600*1000 +
                        parseFloat(document.getElementById("howManyHours").value.split(':')[1])*1000*60
                    )       
    }
    else
    {
        expSq.limitedTime = false;
    }
    // words
    let newWordsToFind = [];
    for (let i = 0; i < legitWords.length; i++) {
        const index = legitWords[i];
        newWordsToFind.push(S.wordsToFind[index]);
    }
    expSq.wordsToFind = newWordsToFind;

    if(document.getElementById("useCustomHints").checked === true){
        expSq.hints = {
            hintTimesStarting:document.getElementById("hintTimesStarting").value/100||0,
            hintTimesIncluded:document.getElementById("hintTimesIncluded").value/100||0,
            hintRandomLetters:document.getElementById("hintRandomLetters").value/100||0,    
        }
    }
    if(!check(expSq.name, "Nebylo zadáno jméno") ||
        !check(expSq.author, "Nebyl zadán autor") ||
        !check(expSq.difficulty, "Nebyla zadána obtížnost") ||
        (
            expSq.limitedTime && (!check(S.startDate, "Nebylo zadáno datum začátku") || !check(S.endDate, "Nebylo zadáno datum konce")) 
        )
        )
    {
        return false;
    }
    // outputs formatted squardle
    // the formatting does increase the size of the file a little bit
    return JSON.stringify(expSq);
}



function check(variable, message)
{
    if(!variable)
    {
        alert(message);
        return false;
    }
    return true;
}