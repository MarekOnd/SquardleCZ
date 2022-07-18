



let S ={
    name:"",
    letters:[],
    wordsToFind:[],
}

let legitWords = [];
let bonusWords = [];





// ENTER






async function loadData()
{
    let name = document.getElementById("textarea").value
    let squardle_ = await getJson("../data/" + name +".json");
    S = JSON.parse(JSON.stringify(squardle_))
    console.log(S)
    createBoard()
    setupWords()
}

async function getFile(url)
{
    try{
        return await fetch(url);
    }
    catch(error){
        console.log("error")
        console.log(error);
    }
    return false;
}
async function getJson(url){
    const obj = await getFile(url);
    if(obj == false)
    {
        return false;
    }
    const jsonObj = await obj.json();
    return jsonObj;
}


// BOARD PREVIEW

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

// WORDS

function setupWords()
{
    for (let i = 0; i < S.wordsToFind.length; i++) {
        legitWords.push(i);
    }
    updateWords();
}

function updateWords()
{
    let legitWords_place = document.getElementById("wordsToFind");
    clearChildren(legitWords_place)
    for (let i = 0; i < legitWords.length; i++) {
        const text = createWord(S.wordsToFind[legitWords[i]]);
        let word = document.createElement("button")
        word.textContent = text
        word.className = "word"
        word.addEventListener("click",()=>(moveWord(JSON.parse(JSON.stringify(legitWords[i])))))
        legitWords_place.appendChild(word)
    }
    let bonusWords_place = document.getElementById("bonusWords");
    clearChildren(bonusWords_place)
    for (let i = 0; i < bonusWords.length; i++) {
        const text = createWord(S.wordsToFind[bonusWords[i]]);
        let word = document.createElement("button")
        word.textContent = text
        word.className = "word" 
        word.addEventListener("click",()=>(moveWord(JSON.parse(JSON.stringify(bonusWords[i])))))
        bonusWords_place.appendChild(word)
    }

}

function moveWord(index)
{
    console.log(index);
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
function createWord(path)
{
    let string = "";
    path.positions.forEach(element => {
        string += S.letters[element[0]][element[1]];
    });
    return string;
}

function clearChildren(object)
{
    while(object.hasChildNodes())
    {
        object.removeChild(object.firstChild);
    }
}
