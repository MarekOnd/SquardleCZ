// WIN
let winplayed;
function win()
{
    if(winplayed)
    {
        return;
    }
    // let board = document.querySelector("#board")
    // let points = [
    //     { transform: 'rotate(0) scale(1)' },
    //     { transform: 'rotate(-90deg) scale(1.2)' },
    //     { transform: 'rotate(180deg) scale(1.5)' },
    //     { transform: 'rotate(360deg) scale(1)' }
    // ];
      
    // for (let i = 0; i < S.letters.length; i++) {
        
    //     for (let y = 0; y < S.letters.length; y++) {
    //         let button = getButton(i,y);
    //         const timing = {
    //             duration: 2000-(y+1)*300 - (i+1)*100,
    //             iterations: 1
    //         }
    //         // button.setAttribute('style','animation-delay: -20000;');
    //         setTimeout(()=>{
    //             button.animate(points,timing);
    //         },(y+1)*300 + (i+1)*100)
    //     }
    // }
    let particle = new Particle(getSettingsProperty('mouseParticlesModel'),
                                                ["mouseParticle1","mouseParticle2"], 
                                                new Range2D(new Range(-window.innerWidth/2, window.innerWidth), new Range(0)), 
                                                0, 
                                                new Range(10000, 20000), 
                                                new Range(280,320), 
                                                new Range(20,50), 
                                                true,
                                                false,
                                                2);
    for (let i = 0; i < 10; i++) {
        setTimeout(()=>{
            for (let y = 0; y < 10; y++) {
                createParticle(particle.copy);
            }
        }, i*500)
        
        
    }
}