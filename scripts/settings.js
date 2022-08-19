

class settings{
    colorPallete;

    constructor(settings_)
    {
        if(settings_)// copy 
        {

        }
        else// default
        {

        }
    }
}




let sett = {
    colorPallete:[
                    '#000124',
                    '#03045E',
                    '#023E8A',
                    '#0077B6',
                    '#0096C7',
                    '#00B4D8',
                    '#48CAE4',
                    '#90E0EF',
                    '#ADE8F4',
                    '#CAF0F8'
                ],// always 10 colors
    
    showMouseParticles:false,
    mouseParticles:"snow",// snow, emojis
    buttonSize:"normal",// small, normal, big
    gameLayout:"hiddenFound",//hiddenFound, shownFoundOnLeft, shownFoundOnRight (only on monitors)
    animations:true,
    invertAll:true
    

};
function initializeSettings()
{

}

function applySettings()
{

}

function loadSettings()
{
    if(localStorage.getItem("settings"))
    {
        sett = localStorage.getItem("settings");
    }
}

function saveSettings()
{
    localStorage.setItem(sett)
}

function setSettingsProperty(propertyName)
{
    
}