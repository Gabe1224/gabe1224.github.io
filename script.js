let score = 0
let gameRunning = false

function startGame(){

gameRunning = true
score = 0
updateScore()

spawnDrops()

}

function spawnDrops(){

if(!gameRunning) return

let drop = document.createElement("div")
drop.classList.add("drop")

let type = Math.random()

if(type < 0.75){
drop.classList.add("clean")
drop.onclick = function(){
score += 10
updateScore()
drop.remove()
}
}
else{
drop.classList.add("bad")
drop.onclick = function(){
score -= 20
updateScore()
drop.remove()
}
}

drop.style.left = Math.random()*360 + "px"
drop.style.top = "0px"

document.getElementById("gameArea").appendChild(drop)

let fall = setInterval(function(){

let top = parseInt(drop.style.top)
drop.style.top = top + 3 + "px"

if(top > 500){
drop.remove()
clearInterval(fall)
}

},30)

setTimeout(spawnDrops,1000)

}

function updateScore(){
document.getElementById("score").innerText = "Score: " + score
}

function resetGame(){
gameRunning = false
document.getElementById("gameArea").innerHTML = ""
score = 0
updateScore()
}