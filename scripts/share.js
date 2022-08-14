
const shareData = {
    text: 'Learn web development on MDN!'
  }

async function openShareWindow(sq)
{
    // console.log("klik")

    if (navigator.share) {
        navigator.share({
            text: formatSquardleResult(sq)
        }).then(() => {
            console.log('Succesful share');
        })
        .catch((error) => console.error("Error sharing", error));
    } else {
        console.log('Sharing not supported :(');
    }
    navigator.clipboard.writeText(formatSquardleResult(sq));
    
}