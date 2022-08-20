
// SELECTING WORD
function mouseClick()
{
    //mouseUp();
}
function mouseDown(x,y)
{
    clearTimeout(timeout);
    clearTimeout(secondTimeout);
    // disable
    if(board.classList.contains("disabled"))
    {
        return;
    }
    //--
    if(mousePressed)// mouse already pressed somewhere else
    {
        return;
    }

    // mouse is pressed now
    mousePressed = true;
    // changes button color etc.
    let button = getButton(x,y);
    button.classList.add("selected");
    // saves position to wordPath
    wordPath.positions.push(new Position(x,y));

    updateWord(createWord(wordPath), "white")
    updateLine()
}
function mouseUp()
{
    // disable
    if(board.classList.contains("disabled"))
    {
        return;
    }
    //--
    mousePressed = false;
    if(wordPath.positions.length == 0)
    {
        return;
    }
    // unselects button
    wordPath.positions.forEach(element => {
        let button = getButton(element.x,element.y);
        button.classList.remove("selected");
    });
    testMainWord();
    // resets array
    wordPath.positions = [];

    updateLine()
    
}
function mouseEnter(x,y)
{
    // disable
    if(board.classList.contains("disabled") || !mousePressed || wordPath.positions.length === 0)
    {
        return;
    }

    let lastPosition = wordPath.positions[wordPath.positions.length-1];
    if(lastPosition.x === x && lastPosition.y === y)
    {
        return;
    }
    clearTimeout(timeout);
    clearTimeout(secondTimeout);
    let positionBefore = wordPath.positions[wordPath.positions.length-2];

    let button = getButton(x,y);
    
    if(isSelected(x,y))// if position was already visited
    {
        if(wordPath.positions.length > 1 && positionBefore.x === x && positionBefore.y === y)// if user is going back
        {
            // deletes last position
            let top = wordPath.positions.pop();
            // unselects last button
            getButton(top.x,top.y).classList.remove("selected");
        }
    }
    else if(Math.abs(lastPosition.x - x) <=1  && Math.abs(lastPosition.y - y) <=1 )// going forward
    {
        button.classList.add("selected");
        wordPath.positions.push(new Position(x,y));
    }
    else if(lastPosition.x === x && !isSelectedLineX(x,lastPosition.y,y))// further in x line
    {
        if(lastPosition.y < y)
        {
            for (let i = lastPosition.y + 1; i <= y; i++) {
                getButton(x,i).classList.add("selected");
                wordPath.positions.push(new Position(x,i));
            }
        }
        else
        {
            for (let i = lastPosition.y - 1; i >= y; i--) {
                getButton(x,i).classList.add("selected");
                wordPath.positions.push(new Position(x,i));
            }
        }
    }
    else if(lastPosition.y === y && !isSelectedLineY(y,lastPosition.x,x))// further in y line
    {
        if(lastPosition.x < x)
        {
            for (let i = lastPosition.x + 1; i <= x; i++) {
                getButton(i,y).classList.add("selected");
                wordPath.positions.push(new Position(i,y));
            }
        }
        else
        {
            for (let i = lastPosition.x - 1; i >= x; i--) {
                getButton(i,y).classList.add("selected");
                wordPath.positions.push(new Position(i,y));
            }
        }
    }
    else if((lastPosition.y-y) === (lastPosition.x-x) && !isSelectedLineDiagonalRight(lastPosition, new Position(x,y)))// further in y line
    {
        if(lastPosition.x < x)
        {
            for (let i = lastPosition.x + 1; i <= x; i++) {
                getButton(i,lastPosition.y + i - lastPosition.x).classList.add("selected");
                wordPath.positions.push(new Position(i,lastPosition.y + i - lastPosition.x));
            }
        }
        else
        {
            for (let i = lastPosition.x - 1; i >= x; i--) {
                getButton(i,lastPosition.y + i - lastPosition.x).classList.add("selected");
                wordPath.positions.push(new Position(i,lastPosition.y + i - lastPosition.x));
            }
        }
    }
    else if((lastPosition.y-y) === -(lastPosition.x-x) && !isSelectedLineDiagonalLeft(lastPosition, new Position(x,y)))// further in y line
    {
        if(lastPosition.x < x)
        {
            for (let i = lastPosition.x + 1; i <= x; i++) {
                getButton(i,lastPosition.y - i + lastPosition.x).classList.add("selected");
                wordPath.positions.push(new Position(i,lastPosition.y - i + lastPosition.x));
            }
        }
        else
        {
            for (let i = lastPosition.x - 1; i >= x; i--) {
                getButton(i,lastPosition.y - i + lastPosition.x).classList.add("selected");
                wordPath.positions.push(new Position(i,lastPosition.y - i + lastPosition.x));
            }
        }
    }
    updateWord(createWord(wordPath), "white");
    updateLine()
}

function isSelected(x,y)
{
    return wordPath.positions.filter(element => element.x === x && element.y === y).length > 0 || S.letters[x][y] === "0";
}

function isSelectedLineX(x, yStart, yEnd)
{
    if(yStart > yEnd)
    {
        return isSelectedLineX(x, yEnd, yStart);
    }
    for (let i = yStart + 1; i < yEnd; i++) {
        if(isSelected(x,i))
        {
            return true;
        }
    }
    return false;
}
function isSelectedLineY(y, xStart, xEnd)
{
    if(xStart > xEnd)
    {
        return isSelectedLineX(y, xEnd, xStart);
    }
    for (let i = xStart + 1; i < xEnd; i++) {
        if(isSelected(i,y))
        {
            return true;
        }
    }
    return false;
}
function isSelectedLineDiagonalRight(start, end)// /
{
    if(start.x > end.x)
    {
        return isSelectedLineDiagonalRight(end, start);
    }
    for (let i = start.x + 1; i < end.x; i++) {
        if(isSelected(i,start.y + i - start.x))
        {
            return true;
        }
    }
    return false;
}
function isSelectedLineDiagonalLeft(start, end)// \
{
    if(start.x > end.x)
    {
        return isSelectedLineDiagonalLeft(end, start);
    }
    for (let i = start.x + 1; i < end.x; i++) {
        if(isSelected(i,start.y + start.x - i ))
        {
            return true;
        }
    }
    return false;
}
