function toggleOpened(box)
{
    if(box.classList.contains("opened"))
    {
        box.classList.remove("opened");
    }
    else
    {
        box.classList.add("opened");
    }
}