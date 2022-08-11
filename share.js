
const shareData = {
    text: 'Learn web development on MDN!'
  }

function openShareWindow()
{
    // console.log("klik")

    try{
        await navigator.share(shareData)
    }catch(err){
        console.log("ERROR: " +err)
    }
    // if (navigator.share) {
    //     navigator.share({
    //         text: "emojiBoard"
    //     }).then(() => {
    //         console.log('Succesful share');
    //         alert("aaaaaaaaaaaa")
    //     })
    //     .catch((error) => console.error("Error sharing", error));
    // } else {
    //     console.log('Sharing not supported :(');
    // }
    navigator.clipboard.writeText("")
    
}