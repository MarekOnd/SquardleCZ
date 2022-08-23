function initUpdate()
{
    if(localStorage.getItem("version") !== null)
    {
        if(JSON.parse(localStorage.getItem("version")) !== 2)
        {
            localStorage.setItem("squardleSettings",JSON.stringify(defaultSettings));
            localStorage.setItem("version",JSON.stringify(2))
        }
        
    }
    else// is null or undefined
    {
        localStorage.setItem("squardleSettings",JSON.stringify(defaultSettings));
        localStorage.setItem("version",JSON.stringify(2))
    }
}