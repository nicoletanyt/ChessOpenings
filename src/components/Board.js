import React, { useEffect, useState } from 'react'
import "../App.css"
import { pieces, startingBoard, isLegal } from '../logic'

export default function Board() {
    // keeps track of the states 
    const [selectedPieces, setSelectedPieces] = useState([]) // sets the [x, y] position of the current selected piece
    const [currentPlayer, setCurrentPlayer] = useState("w") // white starts
    
    function movePiece(pos) {
        if (selectedPieces.length < 2) setSelectedPieces(selectedPieces => ([...selectedPieces, pos]))
    }

    // load board
    useEffect(() => {
        const board = document.getElementById("board")
        if (board.childElementCount == 0) {
            for (let i = 0; i < 64; ++i) {
                let cell = document.createElement("div")
                cell.classList.add("cell")
                let pieceId = startingBoard[Math.floor(i / 8)][i % 8]
                cell.textContent = pieces[pieceId]
                cell.setAttribute("pieceId", pieceId)
                cell.addEventListener("click", () => movePiece([Math.floor(i/8), i % 8]))
                // style chessboard pattern
                if (Math.floor(i/8) % 2 == 0 && i % 2 == 1 || Math.floor(i/8) % 2 == 1 && i % 2 == 0) {
                    cell.style.backgroundColor = "lightgray"
                }
                board.appendChild(cell)
            }
        }

    }, [])

    // check move
    useEffect(() => {
        const board = document.querySelectorAll(".cell")

        if (selectedPieces.length == 1){
            board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].classList.add("selected");
        }

        if (selectedPieces.length == 2) {
            const pieceId = board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].getAttribute("pieceId")
            if ((pieceId[0] == currentPlayer)) {
                // check for legal move
                if (selectedPieces[0] != selectedPieces[1] && isLegal(pieceId, selectedPieces[1], selectedPieces[0])) {
                    // move the piece
                    board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].textContent = ""
                    board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].setAttribute("pieceId", "")

                    board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].textContent = pieces[pieceId]
                    board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].setAttribute("pieceId", pieceId)
                    // board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].classList.remove("selected")
                } else {
                    
                }
            }
            setSelectedPieces(selectedPieces => []) 
            board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].classList.remove("selected")
        } 

    }, [selectedPieces])

  return (
    <div id="board"></div>
  )
}
