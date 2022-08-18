


function toggleMenu()
{
    let menu = document.getElementById("menu");
    if(menu.classList.contains("menuClosed"))
    {

        menu.classList.remove("menuClosed");
        menu.classList.add("menuOpen");
        setTimeout(()=>{
            window.addEventListener("click",closeMenu);
        },30)
        darkenScreen(0.4)
        
    }
    else
    {
        menu.classList.add("menuClosed");
        menu.classList.remove("menuOpen");
        window.removeEventListener("click",closeMenu);
        
    }
}

function closeMenu(event = null)
{
    let menu = document.getElementById("menu");
    if(event === null || event.target !== menu)
    {
        menu.classList.remove("menuOpen");
        menu.classList.add("menuClosed");
        window.removeEventListener("click",closeMenu);
        darkenScreen(0)
    }
}

function darkenScreen(opacity)
{
    document.getElementById("darkenScreen").style.opacity = opacity;
}