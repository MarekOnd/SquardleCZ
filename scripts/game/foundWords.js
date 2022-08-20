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