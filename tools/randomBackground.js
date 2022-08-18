const allBackgrounds = [
  {name:"techno.jpg",weight:10},
  {name:"swirl.png",weight:5},
  {name:"swirl_2.png",weight:3},
  {name:"swirl_3.png",weight:2},
  {name:"swirl_4.png",weight:2},
  {name:"swirl_5.png",weight:2},
  {name:"swirl_6.png",weight:2},
]

function getRandomBackground(arr){
  let weightSum = arr.reduce((prevNum,currObj)=>prevNum+currObj.weight,0)
  let target = Math.floor(Math.random()*weightSum)
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];      
      if(target<=item.weight){
        return item.name
      }
      target -= item.weight
  }

}

function backgroundInit(index=-1){
  const body = document.querySelector("body")
  let background;
  if(index ===-1){
    background = getRandomBackground(allBackgrounds)
  }else{
    background = allBackgrounds[index%allBackgrounds.length].name
  }
  body.style.backgroundImage = `url(../images/${background})`
}

backgroundInit(-1)