// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, onClick}) {
  const winner = calculateWinner(squares)
  const nextValue = calculateNextValue(squares)

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }
    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    onClick(squaresCopy)
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function createEmptyBoard() {
  return Array(9).fill(null)
}

function Game() {
  const [currentSquares, setSquares] = useLocalStorageState(
    'squares',
    createEmptyBoard(),
  )
  const [moves, setMoves] = useLocalStorageState('tic-tac-toe:history', [
    createEmptyBoard(),
  ])
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'tic-tac-toe:step',
    0,
  )

  function restart() {
    setSquares(createEmptyBoard())
    setMoves([createEmptyBoard()])
    setCurrentStep(0)
  }

  function handleBoardUpdate(squares) {
    setSquares(squares)
    setMoves([...moves.slice(0, currentStep + 1), squares])
    setCurrentStep(currentStep + 1)
  }

  function handleStepChange(step) {
    setSquares(moves[step])
    setCurrentStep(step)
  }

  const status = calculateStatus(
    calculateWinner(currentSquares),
    currentSquares,
    calculateNextValue(currentSquares),
  )

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={handleBoardUpdate} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol>
          {moves.map((_, i) => (
            <li key={i}>
              <button
                disabled={i === currentStep}
                onClick={_ => handleStepChange(i)}
              >
                {i === 0 ? 'go to game start' : `Go to move #${i}`}
                {currentStep === i ? '(current)' : null}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
