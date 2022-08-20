// properties to set
let mouseParticlesModels = ["*", ["🍕"],"❤",["💤"]];


let defaultSettings = {
    /* mouse particles */
    showMouseParticles:false,
    showMouseParticleAmount:500,
    mouseParticlesModel:"🍕",

    /* browser filter */
    showOld:false,
    showActive:true,
    showUpcoming:true,
    showCasual:true,
    showWeekly:true,
    showSpecial:true,
    showShared:true,
    // orderBy:"date",


    // colorPallete:[
    //                 '#000124',
    //                 '#03045E',
    //                 '#023E8A',
    //                 '#0077B6',
    //                 '#0096C7',
    //                 '#00B4D8',
    //                 '#48CAE4',
    //                 '#90E0EF',
    //                 '#ADE8F4',
    //                 '#CAF0F8'
    //             ],// always 10 colors
    

    // buttonSize:"normal",// small, normal, big
    // gameLayout:"hiddenFound",//hiddenFound, shownFoundOnLeft, shownFoundOnRight (only on monitors)
    // animations:true,
    // invertAll:true
};

let currentSettings;

function getSettingsProperty(name)
{
    if(currentSettings[name] === null && currentSettings[name] === undefined)
    {
        return defaultSettings[name];
    }
    else
    {
        return currentSettings[name];
    }
    

    switch(name)
    {
        case "showMouseParticles":
            return currentSettings.showMouseParticles;
        case "mouseParticleAmount":
            return currentSettings.mouseParticleAmount;
        case "mouseParticlesModel":
            return currentSettings.mouseParticlesModel;
        case "showCasual":
            return currentSettings.showCasual !== null ? currentSettings.showCasual :  true;
        case "showWeekly":
            return currentSettings.showWeekly !== null ? currentSettings.showWeekly :  true;
        case "showSpecial":
            return currentSettings.showSpecial !== null ? currentSettings.showSpecial :  true;
        case "showShared":
            return currentSettings.showShared !== null ? currentSettings.showShared :  true;
        case "showOld":
            return currentSettings.showOld !== null ? currentSettings.showOld :  true;
        case "showActive":
            return currentSettings.showActive !== null ? currentSettings.showActive :  true;
        case "showUpcoming":
            return currentSettings.showUpcoming !== null ? currentSettings.showUpcoming :  true;
        
            
            default:
                alert("Nastavení neexistuje")
                break;
    }

}
function setSettingsProperty(propertyName, value)
{
    currentSettings[propertyName] = value;
    applySettings();

    saveSettings();
    return;
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
        case "showCasual":
            currentSettings.showCasual = value;
            break;
        case "showWeekly":
            currentSettings.showWeekly = value;
            break;
        case "showSpecial":
            currentSettings.showSpecial = value;
            break;
        case "showShared":
            currentSettings.showShared = value;
            break;
        case "showOld":
            currentSettings.showOld = value;
            break;
        case "showActive":
            currentSettings.showActive = value;
            break;
        case "showUpcoming":
            currentSettings.showUpcoming = value;
            break;
        default:
            break;
    }
    
}


function initializeSettings()
{
    loadSettings();
    /* MOUSE PARTICLES */
    document.querySelector("#showMouseParticles").checked = getSettingsProperty("showMouseParticles");
    document.querySelector("#mouseParticleAmount").value = getSettingsProperty("mouseParticleAmount");
    initSelectOptions('mouseParticlesModel', mouseParticlesModels);

    /* FILTERS */
    let filterNames = ["showCasual","showWeekly","showSpecial","showShared","showOld","showActive","showUpcoming"]
    for (let i = 0; i < filterNames.length; i++) {
        const name = filterNames[i];
        document.querySelector("#"+name).checked = getSettingsProperty(name);
    }
    applySettings();
}




function applySettings()
{
    mouseParticleWait = (1000-currentSettings.mouseParticleAmount)/100;
    mouseParticlesModel = currentSettings.mouseParticlesModel;
}

function loadSettings()
{
    if(localStorage.getItem("settings") !== null)
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





function initSelectOptions(selectId, options)
{
    let select = document.querySelector('#' + selectId);
    for (let i = 0; i < options.length; i++) {
        const element = options[i];
        let option = document.createElement("div");
        option.textContent = element;
        option.classList.add("option");
        if(element[0] === getSettingsProperty(selectId)[0])// TODO: make it more versatile
        {
            option.classList.add("selectedOption");
        }
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