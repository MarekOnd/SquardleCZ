
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
    new option("🍕", ["🍕"]),
    new option("🧡", ["❤","🧡","💛","💚","💙"]),
    new option("🎶", ["🎶","🎵"]),
    new option("🔴", ["🔴","🟠","🟡","🟢","🔵","🟣","🟤","⚫","⚪"]),
    new option("（￣︶￣）↗　", ["ψ(｀∇´)ψ","( $ _ $ )","(✿◡‿◡)","ƪ(˘⌣˘)ʃ","(⓿_⓿)","(。_。)","(⊙_⊙)","^_____^","¬_¬"]),
    new option(" vločka ", "*"),
    new option(" mišmaš ", ["❌","⚜","🔺","🕗","🧩","🧸","🔑","⛏","🧮","📜"]),
    new option(" smajlíci ", ["😶","🤗","🤔","🤩","🤣","😂","😁","🤑","😭","🤯","🥶","🤠","🤓","🧐","🤭"]),
    new option(" realističtí smajlíci ", ["👴","🧓","👳‍♂️","👳‍♀️","🤴","👮‍♀️","🧔","👼","👲","👩‍⚖️","👨‍🏫","👩‍🔧","👩‍💻","👩‍🚒","👨‍🚀","🧛‍♀️","🦸‍♂️","🧚‍♂️","🙎‍♀️","🧜‍♂️","🧘🏿‍♂️","🏃🏿‍♀️","🧕🏼","👨🏼‍🍳"]),
];
let lineColorsOptions = [
    new option("modrá", ["rgb(20, 218, 218, 0.5)"]),
    new option("bílá", ["rgb(255, 255, 255, 0.5)"]),
    new option("duhová", ["rgb(255, 52, 0, 0.5)","rgb(255, 250, 0, 0.5)","rgb(0, 255, 11, 0.5)","rgb(0, 252, 255, 0.5)","rgb(0, 14, 255, 0.5)","rgb(255, 0, 253, 0.5)","rgb(255, 163, 0, 0.5)"]),
    new option("česká", ["rgb(17, 69, 126, 0.5)","rgb(255, 255, 255, 0.5)","rgb(215, 20, 26, 0.5)"]),
];



let defaultSettings = {
    

    /* browser filter */
    showOld:false,
    showActive:true,
    showUpcoming:true,
    showCasual:true,
    showWeekly:true,
    showSpecial:true,
    showShared:true,
    showCompleted:true,

    /* board options */
    scaleButtons:true,
    showPreviews:true,

    /* mouse particles */
    showMouseParticles:false,
    showMouseParticleAmount:500,
    mouseParticlesModel:["🍕"],

    /* color theme */
    lineColors: ["rgb(20, 218, 218, 0.5)"],
    themeColor:"blue",

    invertAll:false
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
    // show check
    document.querySelector("#mouseParticleAmount").value = getSettingsProperty("mouseParticleAmount");
    initSelectOptions('mouseParticlesModel', mouseParticlesModels);

    /* CHECK NAMES */
    let filterNames = ["showMouseParticles","showCasual","showWeekly","showSpecial","showShared","showOld","showActive","showUpcoming","showCompleted","scaleButtons","showPreview","invertAll"]
    for (let i = 0; i < filterNames.length; i++) {
        const name = filterNames[i];
        document.querySelector("#"+name).checked = getSettingsProperty(name);
    }

    initSelectOptions("lineColors",lineColorsOptions);
    
    applySettings();
}




function applySettings()
{
    mouseParticleWait = (5000-getSettingsProperty("mouseParticleAmount"))/100;
    mouseParticlesModel = getSettingsProperty("mouseParticlesModel");
    
    if(getSettingsProperty("scaleButtons"))
    {

        document.querySelector(":root").style.setProperty('--selectScale', 0.95);
    }
    else
    {
        document.querySelector(":root").style.setProperty('--selectScale', 1);
    }


    lineColors = getSettingsProperty("lineColors");

    // INVERT
    if(getSettingsProperty("invertAll"))
    {
        document.body.style.filter = "invert(1)";
        document.body.style.backgroundImage = "linear-gradient(to right,rgb(247, 247, 249), rgb(246, 241, 224),rgb(247, 247, 249)  )";
    }
    else
    {
        document.body.style.filter = "invert(0)";
        document.body.style.backgroundImage = "linear-gradient(to right,rgb(8, 8, 6), rgb(9, 14, 31),rgb(8, 8, 6) )";
    }
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