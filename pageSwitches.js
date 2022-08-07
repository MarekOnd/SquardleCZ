let allTabs = [
    "game",
    "browser",
    "news",
    "results",
    "about",
    "guide",
]


function openTab(tabId)
{
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
            updateBrowserContent()
            break;
        case "news":
            break;
        case "results":
            break;
        case "about":
            break;
        case "guide":
            break;
    }
    // save current tab
    localStorage.setItem("currentTab", JSON.stringify(tabId))
}




