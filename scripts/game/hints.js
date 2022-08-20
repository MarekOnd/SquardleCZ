// HINTS
let hintTimesStarting;
let hintTimesIncluded;
let hintRandomLetters;

const defualtHintTimesStartingUnlock = 0.20;
const defualtHintTimesIncludedUnlock = 0.40;
const defualtHintRandomLettersUnlock = 0.7;

let hintTimesStartingUnlock = defualtHintTimesStartingUnlock;
let hintTimesIncludedUnlock = defualtHintTimesIncludedUnlock;
let hintRandomLettersUnlock = defualtHintRandomLettersUnlock;

function updateHints()
{

    //good code...
    hintTimesStartingUnlock = checkNullNotZero(S.hints?.hintTimesStarting) ? S.hints?.hintTimesStarting : defualtHintTimesStartingUnlock;
    hintTimesIncludedUnlock = checkNullNotZero(S.hints?.hintTimesIncluded) ? S.hints?.hintTimesIncluded : defualtHintTimesIncludedUnlock;
    hintRandomLettersUnlock = checkNullNotZero(S.hints?.hintRandomLetters) ? S.hints?.hintRandomLetters : defualtHintRandomLettersUnlock;

    hintTimesStarting = updateHint("hintTimesStarting", hintTimesStartingUnlock)
    hintTimesIncluded = updateHint("hintTimesIncluded", hintTimesIncludedUnlock)
    hintRandomLetters = updateHint("hintRandomLetters", hintRandomLettersUnlock)
}
//null->false, 0->true
function checkNullNotZero(num){
    return !(!num && num !== 0)
}

function updateHint(hintId, unlock)
{
    let progress = getSquardleProgress(S);
    //the hint image
    let hintImg = document.getElementById(hintId);
    //hint never unlocked
    if (unlock >= 1){
        hintImg.style.display = "none"
        return false
    }
    if(progress >= unlock)
    {
        hintImg.style.opacity = 0;
        hintImg.style.scale = 1;
        return true;
    }
    else
    {
        hintImg.style.opacity = 1;
        hintImg.style.left = unlock*100 + "%";
        return false;
    }
}