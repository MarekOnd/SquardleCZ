let allTabs = [
    "game",
    "browser",
    "news",
    "stats",
    "about",
    "guide",
    "settings"
]

let tabBefore;
function openTab(tabId)
{
    closeMenu()
    let tabBeforeBefore = tabBefore;
    // set pervious tab, for loading browser and its updates
    if(localStorage.getItem("currentTab") !== undefined)
    {
        tabBefore = JSON.parse(localStorage.getItem("currentTab"));
    }
    // tab from which user is going
    switch(tabBefore)
    {
        case "game":
            leftSquardle();
            break;
        case "browser":
            break;
        case "news":
            break;
        case "stats":
            break;
        case "about":
            break;
        case "guide":
            break;
        case "settings":
            if(!tabBeforeBefore)
            {
                openTab("browser");
                return;
            }
            break;
    }

   
    // hides all
    for (let index = 0; index < allTabs.length; index++) {
        // document.getElementById(allTabs[index]).stylse.display = "none";
        document.getElementById(allTabs[index]).hidden = true;
        document.getElementById("goto-" + allTabs[index]).classList.remove("selectedTab-button");
    }
    // shows chosen tab
    // document.getElementById(tabId).style.display = "block";
    document.getElementById(tabId).hidden = false;
    document.getElementById("goto-" + tabId).classList.add("selectedTab-button");


    // save current tab
    localStorage.setItem("currentTab", JSON.stringify(tabId))
    
    // does additional stuff for each tab the user is switching to
    switch(tabId)
    {
        case "game":
            saveCurrentSquardle();
            loadSquardle(getSquardle(currentSquardle));
            document.querySelector("#share").hidden = false;
            document.querySelector("#share-spacer").hidden = true;
            break;
        case "browser":
            updateBrowserContent();
            break;
        case "news":
            break;
        case "stats":
            updateStats();
            break;
        case "about":
            break;
        case "guide":
            break;
        case "settings":
            if(tabBefore === "settings")
            {
                if(tabBeforeBefore)
                {
                    openTab(tabBeforeBefore);
                    tabBefore = tabBeforeBefore;
                }
                
            }
            break;
    }
    
}




