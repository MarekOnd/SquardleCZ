


let mouseParticlesModels = ["*", "🍕","❤","💤"];
let defaultSettings = {
    /* mouse particles */
    showMouseParticles:false,
    showMouseParticleAmount:500,
    mouseParticlesModel:"snow",// snow, emojis

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
    

    buttonSize:"normal",// small, normal, big
    gameLayout:"hiddenFound",//hiddenFound, shownFoundOnLeft, shownFoundOnRight (only on monitors)
    animations:true,
    invertAll:true
};

let currentSettings;

function getSettingsProperty(name)
{
    switch(name)
    {
        case "showMouseParticles":
            return currentSettings.showMouseParticles;
        case "mouseParticleAmount":
            return currentSettings.mouseParticleAmount;
        case "mouseParticlesModel":
            return currentSettings.mouseParticlesModel;
        default:
            break;
    }

}





function initializeSettings()
{
    loadSettings();
    document.querySelector("#showMouseParticles").checked = currentSettings.showMouseParticles;
    document.querySelector("#mouseParticleAmount").value = currentSettings.mouseParticleAmount;
    initSelectOptions('mouseParticlesModel', mouseParticlesModels);
    applySettings();
    console.log(currentSettings)
}




function applySettings()
{
    mouseParticleWait = (1000-currentSettings.mouseParticleAmount)/100;
    mouseParticlesModel = currentSettings.mouseParticlesModel;
}

function loadSettings()
{
    if(localStorage.getItem("settings"))
    {
        currentSettings = JSON.parse(localStorage.getItem("settings"));
    }
    else
    {
        currentSettings = defaultSettings;
    }
}

function saveSettings()
{
    localStorage.setItem("settings",JSON.stringify(currentSettings));
}

function setSettingsProperty(propertyName, value)
{
    switch(propertyName)
    {
        case "showMouseParticles":
            currentSettings.showMouseParticles = value;
            break;
        case "mouseParticleAmount":
            currentSettings.mouseParticleAmount = value;
            break;
        case "mouseParticlesModel":
            currentSettings.mouseParticlesModel = mouseParticlesModels[value];
            break;
        default:
            break;
    }
    applySettings();
    saveSettings();
}

function initSelectOptions(selectId, options)
{
    let select = document.querySelector('#' + selectId);
    for (let i = 0; i < options.length; i++) {
        const element = options[i];
        let option = document.createElement("div");
        option.textContent = element;
        option.classList.add("option");
        option.addEventListener('pointerup', ()=>{selectOption(selectId, i)});
        select.appendChild(option);
    }
}

function selectOption(id, index)
{
    let select = document.querySelector('#' + id);
    let selectChildren = select.querySelectorAll(".option");

    for (let i = 0; i < selectChildren.length; i++) {
        let option = selectChildren[i];
        option.classList.remove('selectedOption');
    }
    selectChildren[index].classList.add('selectedOption');
    setSettingsProperty(id, index);
}