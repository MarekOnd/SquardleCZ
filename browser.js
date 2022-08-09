



function updateBrowserContent()
{
    
    let browser = document.getElementById("browser-tiles");
    clearChildren(browser)
    let allTiles = []
    for (let i = 0; i < squardlesCasual.length; i++) {
        const element = squardlesCasual[i];
        let browserTile = createSquardleTile(element,"casual",i);
        allTiles.push(browserTile);
    }
    for (let i = 0; i < squardlesWeekly.length; i++) {
        const element = squardlesWeekly[i];
        let browserTile = createSquardleTile(element,"weekly",i);
        allTiles.push(browserTile);
    }
    for (let i = 0; i < squardlesSpecial.length; i++) {
        const element = squardlesSpecial[i];
        let browserTile = createSquardleTile(element,"special",i);
        allTiles.push(browserTile);
    }
    for (let i = 0; i < squardlesShared.length; i++) {
        const element = squardlesShared[i];
        let browserTile = createSquardleTile(element,"shared",i);
        allTiles.push(browserTile);
    }

    for (let i = 0; i < allTiles.length; i++) {
        const element = allTiles[i];
        browser.appendChild(element)
    }

}

function createSquardleTile(sq, classToAdd, index)
{
    //TILE
    let browserTile = document.createElement("div");
    browserTile.classList.add("browserTile");
    browserTile.classList.add(classToAdd);
    let content = document.createElement("div");
    content.id = "content";

    //DATE AVAILABLE

    let previewBoard = true; // for not previewing future boards
    let date = document.createElement("div");
    date.id = "date";
    if(sq.limitedTime === null || sq.limitedTime === undefined || !sq.limitedTime)// always active
    {
        browserTile.classList.add("notTimed");
        date.textContent = ""
        browserTile.addEventListener("click",(e)=>{squardleBrowserTileClick(classToAdd,index)})
    }
    else if(new Date(sq.startDate) > Date.now())// not yet active
    {
        // does not preview board
        previewBoard = false; 
        // shows clock with remaining days
        browserTile.classList.add("notStarted");

        let howManyDays = Math.floor(1.0*(new Date(sq.startDate).getTime() - Date.now())/24/3600/1000);
        let howManyHours = Math.floor(1.0*(new Date(sq.startDate).getTime() - Date.now())/3600/1000)%24;
        let howManyMinutes = Math.floor(1.0*(new Date(sq.startDate).getTime() - Date.now())/1000)%60;
        if(howManyDays === 0)
        {
            if(howManyHours===0)
            {
                date.textContent = "Začíná za " + howManyMinutes + " min";
            }
            else
            {
                date.textContent = "Začíná za " + howManyHours  + " h " + howManyMinutes + " min";
            }
            
        }
        else
        {
            date.textContent = "Začíná "  + (new Date(sq.startDate)).getDate() + ". " + ((new Date(sq.startDate)).getMonth()+1) + ". "
        }
        
    }
    else if(new Date(sq.endDate) < Date.now())// already ended
    {
        // shows the last day when it was active
        browserTile.classList.add("ended");
        date.textContent = "Uzavřeno " + (new Date(sq.endDate)).getDate() + ". " + ((new Date(sq.endDate)).getMonth()+1) + ". ";

        // look how you ended
        let seeResultButton = document.createElement("img");
        seeResultButton.src = "./images/eye.svg";
        seeResultButton.classList.add("seeResultButton");
        seeResultButton.addEventListener("click",(e)=>{
            squardleBrowserTileClick(classToAdd,index);
            board.classList.add("disabled");
            })
        seeResultButton.title = "Podívat se na výsledek";
        browserTile.appendChild(seeResultButton)
    }
    else// is active
    {
        // shows how much time remains
        browserTile.classList.add("active");
        let howManyDays = Math.floor(1.0*(new Date(sq.endDate).getTime() - Date.now())/24/3600/1000)
        let howManyHours = Math.floor(1.0*(new Date(sq.endDate).getTime() - Date.now())/3600/1000)%24
        let howManyMinutes = Math.floor(1.0*(new Date(sq.endDate).getTime() - Date.now())/1000)%60
        if(howManyDays === 0)
        {
            if(howManyHours===0)
            {
                date.style.color = "orange"
                date.textContent = "Zbývá " + howManyMinutes + " minut";
            }
            else
            {
                date.style.color = "red"
                date.textContent = "Zbývá " + howManyHours  + " hodin " + howManyMinutes + " minut";
            }
            
        }
        else
        {
            
            date.textContent = "Zbývá " + howManyDays + " dnů " + howManyHours  + " h " + howManyMinutes + " min";
        }
        

        browserTile.addEventListener("click",(e)=>{squardleBrowserTileClick(classToAdd,index)})
    }
    browserTile.appendChild(date);

    
    
    //TYPE #number
    let type = document.createElement("div");
    switch(classToAdd)
    {
        case "casual":
            type.textContent = "Odpočinkový #" + (index+1);
            break;
        case "weekly":
            type.textContent = "Týdenní #" + (index+1);
            break;
        case "shared":
            type.textContent = "Sdílený #" + (index+1);
            break;
        case "special":

            break;
        default:
            console.log("ERROR, UNKNOWN TYPE")
            break;
    }
    type.id = "type";
    content.appendChild(type);
    
    //NAME
    let name = document.createElement("div");
    name.id = "name";
    name.textContent = sq.name;
    content.appendChild(name);
    switch(classToAdd)
    {
        case "casual":

            break;
        case "weekly":

            break;
        case "shared":

            break;
        case "special":
            name.style.fontSize = "30px"
            name.style.lineHeight = "30px"
            break;
        default:
            console.log("ERROR, INVALID TYPE")
            break;
    }

    // AUTHOR
    let author = document.createElement("div");
    author.id = "author";
    author.textContent = sq.author;
    content.appendChild(author)
    //DIFFICULTY
    
    for (let i = 0; i < parseFloat(sq.difficulty); i++) {
        let difficultyStar = document.createElement("img");
        difficultyStar.classList.add("difficultyStar");
        difficultyStar.src = "./images/star.svg";
        content.appendChild(difficultyStar);
    }
    // switch(parseFloat(sq.difficulty))
    // {
    //     case 1:
    //         difficulty.textContent = "*";
    //         break;
    //     case 2:
    //         difficulty.textContent = "**";
    //         break;
    //     case 3:
    //         difficulty.textContent = "***";
    //         break;
    //     case 4:
    //         difficulty.textContent = "****";
    //         break;
    //     case 5:
    //         difficulty.textContent = "*****";
    //         break;
    //     default:
    //         difficulty.textContent = "";
    // }

    if(previewBoard)
    {
        //SIZE CREATED
        let size = document.createElement("div");
        size.id = "size";
        let sqSize = sq.letters.length;
        sq.letters.map((row)=>{
            let tileRow = document.createElement("div");
            tileRow.classList.add("previewTileRow");
            row.map((letter)=>{
                let tile = document.createElement("div");
                tile.classList.add("previewTile");
                if(letter==="0")
                {
                    tile.style.visibility = "hidden";
                }
                tile.textContent = letter;
                tileRow.appendChild(tile)
            })
            size.appendChild(tileRow);
        })
        content.appendChild(size);
    }

    // SQUARDLE PROGRESS
    // variables
    let maxScore = getMaxSquardleScore(sq)
    let score = getCurrentSquardleScore(sq);
    let progress = 1.0*score/maxScore;
    // divs
    content.appendChild(document.createElement("br"));
    let scoreTitle = document.createElement("div")
    scoreTitle.id = "scoreTitle";
    scoreTitle.textContent = "Postup: ";
    content.appendChild(scoreTitle)
    

    let scoreDiv = document.createElement("div");
    scoreDiv.id = "score";
    //scoreDiv.style.width = maxScore/5 + "px"
    
   
    
    // let scorePercent = document.createElement("div");
    // scorePercent.id = "percent";
    // if(progress===1 || progress === 0)
    // {
    //     scorePercent.textContent = "Nové";
    //     scorePercent.style.textAlign = "center"
    // }
    // else
    // {
    //     scorePercent.textContent = Math.floor(progress*100) + "%";
    //     scorePercent.style.textAlign = "right"
    // }
    
    let scoreBarEmpty = document.createElement("div");
    scoreBarEmpty.id = "barEmpty";
    
    scoreBarEmpty.style.backgroundSize = (200.0/maxScore)*100 + "px"
    scoreBarEmpty.style.backgroundPositionX = ((-200.0/maxScore)*50-5) + "px"

    let scoreBarFull = document.createElement("div");
    scoreBarFull.id = "barFull";
    scoreBarFull.style.width = progress*100 + "%";

    if(progress > 0)
    {
        scoreDiv.appendChild(scoreBarFull);
        
    }
    //scoreDiv.appendChild(scorePercent);
    scoreDiv.appendChild(scoreBarEmpty);
    content.appendChild(scoreDiv);


    browserTile.appendChild(content)

    return browserTile;
}

function squardleBrowserTileClick(type, index)
{
    currentSquardle = new searchParameters(type, index);
    openTab("game");
}

