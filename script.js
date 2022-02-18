const LIGHT_DELAY = 500
const buttons = [
    document.querySelector('#red'),
    document.querySelector('#yellow'),
    document.querySelector('#blue'),
    document.querySelector('#green')
]
const startButton = document.getElementById('start-button')
let score = 0

let clickedOrder = []
let order = []
let playerTurn = false

function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds))
}

const playGame = () => {
    playerTurn = false
    order = []
    clickedOrder = []
    nextLevel()
}

const gameOver = () => {
    alert(`Você perdeu, a sua pontuação foi de: ${score}`)
    startButton.innerText = 'INICIAR'
}

const nextLevel = async() => {
    playerTurn = false
    const nextIndex = Math.floor(Math.random() * buttons.length)
    order.push(nextIndex)
    
    await sleep(2*LIGHT_DELAY)
    for(let i of order) {
        await lightUpButton(buttons[i])
        if(i != order.length-1) {
            await sleep(LIGHT_DELAY/2)
        }
    }
    playerTurn = true
}

const lightUpButton = async(button) => {
    button.classList.add('selected')
    await sleep(LIGHT_DELAY)
    button.classList.remove('selected')
}

const playerClick = (button, buttonIndex) => {
    clickedOrder.push(buttonIndex)
    if(clickedOrder[clickedOrder.length-1] == order[clickedOrder.length-1]) {
        lightUpButton(button)

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
    buttons[i].onclick = () => {
        if(playerTurn) {
            playerClick(buttons[i], i)
        }
    }

}

