document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const GRID_WIDTH = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]

// The tetrominos
  const lTetromino = [
      [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
      [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
      [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
      [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
    ]

  const zTetromino = [
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
  ]

  const tTetromino = [
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
  ]

  const iTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
  ]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

let currentPosition = 4
let currentRotation = 0

//randomly select a Tetromino and its first rotation
let random = Math.floor(Math.random() * theTetrominoes.length)
let current = theTetrominoes[random][currentRotation]

//draw the tetromino
function draw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.add('tetromino')
    squares[currentPosition + index].style.backgroundColor = colors[random]
  })
}

// undrow the tetromino
function undraw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.remove('tetromino')
    squares[currentPosition + index].style.backgroundColor = ''
  })
}

//make the tetromino move down down every second
//timerId = setInterval(moveDown, 1000)

//assign functions to keyCodes
function control(e) {
  if(e.keyCode === 37) {
    moveLeft()
  } else if (e.keyCode === 38) {
    rotate()
  } else if (e.keyCode === 39) {
    moveRight()
  } else if (e.keyCode === 40) {
    moveDown()
  }
}
document.addEventListener('keyup', control)

//move down function
function moveDown() {
  undraw()
  currentPosition += GRID_WIDTH
  draw()
  freeze()
}

function freeze() {
  if(current.some(index => squares[currentPosition + index + GRID_WIDTH].classList.contains('taken'))) {
    current.forEach(index => squares[currentPosition + index].classList.add('taken'))
    //start a new tetromino falling
    random = nextRandom
    nextRandom = Math.floor(Math.random() * theTetrominoes.length)
    current = theTetrominoes[random][currentRotation]
    currentPosition = 4
    draw()
    displayShape()
    addScore()
    gameOver()
  }
}

function moveLeft() {
  undraw()
  const isAtLeftEdge = current.some(index => (currentPosition + index) % GRID_WIDTH === 0)

  if(!isAtLeftEdge) currentPosition -= 1

  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition += 1
  }

  draw()
}

//move tetromino right, unless at the edge or blockage
function moveRight() {
  undraw()
  const isAtRightEdge = current.some(index => (currentPosition + index) % GRID_WIDTH === GRID_WIDTH - 1)

  if(!isAtRightEdge) currentPosition +=1

  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition -=1
  }

  draw()
}

//rotate the tetromino
function rotate() {
  undraw()
  currentRotation++
  if(currentRotation === current.length) {
    currentRotation = 0
  }
  current = theTetrominoes[random][currentRotation]
  draw()
 }

//show up-next termino in mini-grid
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 0

//the Tetrominos without rotations
const upNextTetrominoes = [
  [1, displayWidth+1, displayWidth*2+1, 2], //l
  [0, displayWidth, displayWidth+1, displayWidth*2+1], //z
  [1, displayWidth, displayWidth+1, displayWidth+2], //t
  [0, 1, displayWidth, displayWidth+1], //o
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //i
]

//display the shape in the mini-grid display
function displayShape() {
  //remove any trace of a tetromino from the entire grid
  displaySquares.forEach(square => {
    square.classList.remove('tetromino')
    square.style.backgroundColor = ''
  })
  upNextTetrominoes[nextRandom].forEach(index => {
    displaySquares[displayIndex + index].classList.add('tetromino')
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
  })
}

// add functionality to the button
startBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  } else {
    draw()
    timerId = setInterval(moveDown, 1000)
    nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    displayShape()
  }
})

//add score
function addScore() {
  for (let i = 0; i < 199; i += GRID_WIDTH) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

    if(row.every(index => squares[index].classList.contains('taken'))) {
      score +=10
      scoreDisplay.innerHTML = score
      row.forEach(index => {
        squares[index].classList.remove('taken')
        squares[index].classList.remove('tetromino')
        squares[index].style.backgroundColor = ''
      })
      const squaresRemoved = squares.splice(i, GRID_WIDTH)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => grid.appendChild(cell))
    }
  }
}

//game over
function gameOver() {
  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    scoreDisplay.innerHTML = 'end'
    clearInterval(timerId)
  }
}

})
