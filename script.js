const LIGHT_DELAY = 400
const buttons = [
    {btn: document.querySelector('#red'),    audio: new Sound("./audio/button1.wav")},
    {btn: document.querySelector('#yellow'), audio: new Sound("./audio/button2.wav")},
    {btn: document.querySelector('#blue'),   audio: new Sound("./audio/button3.wav")},
    {btn: document.querySelector('#green'),  audio: new Sound("./audio/button4.wav")},
]
const startButton = document.getElementById('start-button')
let score = 0

let clickedOrder = []
let order = []
let playerTurn = false

const gameOverAudio = new Sound("./audio/gameover.wav")

function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
} 

function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds))
}

const playGame = () => {
    playerTurn = false
    order = []
    clickedOrder = []
    score = 0
    nextLevel()
}

const gameOver = async() => {
    const wrongButton = buttons[clickedOrder[clickedOrder.length-1]].btn

    wrongButton.classList.add('selected')
    gameOverAudio.play()
    await sleep(LIGHT_DELAY*3)
    gameOverAudio.stop()
    wrongButton.classList.remove('selected')

    alert(`Você perdeu, a sua pontuação foi de: ${score}`)
    startButton.innerText = 'INICIAR'
}

const nextLevel = async() => {
    playerTurn = false
    const nextIndex = Math.floor(Math.random() * buttons.length)
    order.push(nextIndex)
    
    await sleep(2*LIGHT_DELAY)
    for(let i of order) {
        await lightUpButtonAndPlayAudio(buttons[i])
        if(i != order.length-1) {
            await sleep(LIGHT_DELAY/2)
        }
    }
    playerTurn = true
}

const lightUpButtonAndPlayAudio = async(button) => {
    button.btn.classList.add('selected')
    button.audio.play()
    await sleep(LIGHT_DELAY)
    button.audio.stop()
    button.btn.classList.remove('selected')
}

const playerClick = (button, buttonIndex) => {
    clickedOrder.push(buttonIndex)
    if(clickedOrder[clickedOrder.length-1] == order[clickedOrder.length-1]) {
        lightUpButtonAndPlayAudio(button)

        if(clickedOrder.length == order.length) {
            score++
            clickedOrder = []
            nextLevel()
        }
    } else {
        gameOver()
    }
}


/* Event Handlers */
startButton.onclick = function() {
    this.innerText = 'REINICIAR'
    playGame()
}

for(let i = 0; i < buttons.length; i++) {
    buttons[i].btn.onclick = () => {
        if(playerTurn) {
            playerClick(buttons[i], i)
        }
    }

}

