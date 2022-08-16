function openTab(tabId)
{
    let tab = document.getElementById(tabId);
    if(tab.style.display === "none")
    {
        tab.style.display = "block"
    }
    else
    {
        tab.style.display = "none"
    }
}