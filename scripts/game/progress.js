// SAVING AND LOADING
function getCurrentSquardleSave()
{
    let save = {
        hash:hashSquardle(S),
        wordsFound:wordsFound,
        bonusWordsFound:bonusWordsFound,
        numberOfWrongTries:numberOfWrongTries,
        timePlayed:timePlayed,
        existed:false
    }
    if(getSquardleProgress(S) > 0)
    {
        save.existed = true;
    }
    return save;
}
function squardleSaveProgress()
{
    setSave(getCurrentSquardleSave())
}
function squardleLoadProgress()
{
    let save = getSquardleSave(S);
    // if(save.existed === false)
    // {
    //     for (let i = 0; i < S.wordsToFind.length; i++) {
    //         save.wordsFound.push(false);
    //     }
    // }
    applySave(save)
}
function applySave(save)
{
    wordsFound = save.wordsFound;
    bonusWordsFound = save.bonusWordsFound;
    timePlayed = save.timePlayed;
    numberOfWrongTries = save.numberOfWrongTries;
}