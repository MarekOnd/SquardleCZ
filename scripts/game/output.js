
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
                showPlusScore("+"  + element.length*element.length + "bodů")
                
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

    // when its not a word at all but has the correct length
    if(mainWord.length >= 4 )
    {
        numberOfWrongTries++;
        squardleSaveProgress();
    }
    
    updateWord("Není slovo","red");
    setOutputAnimation();

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

    wordBox.style.setProperty("font-size","var(--game-fontSize)");
    if(word.length > 15)
    {
        wordBox.style.setProperty("font-size","calc(var(--game-fontSize)/1.5)")
    }
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
            duration: 700,
            iterations: 1,
        }
        output.animate(points,timing);
        secondTimeout = setTimeout(()=>{
            updateWord(mainWord)
        },600)
    },700) 
}