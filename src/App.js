import './App.css';
import Board from './components/Board';
import { useEffect, useState } from 'react';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState("w") // white starts

  useEffect(() => {
    const label = document.getElementById("player-display")
    if (currentPlayer == "w") label.textContent = "Current Player: White"
    else label.textContent = "Current Player: Black"
  }, [currentPlayer])

  return (
    <div id='App'>
      <Board currentPlayer={currentPlayer} setCurrentPlayer={setCurrentPlayer}/>
      <div id='right-wrapper'>
        <h3 id='player-display'>Current Player: </h3>
      </div>
    </div>
  );
}

export default App;
