import './App.css';
import Board from './components/Board';
import { useEffect, useState } from 'react';
import { pieces, stockfish, getFEN } from './logic';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState("w") // white starts
  const [blackTaken, setBlackTaken] = useState([]) // store pieces taken by black
  const [whiteTaken, setWhiteTaken] = useState([]) // store pieces taken by white
  const [RKMoved, setRKMoved] = useState([0, 0, 0, 0]) // white kingside, white queenside, black kingside, black queenside. 0 for not moved, 1 for moved
  const [EPTarget, setEPTarget] = useState("-")
  const [halfMove, setHalfMove] = useState(0)
  const [fullMove, setFullMove] = useState(1)

  useEffect(() => {
    const label = document.getElementById("player-display")
    if (currentPlayer == "w") label.textContent = "Current Player: White"
    else label.textContent = "Current Player: Black"
  }, [currentPlayer])

  useEffect(() => {
    const label = document.getElementById("black-taken")
    let displayStr = "Pieces Captured by Black: "
    for (let i = 0; i < blackTaken.length; ++i) {
      displayStr += pieces[blackTaken[i]]
    }
    label.textContent = displayStr
  }, [blackTaken])

  useEffect(() => {
    const label = document.getElementById("white-taken")
    let displayStr = "Pieces Captured by White: "
    for (let i = 0; i < whiteTaken.length; ++i) {
      displayStr += pieces[whiteTaken[i]]
    }
    label.textContent = displayStr
  }, [whiteTaken])

  return (
    <div id='App'>
      <Board currentPlayer={currentPlayer} setCurrentPlayer={setCurrentPlayer} setBlackTaken={setBlackTaken} setWhiteTaken={setWhiteTaken} RKMoved={RKMoved} setRKMoved={setRKMoved} EPTarget={EPTarget} setEPTarget={setEPTarget} setHalfMove={setHalfMove} setFullMove={setFullMove}/>
      <div id='right-wrapper'>
        <h3 id='player-display'>Current Player: </h3>
        <h3 id='black-taken'>Pieces Captured by Black: </h3>
        <h3 id='white-taken'>Pieces Captured by White: </h3>
        <button onClick={() => {
          stockfish(getFEN(document.querySelectorAll(".cell"), currentPlayer, RKMoved, EPTarget, halfMove, fullMove))
        }}>Run Stockfish</button>
      </div>
    </div>
  );
}

export default App;
