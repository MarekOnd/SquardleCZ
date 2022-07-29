const fs = require('fs');

// SETTINGS
let loadFileName = "slova.txt"; // loads from txt
let saveFileName = "english.json"; // saves to json
let oneArrLibrary = true;
// VARIABLES
let rawtext ="";
let library;




function start()
{
    loadText();
    loadLibrary();
    processRawText();
    if(oneArrLibrary)
    {
        connectLibrary();
    }

    fs.writeFileSync("libraries/"+saveFileName,JSON.stringify(library))
}


function loadText()
{
    rawtext = fs.readFileSync("libraries/"+ loadFileName,'utf8');
}
function loadLibrary()
{
    library = [];//!!!!!!!temporary
    for (let i = 0; i < 30; i++) {
        library.push([])    
    }
    
}

let unwantedSymbols = ",.-§/()!?><=+-*%_ˇ´`;°~";
let ABC = "ZXCVBNMASDFGHJKLQWERTYUIOPŽČŇŠĎĚŘŤÁÉÝÚÍÓŮ0123456789";
function processRawText()
{
    for (let i = 0; i < unwantedSymbols.length; i++) {
        const element = unwantedSymbols[i];
        rawtext.replaceAll(element," ");
    }
    rawtext.replaceAll("\r"," ");
    rawtext = rawtext.split("\t").map(function(w){return w.split("\n");});   
    rawtext.map(function(W){W.map(function(w){if(w.length > 0 && !constainsASymbol(w,ABC)){addToLibrary(w)}})})
}

function constainsASymbol(text, symbols)
{
    let output = false;
    for (let i = 0; i < symbols.length; i++) {
        const element = symbols[i];
        if(text.indexOf(element) != -1)
        {
            output = true;
        }
    }
    return output;
}

let count = 0
function addToLibrary(word)
{
    if(!isInLibrary(word))
    {
        library[word.length].push(word);
        if(count++%1000 == 0)
        {
            console.log("Words in library: " + count);
        }
    }
}
function isInLibrary(word)
{
    for (let i = 0; i < library.length; i++) {
        const element = library[i];
        if(element == word)
        {
            return true;
        }
    }
    return false;
}
function connectLibrary()
{
    let connectedLibrary = [];
    library.map(function(arr){arr.map(function(el){connectedLibrary.push(el)})});
    library = connectedLibrary;
}






start();