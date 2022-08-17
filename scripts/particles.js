
class Particle{
    text;
    class;
    startingPosition;// is a Position
    delay;
    lifespan;
    direction;
    speed;
    fade;
    constructor(text_, class_, start_, delay_, lifespan_, direction_, speed_, fade_)
    {
        this.text = text_;
        this.class = class_;
        this.startingPosition = start_;
        this.delay = delay_;
        this.lifespan = lifespan_;
        this.direction = direction_;
        this.speed = speed_;
        this.fade = fade_;
    }

    get copy()
    {
        let copyParticle = new Particle(newInst(this.text), 
                                        newInst(this.class),
                                        new Range2D(new Range(this.startingPosition.rangeX.start, this.startingPosition.rangeX.end), new Range(this.startingPosition.rangeY.start, this.startingPosition.rangeY.end)),
                                        newInst(this.delay),
                                        new Range(newInst(this.lifespan.start),newInst(this.lifespan.end)),
                                        newInst(this.direction),
                                        new Range(newInst(this.speed.start),newInst(this.speed.end)),
                                        newInst(this.fade));
        return copyParticle;

    }
}

class Range
{
    start;
    end;
    constructor(start_, end_ = null)
    {
        this.start = start_;
        if(end_ === null)
        {
            this.end = start_;
        }
        else
        {
            this.end = end_;
        }
        
    }

    get num()
    {
        if(this.start === this.end)
        {
            return this.start;
        }
        return this.start + Math.random()*(this.end-this.start);
    }
}

class Range2D
{
    rangeX;
    rangeY;
    constructor(start_, end_)
    {
        this.rangeX = start_;
        this.rangeY = end_;
    }

    get position()
    {
        return new Position(this.rangeX.num, this.rangeY.num)
    }
}

let testParticle = new Particle("test", "particle", new Range2D(new Range(1000, 1200), new Range(100, 300)), 0, new Range(100, 300), "random", new Range(100,500), true);
function createParticle(part)
{
    let particlesDiv = document.getElementById("particles");
    if(!particlesDiv)
    {
        return;
    }


    let partObject = document.createElement("div");
    partObject.classList.add("particle");
    partObject.classList.add(chooseRandom(part.class));
    partObject.textContent = chooseRandom(part.text);
    particlesDiv.appendChild(partObject);
    partObject.style.position = "absolute";

    let startPositionFromRange = part.startingPosition.position;
    partObject.style.left = startPositionFromRange.x + "px";
    partObject.style.top = startPositionFromRange.y + "px";


    let delay = setTimeout(()=>{
        let points = getPoints(part);
        if(part.fade === true)
        {
            points[points.length-1].opacity = '0';
        }
        let timing ={
            duration: part.lifespan.num,
            iterations: 1,
            easing:"ease-in"
        }
        partObject.animate(points,timing);
        let life = setTimeout(()=>{
            document.getElementById("particles").removeChild(document.getElementById("particles").firstChild)
        },part.lifespan.num - 100)
    },part.delay)
}

function createParticles(part, amount)
{
    for (let i = 0; i < amount; i++) {
        createParticle(part.copy)
    }
}

function getPoints(part, points = [])
{
    let distance = part.lifespan.num/1000*part.speed.num;
    switch(part.direction)
    {
        case "left":
            distance = - distance;
        case "right":
            points.push({
                transform:'translateX(' + distance + 'px)'
            })
            break;
        case "up":
            distance = - distance;
        case "down":
            points.push({
                transform:'translateY(' + distance + 'px)'
            })
            break;
        case "top left":
            distance /= Math.sqrt(2);
            points.push({
                transform: 'translateX(' + (-distance) + 'px) translateY(' + (-distance) + 'px)'
            })
            break;
        case "top right":
            distance /= Math.sqrt(2);
            points.push({
                transform: 'translateX(' + (distance) + 'px) translateY(' + (-distance) + 'px)'
            })
            break;
        case "bottom left":
            distance /= Math.sqrt(2);
            points.push({
                transform: 'translateX(' + (-distance) + 'px) translateY(' + (distance) + 'px)'
            })
            break;
        case "bottom right":
            distance /= Math.sqrt(2);
            points.push({
                transform: 'translateX(' + (distance) + 'px) translateY(' + (distance) + 'px)'
            })
            break;
        case "random":
            part.direction = chooseRandom(["up","down","left","right","top left","top right","bottom right", "bottom left"])
            getPoints(part,points);
            break;
    }
    return points;
}

function chooseRandom(arr)
{
    if(arr.length === 1)
    {
        return arr;
    }
    let rnd = Math.floor(Math.random()*arr.length-0.001);// subtract small number so it is never max length which is outside array
    return arr[rnd];
}


