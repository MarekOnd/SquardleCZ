
class Position{
    x
    y
    constructor(_x, _y)
    {
        this.x = _x;
        this.y = _y
    }

}

class Save{

}

function newInst(obj)
{
    return JSON.parse(JSON.stringify(obj))
}

async function getFile(url)
{
    try{
        return await fetch(url);
    }
    catch(error){
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

function hashSquardle(sq)
{
    //let str = toStr(sq.letters);
    let str = JSON.stringify(sq.letters) + JSON.stringify(sq.wordsToFind)// maybe to calculative :)
    return hashCode(str);
}

function toStr(b)
{
    let arr = "";
    b.forEach(element => {
       arr.push(element); 
    });
    return arr;
}

function hashCode(s) {
    let h;
    for(let i = 0; i < s.length; i++) 
          h = Math.imul(31, h) + s.charCodeAt(i) | 0;

    return h;
}

function clearChildren(object)
{
    while(object.hasChildNodes())
    {
        object.removeChild(object.firstChild);
    }
}

function newInst(obj)
{
    return JSON.parse(JSON.stringify(obj))
}


// squardle counting functions
function getMaxSquardleScore(sq)
{
    let max = 0;
    for (let i = 0; i < sq.wordsToFind.length; i++) {
        const element = sq.wordsToFind[i];
        max += element.positions.length*element.positions.length;
    }
    return max;
}

function getSquardleScore(sq)
{
    let s = getSquardleSave(sq);
    if(s.wordsFound === [])
    {
        return 0;
    }
    let score = 0;
    for (let i = 0; i < sq.wordsToFind.length; i++) {
        const element = sq.wordsToFind[i];
        if(s.wordsFound[i] === true)
        {
            score += element.positions.length*element.positions.length;
        }
    }
    return score;
}

function getSquardleProgress(sq)
{
    return 1.0*getSquardleScore(sq)/getMaxSquardleScore(sq);
}

function countTrue(arr)
{
    let numTrue = 0
    for (let i = 0; i < arr.length; i++) {
        if(arr[i])
        {
            numTrue++;
        }
    }
    return numTrue;
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function isSquardleActive(sq)
{
    if((sq.limitedTime === false) ||(new Date(sq.startDate) <= Date.now() && new Date(sq.endDate) >= Date.now()))
    {
        return true;
    }
    return false;
}

