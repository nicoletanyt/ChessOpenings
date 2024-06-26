import "../App.css";
import Board from "./Board";
import { useEffect, useState } from "react";
import { pieces, API, getFEN, openingAPI } from "../logic";
import OpeningItem from "./OpeningItem";

function Main() {
  const [currentPlayer, setCurrentPlayer] = useState("w"); // white starts
  const [blackTaken, setBlackTaken] = useState([]); // store pieces taken by black
  const [whiteTaken, setWhiteTaken] = useState([]); // store pieces taken by white
  const [RKMoved, setRKMoved] = useState([0, 0, 0, 0]); // white kingside, white queenside, black kingside, black queenside. 0 for not moved, 1 for moved
  const [EPTarget, setEPTarget] = useState("-");
  const [halfMove, setHalfMove] = useState(0);
  const [fullMove, setFullMove] = useState(1);
  const [response, setResponse] = useState(null);
  const [promoPiece, setPromoPiece] = useState(null)
  const [opening, setOpening] = useState([])

  useEffect(() => {
    const label = document.getElementById("player-display");
    if (currentPlayer == "w") label.textContent = "Current Player: White";
    else label.textContent = "Current Player: Black";
  }, [currentPlayer]);

  useEffect(() => {
    const label = document.getElementById("black-taken");
    let displayStr = "Pieces Captured by Black: ";
    for (let i = 0; i < blackTaken.length; ++i) {
      displayStr += pieces[blackTaken[i]];
    }
    label.textContent = displayStr;
  }, [blackTaken]);

  useEffect(() => {
    const label = document.getElementById("white-taken");
    let displayStr = "Pieces Captured by White: ";
    for (let i = 0; i < whiteTaken.length; ++i) {
      displayStr += pieces[whiteTaken[i]];
    }
    label.textContent = displayStr;
  }, [whiteTaken]);

  useEffect(() => {
    if (response) {
      console.log(response);

      if (currentPlayer == "w") {
        const whiteNext = document.getElementById("white-next")
        const opening = document.getElementById("opening")
        
        whiteNext.textContent = "Most common move for white: " + response.moves[0].san
        if (response.opening) {
          opening.textContent = "Opening: " + response.opening.name
        }
      }
      
      // get common openings
      openingAPI(1000, setOpening) // 1000 rating as placeholder
    }
    
  }, [response]);

  function selectPiece(e) {
    setPromoPiece(e.target.getAttribute("pieceid"))
  }

  useEffect(() => {
    opening.slice(0, 10)
  }, [opening])

  return (
    <div id="app">
      <div id="number-label">
        {"87654321".split("").map((num) => (
          <p key={num}>{num}</p>
        ))}
      </div>
      <div>
        <h3 id="black-taken">Pieces Captured by Black: </h3>
        <Board
          currentPlayer={currentPlayer}
          setCurrentPlayer={setCurrentPlayer}
          setBlackTaken={setBlackTaken}
          setWhiteTaken={setWhiteTaken}
          RKMoved={RKMoved}
          setRKMoved={setRKMoved}
          EPTarget={EPTarget}
          setEPTarget={setEPTarget}
          halfMove={halfMove}
          setHalfMove={setHalfMove}
          fullMove={fullMove}
          setFullMove={setFullMove}
          response={response}
          setResponse={setResponse}
          promoPiece={promoPiece}
        />
        <div id="letter-label">
          {"abcdefgh".split("").map((letter) => (
            <p key={letter}>{letter}</p>
          ))}
        </div>
        <h3 id="white-taken">Pieces Captured by White: </h3>
      </div>
      <div id="right-wrapper">
        <h3 id="player-display">Current Player: </h3>
        <button
          onClick={() => {
              API(
                getFEN(
                  document.querySelectorAll(".cell"),
                  currentPlayer,
                  RKMoved,
                  EPTarget,
                  halfMove,
                  fullMove
                ),
                setResponse
              )
          }}
        >
          Run Stockfish
        </button>
        <p id="white-next">Most common move for white: </p>
        <p id="opening">Current Opening: </p>
        <br/>
        <hr/>
        <div>
          <h3>Select an opening (ranked from most common to least): </h3>
          <ol id="opening-rec">
            {
              opening.length == 10 && document.getElementById("opening-rec").childElementCount != 10 ? opening.map((op, index) => (
                <OpeningItem opening={op} key={index}/>
              )) : <></>
            }
          </ol>
        </div>
        <div id="selection-wrapper" style={{visibility:"hidden"}}>
          <h3>Select pawn promotion piece</h3>
          <div id="selection-options">
            <p onClick={(e) => selectPiece(e)} pieceid={currentPlayer == "b" ? "bb" : "wb"}>{currentPlayer == "b" ? pieces["bb"] : pieces["wb"]}</p>
            <p onClick={(e) => selectPiece(e)} pieceid={currentPlayer == "b" ? "br" : "wr"}>{currentPlayer == "b" ? pieces["br"] : pieces["wr"]}</p>
            <p onClick={(e) => selectPiece(e)} pieceid={currentPlayer == "b" ? "bq" : "wq"}>{currentPlayer == "b" ? pieces["bq"] : pieces["wq"]}</p>
            <p onClick={(e) => selectPiece(e)} pieceid={currentPlayer == "b" ? "bn" : "wn"}>{currentPlayer == "b" ? pieces["bn"] : pieces["wn"]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
