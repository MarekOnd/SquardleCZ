let allTabs = [
    "game",
    "browser",
    "news",
    "stats",
    "about",
    "guide",
]

let tabBefore;
function openTab(tabId)
{
    closeMenu()
    // set pervious tab, for loading browser and its updates
    if(localStorage.getItem("currentTab") !== undefined)
    {
        tabBefore = JSON.parse(localStorage.getItem("currentTab"));
    }
    // hides all
    for (let index = 0; index < allTabs.length; index++) {
        document.getElementById(allTabs[index]).style.display = "none";
        document.getElementById("goto-" + allTabs[index]).classList.remove("selectedTab-button");
    }
    // shows chosen tab
    document.getElementById(tabId).style.display = "block";
    document.getElementById("goto-" + tabId).classList.add("selectedTab-button");
    // does additional stuff for each tab
    switch(tabId)
    {
        case "game":
            saveCurrentSquardle();
            loadSquardle(getSquardle(currentSquardle));
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
    }
    // save current tab
    localStorage.setItem("currentTab", JSON.stringify(tabId))
}




