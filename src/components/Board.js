import React, { useEffect, useState } from 'react'
import "../App.css"
import { pieces, startingBoard, isLegal, isOccupied, isCheck, isPinned, checkAll, checkWin } from '../logic'

export default function Board({currentPlayer, setCurrentPlayer, setBlackTaken, setWhiteTaken}) {
    // keeps track of the states 
    const [selectedPieces, setSelectedPieces] = useState([]) // sets the [x, y] position of the current selected piece
    const [king, setKing] = useState([[0, 4], [7, 4]]) // b, w
    const [underCheck, setUnderCheck] = useState("") // either "b" or "w" if either one of the kings r in check

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

        if (selectedPieces.length == 1 && board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].getAttribute("pieceId")[0] == currentPlayer){
            board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].classList.add("selected");
        }

        if (selectedPieces.length == 2) {
            const pieceId = board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].getAttribute("pieceId")
            if ((pieceId[0] == currentPlayer)) {
                if (selectedPieces[0] != selectedPieces[1] && isLegal(pieceId, selectedPieces[1], selectedPieces[0]) && isOccupied(selectedPieces[1], selectedPieces[0], currentPlayer, "", board) && isPinned(pieceId, selectedPieces[1], selectedPieces[0], currentPlayer, king)) {
                    let validMove = true
                    if (underCheck == currentPlayer) {
                        let tempKing;
                        // king is still under check, so this move is not valid
                        if ((selectedPieces[0][0] == king[0][0] && selectedPieces[0][1] == king[0][1]) || (selectedPieces[1][0] == king[1][0] && selectedPieces[1][1] == king[1][1])) {
                            // this is the king, so give a temp variable for the king 
                            tempKing = (selectedPieces[0][0] == king[0][0] && selectedPieces[0][1] == king[0][1]) ? [selectedPieces[1], king[1]] : [king[0], selectedPieces[1]]
                        } else {
                            tempKing = king
                        }
                        if (checkAll(pieceId, selectedPieces[1], selectedPieces[0], currentPlayer, tempKing)) {
                            validMove = false
                        }
                        else {
                            if (currentPlayer == "b") board[king[0][0] * 8 + king[0][1]].classList.remove("under-check")
                            else board[king[1][0] * 8 + king[1][1]].classList.remove("under-check")
                            setUnderCheck("")
                        }
                    } else {
                        if (isCheck(pieceId, selectedPieces[1], currentPlayer, king, board)) {
                            if (currentPlayer == "w") board[king[0][0] * 8 + king[0][1]].classList.add("under-check")
                            else board[king[1][0] * 8 + king[1][1]].classList.add("under-check")
                            setUnderCheck(currentPlayer == "w" ? "b" : "w")
                        }
                    }

                    if (validMove) {
                        // check if this move by current player will lead to a discovered check on the opponent 
                        if (checkAll(pieceId, selectedPieces[1], selectedPieces[0], currentPlayer == "w" ? "b" : "w", king)) {
                            if (currentPlayer == "w") board[king[0][0] * 8 + king[0][1]].classList.add("under-check")
                            else board[king[1][0] * 8 + king[1][1]].classList.add("under-check")
                            setUnderCheck(currentPlayer == "w" ? "b" : "w")
                        }
    
                        // move the piece
                        if (board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].getAttribute("pieceId") != "") {
                            // this piece will be taken 
                            if (currentPlayer == "w") setWhiteTaken(whiteTaken => [...whiteTaken, board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].getAttribute("pieceId")])
                            else setBlackTaken(blackTaken => [...blackTaken, board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].getAttribute("pieceId")])
                        }
                        board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].textContent = ""
                        board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].setAttribute("pieceId", "")
    
                        board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].textContent = pieces[pieceId]
                        board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].setAttribute("pieceId", pieceId)
    
                        if (pieceId == "wk") setKing(king => [king[0], selectedPieces[1]])
                        else if (pieceId == "bk") setKing(king => [selectedPieces[1], king[1]])
    
                        if (currentPlayer == "w") setCurrentPlayer("b")
                        else setCurrentPlayer("w")
                    }

                    // check if the opponent can do anything, else game over
                    // if (underCheck == currentPlayer && checkWin(currentPlayer, king, board)) {
                    //     alert("Game Over")
                    //     return
                    // }
                } 
            }
            setSelectedPieces([]) 
            board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].classList.remove("selected")
        } 

    }, [selectedPieces])


  return (
    <div id="board"></div>
  )
}
