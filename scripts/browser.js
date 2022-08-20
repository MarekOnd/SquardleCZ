

function updateBrowserContent()
{
    // create all tiles that should show according to settings
    let browser = document.getElementById("browser-tiles");
    clearChildren(browser)
    let allTiles = []
    if(getSettingsProperty("showCasual"))
    {
        for (let i = 0; i < squardlesCasual.length; i++) {
            const element = squardlesCasual[i];
            if(showThisActiveState(getSquardleActiveState(element)))
            {
                let browserTile = createSquardleTile(element,"casual",i);
                allTiles.push(browserTile);
            }
            
        }
    }
    if(getSettingsProperty("showWeekly"))
    {
        for (let i = 0; i < squardlesWeekly.length; i++) {
            const element = squardlesWeekly[i];
            if(showThisActiveState(getSquardleActiveState(element)))
            {
                let browserTile = createSquardleTile(element,"weekly",i);
                allTiles.push(browserTile);
            }
            
        }
    }
    if(getSettingsProperty("showSpecial"))
    {
        for (let i = 0; i < squardlesSpecial.length; i++) {
            const element = squardlesSpecial[i];
            if(showThisActiveState(getSquardleActiveState(element)))
            {
                let browserTile = createSquardleTile(element,"special",i);
                allTiles.push(browserTile);
            }
            
        }
    }
    if(getSettingsProperty("showShared"))
    {
        for (let i = 0; i < squardlesShared.length; i++) {
            const element = squardlesShared[i];
            if(showThisActiveState(getSquardleActiveState(element)))
            {
                let browserTile = createSquardleTile(element,"shared",i);
                allTiles.push(browserTile);
            }
            
        }
    }
    if(allTiles.length === 0)
    {
        let allHiddenText = document.createElement("div");
        allHiddenText.textContent = "Všechny squarly jsou schované, aktivujte je v nastavení";
        browser.appendChild(allHiddenText);
    }
    for (let i = 0; i < allTiles.length; i++) {
        const element = allTiles[i];
        browser.appendChild(element);
    }

    if(getSettingsProperty("showShared"))
    {
        // at the end add import
        let label = document.createElement("label");
        label.htmlFor = "import-file";

        let content = document.createElement("div");
        content.id = "content";
        let plus = document.createElement("img");
        plus.id = "plus"
        plus.src = "./images/plus.svg"
        content.appendChild(plus)
        let importButton = document.createElement("div");
        importButton.classList.add("browserTile");
        importButton.id ="import-tile";
        importButton.title = "importovat"
        label.appendChild(content)
        importButton.appendChild(label);
        browser.appendChild(importButton);
    }
    

    tabBefore = "browser"

}
function showThisActiveState(state)// return whether this state should be shown according to settings
{
    if(state === "old")
    {
        if(getSettingsProperty("showOld"))
        {
            return true;
        }
    }
    else if(state === "active")
    {
        if(getSettingsProperty("showActive"))
        {
            return true;
        }
    }
    else// upcoming
    {
        if(getSettingsProperty("showUpcoming"))
        {
            return true;
        }
    }
    return false;
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
        content.addEventListener("click",(e)=>{squardleBrowserTileClick(classToAdd,index)})
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

            squardleBrowserTileClick(classToAdd,index, true);
            updateFound();
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
            
            date.textContent = "Zbývá " + howManyDays + " dnů " + howManyHours  + " h ";
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
    let difficultyDiv = document.createElement("div");
    difficultyDiv.id = "difficulty";
    for (let i = 0; i < parseFloat(sq.difficulty); i++) {
        let difficultyStar = document.createElement("img");
        difficultyStar.classList.add("difficultyStar");
        difficultyStar.src = "./images/star.svg";
        difficultyDiv.appendChild(difficultyStar);
    }
    content.appendChild(difficultyDiv)
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
        let preview = document.createElement("div");
        preview.id = "preview";
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
            preview.appendChild(tileRow);
        })
        content.appendChild(preview);
    }

    // SQUARDLE PROGRESS
    // variables
    let maxScore = getMaxSquardleScore(sq)
    let score = getSquardleScore(sq);
    let progress = 1.0*score/maxScore;
    // divs

    let scoreTitle = document.createElement("div")
    scoreTitle.id = "scoreTitle";
    scoreTitle.textContent = "Postup: " + score +"/" + maxScore;
    
    

    // score bar
    let scoreDiv = document.createElement("div");
    scoreDiv.id = "score";

    let scoreBarEmpty = document.createElement("div");
    scoreBarEmpty.id = "barEmpty";
    
    scoreBarEmpty.style.backgroundSize = (200.0/maxScore)*100 + "px"
    scoreBarEmpty.style.backgroundPositionX = ((-200.0/maxScore)*50-5) + "px"

    let scoreBarFull = document.createElement("div");
    scoreBarFull.id = "barFull";

    scoreBarFull.style.backgroundSize = (200.0/maxScore)*100 + "px"
    scoreBarFull.style.backgroundPositionX = ((-200.0/maxScore)*50-5) + "px"
    
    if(tabBefore !== "browser")
    {
        scoreBarFull.style.width =  "0%";
        setTimeout(()=>{scoreBarFull.style.width = progress*100 + "%";}, 200 + index*100)
    }
    else
    {
        scoreBarFull.style.width = progress*100 + "%";
    }
    
    



    if(progress > 0)
    {
        scoreDiv.appendChild(scoreBarFull);
    }
    //scoreDiv.appendChild(scorePercent);
    scoreDiv.appendChild(scoreBarEmpty);
    if(progress === 1) // mark completed
    {
        browserTile.classList.add("completed");
        let ticked = document.createElement("img");
        ticked.id = "tick";
        ticked.src = "./images/tick.svg"
        browserTile.appendChild(ticked)
    }
    // append score
    content.appendChild(scoreTitle)
    content.appendChild(scoreDiv);
    
    // shared can be deleted
    if(classToAdd === "shared")
    {
        let deleteButton = document.createElement("img");
        deleteButton.id = "delete";
        deleteButton.src = "./images/delete.svg"
        deleteButton.title = "Vymazat"
        deleteButton.addEventListener("click",(e)=>{
            squardlesShared.splice(index,1);
            localStorage.setItem("squardlesShared", JSON.stringify(squardlesShared))
            updateBrowserContent();
        })
        browserTile.appendChild(deleteButton)
    }


    browserTile.appendChild(content)

    return browserTile;
}

function squardleBrowserTileClick(type, index, prev = false)
{
    preview = prev;// declared in squardle
    currentSquardle = new searchParameters(type, index);
    openTab("game");
}

