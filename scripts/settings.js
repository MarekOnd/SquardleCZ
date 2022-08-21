
class option{
    preview;
    value;
    constructor(preview_, value_)
    {
        this.preview = preview_;
        this.value = value_;
    }
}

// properties to set
let mouseParticlesModels = [
    new option("vločka", "*"),
    new option("pizzy", ["🍕"]),
    new option("srdíčka", ["❤","🧡","💛","💚","💙"]),
    new option("mega", ["༼ つ ◕_◕ ༽つ","ᓚᘏᗢ","╰(*°▽°*)╯"]),
];



let defaultSettings = {
    /* mouse particles */
    showMouseParticles:false,
    showMouseParticleAmount:500,
    mouseParticlesModel:["🍕"],

    /* browser filter */
    showOld:false,
    showActive:true,
    showUpcoming:true,
    showCasual:true,
    showWeekly:true,
    showSpecial:true,
    showShared:true,
    showCompleted:true
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
}
function setSettingsProperty(propertyName, value)
{
    currentSettings[propertyName] = value;
    applySettings();
    saveSettings();
}


function initializeSettings()
{
    loadSettings();
    /* MOUSE PARTICLES */
    document.querySelector("#showMouseParticles").checked = getSettingsProperty("showMouseParticles");
    document.querySelector("#mouseParticleAmount").value = getSettingsProperty("mouseParticleAmount");
    initSelectOptions('mouseParticlesModel', mouseParticlesModels);

    /* FILTERS */
    let filterNames = ["showCasual","showWeekly","showSpecial","showShared","showOld","showActive","showUpcoming","showCompleted"]
    for (let i = 0; i < filterNames.length; i++) {
        const name = filterNames[i];
        document.querySelector("#"+name).checked = getSettingsProperty(name);
    }
    applySettings();
}




function applySettings()
{
    mouseParticleWait = (5000-currentSettings.mouseParticleAmount)/100;
    mouseParticlesModel = currentSettings.mouseParticlesModel;
}

function loadSettings()
{
    if(localStorage.getItem("squardleSettings") !== null)
    {
        currentSettings = JSON.parse(localStorage.getItem("squardleSettings"));
    }
    else
    {
        currentSettings = defaultSettings;
    }
}

function saveSettings()
{
    localStorage.setItem("squardleSettings",JSON.stringify(currentSettings));
}





function initSelectOptions(selectId, options)
{
    let select = document.querySelector('#' + selectId);
    for (let i = 0; i < options.length; i++) {
        let opt = document.createElement("div");
        opt.textContent = options[i].preview;
        opt.classList.add("option");
        if((options[i].value.length && options[i].value[0] === getSettingsProperty(selectId)[0]) || options[i].value === getSettingsProperty(selectId))// TODO: make it more versatile
        {
            opt.classList.add("selectedOption");
        }
        opt.addEventListener('pointerup', ()=>{selectOption(selectId, i, options[i].value)});
        select.appendChild(opt);
    }

}

function selectOption(id, index, value)
{
    let select = document.querySelector('#' + id);
    let selectChildren = select.querySelectorAll(".option");

    for (let i = 0; i < selectChildren.length; i++) {
        let option = selectChildren[i];
        option.classList.remove('selectedOption');
    }
    selectChildren[index].classList.add('selectedOption');
    setSettingsProperty(id, value);
}