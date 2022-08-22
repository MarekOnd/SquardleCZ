// BOARD
function createBoard()
{
    let board = document.querySelector("#board");
    board.style.gridTemplateColumns = "1fr ".repeat(S.letters.length)
    board.style.fontSize = `calc(min(600px,90vw)/${S.letters.length*2})`
    // deletes existing children
    clearChildren(board)

    // creates new board
    for(var i = 0; i < S.letters.length; i++)
    {
        // let row = document.createElement("tr");
        // row.className = "row";

        for(var j = 0; j < S.letters[i].length; j++)
        {
            
            let x = i;
            let y = j;

            // cell and button
            let cell = document.createElement("div");
            cell.className = "cell";
            
            let button = document.createElement("div");
            button.className = "boardButton";
            if(S.letters[i][j] === "0")
            {
                button.style.display = "none";
            }
            else
            {
                // hitbox for better selecting
                let hitbox = document.createElement("div");
                hitbox.className = "hitbox";
                hitbox.addEventListener("click",function(){mouseClick(x,y)});
                hitbox.addEventListener("pointerdown",function(){mouseDown(x,y)});
                //hitbox.addEventListener("pointerup", function(){mouseUp()});
                hitbox.addEventListener("pointerenter",function(){mouseEnter(x,y)});
                hitbox.addEventListener("gotpointercapture",(e)=>{e.target.releasePointerCapture(e.pointerId)})
                cell.appendChild(hitbox);

                // how many words use this letter, how many start with letter
                let letterWrapper = document.createElement("div")
                let letter = document.createElement("div")
                letterWrapper.className = "button-letter";
                let text = document.createTextNode(S.letters[i][j]);
                letter.appendChild(text);
                letterWrapper.appendChild(letter)
                button.appendChild(letterWrapper)

                let use = document.createElement("div");
                use.className = "button-use";
                let start = document.createElement("div");
                start.className = "button-start";
                button.appendChild(use);
                button.appendChild(start);
            }

            
            
            
            
            // final appendage
            
            cell.appendChild(button);
            // row.appendChild(cell);
            board.appendChild(cell);
        }
    }
    // reset board rotation
    //first set rotation
    currentBoardRotation = 0
    //then rotate by 0deg to update 
    rotateBoard(0)
}


let boardButtons = [];

function initializeBoardButtons()
{
    boardButtons = []
    for(var i = 0; i < S.letters.length; i++)
    {
        let row = [];
        for(var j = 0; j < S.letters[i].length; j++)
        {
            row.push(getButtonFromDocument(i,j));
        }
        boardButtons.push(row);
    }
}
function getButtonFromDocument(x,y)
{
    if(S.letters[x][y]==="0")
    {
        return null;
    }
    let but = document.querySelector("#board").childNodes[x*(S.letters.length)+y].querySelector(".boardButton");
    if(but)
    {
        return but;
    }
    else
    {
        return null;
    }
}
function getButton(x,y)
{
    return boardButtons[x][y];
}

function updateLettersInBoard()
{
    let allIncludedPositions = [];
    let startingPositions = [];
    for (let i = 0; i < S.wordsToFind.length; i++) {
        if(!wordsFound[i])
        {
            for (let y = 0; y < S.wordsToFind[i].positions.length; y++) {
                allIncludedPositions.push(S.wordsToFind[i].positions[y]);
            }
            
            startingPositions.push(S.wordsToFind[i].positions[0])
        }
        
    }
    

    for (let i = 0; i < S.letters.length; i++) {
        
        for (let y = 0; y < S.letters.length; y++) {
            let button = getButton(i,y);
            if(!button)
            {
                continue;
            }
            let timesUsedInWord = allIncludedPositions.filter(el=>(el.x==i&&el.y==y)).length;


            
            let use = button.getElementsByClassName("button-use")[0]; // button always has one
            let start = button.getElementsByClassName("button-start")[0]; // button always has one
            // update active letters
            if(!button.classList.contains("allWereFound") && timesUsedInWord === 0)
            {
                button.classList.add("allWereFound");
                use.textContent = ""
                start.textContent = ""
            }
            else
            {
                // update times used in a word

                if(hintTimesIncluded && timesUsedInWord > 0)
                {
                    use.textContent = timesUsedInWord;
                }
                else
                {
                    use.textContent = ""
                }
                

                // update first time in words

                let timesStartingWithThis = startingPositions.filter(el=>(el.x==i&&el.y==y)).length;
                if(hintTimesStarting && timesStartingWithThis > 0)
                {
                    start.textContent = timesStartingWithThis
                }
                else
                {
                    start.textContent = ""
                }
            }
        }
    }
    

}

function rotateBoard(deg){
    currentBoardRotation += deg
    board.style.transform = `rotate(${currentBoardRotation}deg)`
    board.childNodes.forEach(cell=>{
        cell.style.transform = `rotate(${-(currentBoardRotation)}deg)`
    })
    // boardButtons.map((row)=>{
    //     row.map(cell=>{
    //         if(cell)
    //         {
    //             cell.style.transform = `rotate(${-(currentBoardRotation)}deg)`
    //         }
            
    //     })
    // })
    updateBoardCoordinates()
}