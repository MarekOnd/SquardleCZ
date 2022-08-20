function initUpdate()
{
    if(localStorage.getItem("version") === null)
    {
        localStorage.setItem("settings",JSON.stringify(defaultSettings));
        localStorage.setItem("version",JSON.stringify(0.9))
    }
}