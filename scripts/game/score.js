function updateScore()
{
    let score = 0;
    let maxScore = 0
    for (let i = 0; i < wordsFound.length; i++) {
        let word = createWord(S.wordsToFind[i]);
        maxScore += word.length * word.length;
        if(wordsFound[i])
        {
            score += word.length * word.length;
        }
    }
    let scoreBox = document.getElementById("current-points");
    let wordBox = document.getElementById("current-words");

    let scoreBar = document.getElementById("score-bar");
    scoreBar.style.width = String(score/maxScore*100) + "%"

    if(score === maxScore)
    {
        win();
    }

    wordBox.textContent = countTrue(wordsFound) + "/" + wordsFound.length 
    scoreBox.textContent = score + " bodů" ;
}

function showPlusScore(value)
{
    // SHOWING PLUS POINTS AS PARTICLEs
    // OPTION 1 - MANY PARTICLES
    // for (let i = 0; i < element.length*element.length; i++) {
    //     let left = output.getBoundingClientRect().left + output.getBoundingClientRect().width;
    //     let top = output.getBoundingClientRect().top + output.getBoundingClientRect().height;
    //     let plusPointsParticle = new Particle("+1", "particle", new Range2D(new Range(left - 20, left + 100), new Range(top - 100,top + 100)), i*10, 1000, "up", new Range(1000,1000+i*100), false);
    //     createParticle(plusPointsParticle);
    // }

    // OPTION 2 - JUST ONE PARTICLE
    let scoreBoundingBox = document.querySelector("#current-points").getBoundingClientRect()
    let left = scoreBoundingBox.left + scoreBoundingBox.width;
    let top = scoreBoundingBox.top;
    let plusPointsParticle = new Particle(
        [value], 
        ["plusPoints"], 
        new Range2D(new Range(left), new Range(top)), 
        2000, 
        new Range(1000), 
        "up", 
        new Range(30), 
        false
    );

    createParticle(plusPointsParticle);
}