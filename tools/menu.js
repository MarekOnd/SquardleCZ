function openTab(tabId, button)
{

    let tab = document.getElementById(tabId);
    //left side alwats fits screen
    document.getElementById("squardleEditor").style.width = "1000vw"
    if(tab.style.display === "none")
    {
        button.classList.add("selected-tab-button")
        tab.style.display = "block";
    }
    else
    {
        button.classList.remove("selected-tab-button")
        tab.style.display = "none"
    }
}