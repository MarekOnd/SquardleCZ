



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
        date.textContent = "Začíná "  + (new Date(sq.startDate)).getDate() + ". " + ((new Date(sq.startDate)).getMonth()+1) + ". "
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
        date.textContent = "Zbývá " + Math.round(1.0*(new Date(sq.endDate).getTime() - Date.now())/24/3600/1000) + " dnů"
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
        default:
            console.log("ERROR, INVALID TYPE")
            break;
    }
    type.id = "type";
    content.appendChild(type);
    
    //NAME
    let name = document.createElement("div");
    name.id = "name";
    name.textContent = sq.name;
    content.appendChild(name);

    //DIFFICULTY
    let difficulty = document.createElement("div");
    difficulty.id = "difficulty";
    switch(sq.difficulty)
    {
        case 1:
            difficulty.textContent = "*";
            break;
        case 2:
            difficulty.textContent = "**";
            break;
        case 3:
            difficulty.textContent = "***";
            break;
        case 4:
            difficulty.textContent = "****";
            break;
        case 5:
            difficulty.textContent = "*****";
            break;
        default:
            difficulty.textContent = "";
    }
    
    content.appendChild(difficulty);

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

    
    browserTile.appendChild(content)

    return browserTile;
}

function squardleBrowserTileClick(type, index)
{
    currentSquardle = new searchParameters(type, index);
    openTab("game");
}

