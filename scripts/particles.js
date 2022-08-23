
class Particle{
    text;
    class;
    startingPosition;// is a Position
    delay;
    lifespan;
    direction;
    speed;
    fade;
    twinkle;
    iterations;
    acceleration;

    constructor(text_, class_, start_, delay_, lifespan_, direction_, speed_, fade_ = false, twinkle_ = false, iterations_ = 1, acceleration_ = "ease")
    {
        this.text = text_;
        this.class = class_;
        this.startingPosition = start_;
        this.delay = delay_;
        this.lifespan = lifespan_;
        if(typeof direction_ == 'string')
        {
            switch(direction_)
            {
                case "left":
                    this.direction = new Range(180);
                    break;
                case "right":
                    this.direction = new Range(0);
                    break;
                case "up":
                    this.direction = new Range(90);
                    break;
                case "down":
                    this.direction = new Range(270);
                    break;
                case "top left":
                    this.direction = new Range(135);
                    break;
                case "top right":
                    this.direction = new Range(45);
                    break;
                case "bottom left":
                    this.direction = new Range(225);
                    break;
                case "bottom right":
                    this.direction = new Range(315);
                    break;
                case "random":
                    this.direction = new Range(Math.random()*360);
                    break;
    
            }
        }
        else
        {
            this.direction = direction_;
        }
        
        this.speed = speed_;
        this.fade = fade_;
        this.twinkle = twinkle_;
        this.iterations = iterations_;
        this.acceleration = acceleration_;
    }

    get copy()
    {
        let copyParticle = new Particle(newInst(this.text), 
                                        newInst(this.class),
                                        this.startingPosition.copy,
                                        newInst(this.delay),
                                        this.lifespan.copy,
                                        typeof this.direction === 'string' ? this.direction : this.direction.copy,
                                        this.speed.copy,
                                        newInst(this.fade),
                                        newInst(this.twinkle),
                                        newInst(this.iterations),
                                        newInst(this.acceleration));
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

    get copy()
    {
        return new Range(newInst(this.start),newInst(this.end))
    }

    lock()
    {
        this.start = this.num;
        this.end = this.start;
    }
}

class Range2D
{
    rangeX;
    rangeY;
    constructor(start_, end_)
    {
        //if(typeof start_ == 'nu')
        this.rangeX = start_;
        this.rangeY = end_;
    }

    get position()
    {
        return new Position(this.rangeX.num, this.rangeY.num);
    }

    get copy()
    {
        return new Range2D(this.rangeX.copy, this.rangeY.copy);
    }
}

let testParticle = new Particle("test", "particle", new Range2D(new Range(1000, 1200), new Range(100, 300)), 0, new Range(100, 300), "random", new Range(100,500), true);
let particleDiv =  document.getElementById("particles");
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
    part.startingPosition = new Range2D(new Range(startPositionFromRange.x),new Range(startPositionFromRange.y))
    partObject.style.left = startPositionFromRange.x + "px";
    partObject.style.top = startPositionFromRange.y + "px";
    partObject.style.scale = 0;

    part.lifespan.lock();
    part.speed.lock();

    
    let delay = setTimeout(()=>{

        let points = convertToAnimation(getPositions(part));
        points[0].scale = '1';
        points[points.length-1].scale = '1';
        if(part.fade === true)
        {
            points[points.length-1].fontSize = '0';
        }
        let timing ={
            duration: part.lifespan.num + 1000,
            iterations: 1,
            easing:part.acceleration
        }
        partObject.animate(points,timing);
        let life = setTimeout(()=>{
            let firsChil = particleDiv.firstChild;
            firsChil.style.display = "none";
            particleDiv.removeChild(firsChil)
        },part.lifespan.num)
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

function getPositions(particle, positions = [])
{
    let offset = new Position(0, 0);
    positions.push(offset)
    while(particle.iterations > 0)
    {
        let position = new Position(Math.cos(particle.direction.num/180*Math.PI) * particle.speed.num * particle.lifespan.num/particle.iterations/1000, -Math.sin(particle.direction.num/180*Math.PI) * particle.speed.num * particle.lifespan.num/particle.iterations/1000);
        
        offset = new Position(offset.x + position.x, offset.y + position.y)
        //particle.startingPosition = new Range2D(new Range(particle.startingPosition.x + position.x),new Range(particle.startingPosition.y + position.y))
        particle.iterations--;

        positions.push(new Position(position.x + offset.x, position.y + offset.y));
    }
    return positions;
}
function convertToAnimation(positions)
{
    let animationPoints = [];
    for (let i = 0; i < positions.length; i++) {
        const element = positions[i];
        animationPoints.push({
            transform: 'translateX(' + (element.x) + 'px) translateY(' + (element.y) + 'px)'
        })
    }
    return animationPoints;
}

function calculateBezier(positions)
{
    if(positions.length <= 2)
    {
        return;
    }

    let first = positions[0];
    let toSplit = positions[1]
    for (let i = 3; i < positions.length; i++) {
        let second = positions[i]
        let firstSplit = new Position()

        
    }
}

function vector(pos1, pos2)
{
    return new Position(pos2.x - pos1.x, pos2.y - pos1.y);
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


