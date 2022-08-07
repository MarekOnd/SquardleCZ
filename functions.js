
class Position{
    x
    y
    constructor(_x, _y)
    {
        this.x = _x;
        this.y = _y
    }

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
    let str = JSON.stringify(sq)// maybe to calculative :)
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