function initUpdate()
{
    if(localStorage.getItem("version") !== null)
    {
        if(JSON.parse(localStorage.getItem("version")) !== 1)
        {
            localStorage.setItem("squardleSettings",JSON.stringify(defaultSettings));
            localStorage.setItem("version",JSON.stringify(1))
        }
        
    }
}