// CREATING LINE

let lineSegments = []

let boardCoordinates = [];
let line =  document.querySelector("#line");

let lineColors = null;

function updateBoardCoordinates()
{
    boardCoordinates = [];
    for (let i = 0; i < S.letters.length; i++) {
        let row = []
        for (let j = 0; j < S.letters.length; j++) {
            if(S.letters[i][j])
            {
                row.push(new Position(0,0));
                continue;
            }
            let button = getButton(i,j).getBoundingClientRect();
            row.push(new Position(button.left + button.width/2 + window.scrollX, button.top + button.height/2 + window.scrollY))
        }
        boardCoordinates.push(row);
    }
}

function getButtonCenter(x, y)
{
    let button = getButton(x,y).getBoundingClientRect();
    return new Position(button.left + button.width/2 - 5  + window.scrollX, button.top + button.height/2 - 10 + window.scrollY);// ONLY ABSOLUTE CORRECTION! (-5 and -10), :-()
}

let lineScale = 1.14;
function addLineSegment()
{
    let length = wordPath.positions.length;
    if(length > 1)
    {
        let startPos = getButtonCenter(wordPath.positions[length-2].x,wordPath.positions[length-2].y);
        let endPos = getButtonCenter(wordPath.positions[length-1].x,wordPath.positions[length-1].y);
        let vector = new Position((startPos.x - endPos.x)*(lineScale-1),(startPos.y - endPos.y)*(lineScale-1));

        let segment = createLine(startPos.x + vector.x/2,startPos.y + vector.y/2,endPos.x - vector.x/2,endPos.y - vector.y/2);

        segment.id = "line_"+ length;
        // segment.style.scale = 0;
        if(lineColors)
        {
            segment.style.backgroundColor = chooseRandom(lineColors)
        }
        
        // setTimeout(()=>{
        //     segment.style.scale = 1;
        // })
        lineSegments.push(segment);
        line.appendChild(segment);
        return segment;
    }
    
    
}

function deleteLineSegment()
{

    let segment = lineSegments.pop();
    if(segment)
    {
        line.removeChild(segment);
    }
    
}

function updateLine()
{
    // clearChildren(line);
    // let coordinates = [];
    // for (let i = 0; i < wordPath.positions.length; i++) {
    //     coordinates.push(boardCoordinates[wordPath.positions[i].x][wordPath.positions[i].y])
    // }
    // console.log(coordinates)
    // drawLine(line, coordinates);
}


function drawLine(where, points)
{
    for (let i = 1; i < points.length; i++) {
        const prevElement = points[i-1]
        const element = points[i];
        console.log(prevElement ,element)
        where.appendChild(createLine(prevElement.x,prevElement.y,element.x,element.y));
    }
}

// DRAW LINE
function createLineElement(x, y, length, angle) {
    var line = document.createElement("div");
    line.classList.add("lineSegment");
    var styles = 'width: ' + length + 'px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; ';

    line.setAttribute('style', styles); 

    return line;
}

function createLine(x1, y1, x2, y2) {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y, c, alpha);
}