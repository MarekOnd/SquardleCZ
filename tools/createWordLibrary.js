const fs = require('fs');

// SETTINGS
let loadFileName = "czechWhatsAppWordsRaw.txt"; // loads from txt
let saveFileName = "czech.json"; // saves to json

// VARIABLES
let input = "";
let library;






function start()
{
    input = fs.readFileSync("libraries/"+ loadFileName,'utf8');
    library = JSON.parse(fs.readFileSync("libraries/"+ saveFileName,'utf8'));


    console.log(input);
    console.log(library);
    //let arrayOfWords = processRawText(input);// word list format
    let arrayOfWords = processRawWhatsAppText(input);// whats app additional changes
    arrayOfWords.map((w)=>{addToLibrary(w)});

    fs.writeFileSync("libraries/"+saveFileName,JSON.stringify(library))
}

let unwantedSymbols = ",.-§/()!?><=+-*%_ˇ´`;°~";
let ABC = "ZXCVBNMASDFGHJKLQWERTYUIOPŽČŇŠĎĚŘŤÁÉÝÚÍÓŮ0123456789";
function processRawText(rawtext)
{
    for (let i = 0; i < unwantedSymbols.length; i++) {
        const element = unwantedSymbols[i];
        rawtext = rawtext.replaceAll(element," ");
    }
    while(rawtext.includes("  "))// to remove all multiple spaces
    {
        rawtext = rawtext.replaceAll("  "," ");
    }
    rawtext = rawtext.replaceAll("\r"," ");
    let processed = [];
    let spliting = rawtext.split("\t").map((ws)=>{
        ws.split("\n").map((w)=>{
            processed.push(w);
        });
    });

    
    for (let i = 0; i < processed.length; i++) {
        processed[i] = processed[i].replaceAll(" ", "");
    }
    console.log(processed)
    return processed;
    
}

let whatsNames = ["Ondrej Marek","Babicka Eliska", "Jan Marek", "Mama"];

function processRawWhatsAppText(rawtext)
{
    // erase message titles
    while(rawtext.includes("[") && rawtext.includes("]"))
    {
        let startIndex = rawtext.indexOf("[");
        let endIndex = rawtext.indexOf("]");
        rawtext = rawtext.replace(rawtext.substring(startIndex, endIndex + 1), "");
        
        console.log(rawtext.length)
    }
    for (let i = 0; i < whatsNames.length; i++) {
        const whatsAppName = whatsNames[i];
        rawtext = rawtext.replaceAll(whatsAppName + ":", "");
    }
    console.log("removed message titles");
    rawtext = rawtext.toLowerCase();
    console.log("all to lower case")
    let halfProcessed = rawtext.split(",");
    console.log("split by , to "  + halfProcessed.length + " strings");
    let processed = [];
    for (let i = 0; i < halfProcessed.length; i++) {
        processed = processed.concat(processRawText(halfProcessed[i]));
        console.log((i+1) + "/" + halfProcessed.length + " processed");
    }
    console.log(processed)
    return processed;
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
    if(word.length > 0 && !constainsASymbol(word,ABC) && !isInLibrary(word))
    {
        library.push(word);
        if(true || count++%1000 == 0)// TURN OFF FOR BIGGER LIBRARIES
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







start();