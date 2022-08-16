function openTab(tabId)
{
    let editor = document.getElementById("squardleEditor");
    let generator = document.getElementById("squardleGenerator");
    editor.style.display = "none";
    generator.style.display = "none"
    document.getElementById(tabId).style.display = "block";
}