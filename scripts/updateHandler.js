function initUpdate()
{
    const version = 3
    if(localStorage.getItem("version") !== null)
    {
        if(JSON.parse(localStorage.getItem("version")) !== version)
        {
            localStorage.setItem("squardleSettings",JSON.stringify(defaultSettings));
            localStorage.setItem("version",JSON.stringify(version))
        }
        
    }
    else// is null or undefined
    {
        localStorage.setItem("squardleSettings",JSON.stringify(defaultSettings));
        localStorage.setItem("version",JSON.stringify(version))
    }
}