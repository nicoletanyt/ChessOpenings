import React, { useEffect, useState } from 'react'
import "../App.css"
import { pieces, startingBoard, isLegal, isOccupied, isCheck, isPinned, checkAll, API, getFEN, parsePos } from '../logic'

export default function Board({currentPlayer, setCurrentPlayer, setBlackTaken, setWhiteTaken, RKMoved, setRKMoved, EPTarget, setEPTarget, halfMove, setHalfMove, fullMove, setFullMove, response, setResponse, promoPiece}) {
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
                cell.setAttribute("pieceid", pieceId)
                cell.addEventListener("click", () => movePiece([Math.floor(i/8), i % 8]))
                // style chessboard pattern
                if (Math.floor(i/8) % 2 == 0 && i % 2 == 1 || Math.floor(i/8) % 2 == 1 && i % 2 == 0) {
                    cell.style.backgroundColor = "lightgray"
                }
                board.appendChild(cell)
            }
        }

    }, [])

    useEffect(() => {
        API(getFEN(document.querySelectorAll(".cell"),currentPlayer,RKMoved,EPTarget,halfMove,fullMove), setResponse)
    }, [currentPlayer])

    useEffect(() => {
        if (response && currentPlayer == "b") {
            console.log(response)
            // move 
            if (response.moves.length > 0) setSelectedPieces(parsePos(response.moves[0].uci))
          }
    }, [response])

    useEffect(() => {
        const board = document.querySelectorAll(".cell")
        if (promoPiece) {
            let secondPieceId = board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].getAttribute("pieceid")
            // take piece
            if (secondPieceId != "") {
                // this piece will be taken
                if (currentPlayer == "w") setWhiteTaken(whiteTaken => [...whiteTaken, secondPieceId])
                else setBlackTaken(blackTaken => [...blackTaken, secondPieceId])
            } 
            setHalfMove(0)

            // set current player
            if (currentPlayer == "w") setCurrentPlayer("b")
            else {
                setCurrentPlayer("w")
                setFullMove(fullMove => (fullMove + 1))
            }

            board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].textContent = ""
            board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].setAttribute("pieceid", "") 
    
            board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].textContent = pieces[promoPiece]
            board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].setAttribute("pieceid", promoPiece)
    
            document.getElementById("selection-wrapper").style.visibility = "hidden"
            setSelectedPieces([]) 
            board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].classList.remove("selected")
        }
    }, [promoPiece])

    // check move
    useEffect(() => {
        const board = document.querySelectorAll(".cell")

        if (selectedPieces.length == 1 && board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].getAttribute("pieceid")[0] == currentPlayer){
            board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].classList.add("selected");
        }

        if (selectedPieces.length == 2) {
            const pieceId = board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].getAttribute("pieceid")
            const secondPieceId = board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].getAttribute("pieceid")
            if ((pieceId[0] == currentPlayer)) {
                if (selectedPieces[0] != selectedPieces[1] && isLegal(pieceId, selectedPieces[1], selectedPieces[0]) && isOccupied(selectedPieces[1], selectedPieces[0], currentPlayer, "", board, RKMoved) && isPinned(pieceId, selectedPieces[1], selectedPieces[0], currentPlayer, king)) {
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

                        switch(pieceId) {
                            case "wk":
                                if (RKMoved[0] == 0 || RKMoved[1] == 0) setRKMoved(RKMoved => [1, 1, RKMoved[2], RKMoved[3]])
                                break
                            case "wr":
                                // queenside 
                                if (selectedPieces[0][0] == 0 && RKMoved[1] == 0) setRKMoved(RKMoved => [RKMoved[0], 1, RKMoved[2], RKMoved[3]])
                                // kingside
                                else if (selectedPieces[0][0] == 7 && RKMoved[0] == 0) setRKMoved(RKMoved => [1, RKMoved[1], RKMoved[2], RKMoved[3]])
                                break
                            case "bk":
                                if (RKMoved[2] == 0 || RKMoved[3] == 0) setRKMoved(RKMoved => [RKMoved[0], RKMoved[1], 1, 1])
                                break
                            case "br":
                                // queenside 
                                if (selectedPieces[0][0] == 0 && RKMoved[1] == 0) setRKMoved(RKMoved => [RKMoved[0], RKMoved[1], RKMoved[2], 1])
                                // kingside
                                else if (selectedPieces[0][0] == 7 && RKMoved[0] == 0) setRKMoved(RKMoved => [RKMoved[0], RKMoved[1], 1, RKMoved[3]])
                                break
                        }

                        if (EPTarget) setEPTarget("-") 
                        if (pieceId[1] == "p") {
                            if (Math.abs(selectedPieces[1][0] - selectedPieces[0][0]) == 2) {
                                // set en passant target
                                if (pieceId[0] == "wp") {
                                    setEPTarget(String.fromCharCode(97 + selectedPieces[1][0]) + "6")
                                } else {
                                    setEPTarget(String.fromCharCode(97 + selectedPieces[1][0]) + "3")
                                }
                            }

                            if (selectedPieces[1][0] == 0 || selectedPieces[1][0] == 7) {
                                // pawn promotion 
                                console.log("pawn promotion")
                                document.getElementById("selection-wrapper").style.visibility = "visible"
                                return;
                            }
                        }

                        // castle & move the piece
                        if (secondPieceId[1] == "r" && pieceId[1] == "k") {
                            // castle queenside
                            if (selectedPieces[1][1] == 0) {
                                board[selectedPieces[0][0] * 8 + 2].textContent = pieces[pieceId] // king 
                                board[selectedPieces[0][0] * 8 + 2].setAttribute("pieceid", pieceId) 
                                // rook
                                board[selectedPieces[1][0] * 8 + 3].textContent = pieces[secondPieceId]
                                board[selectedPieces[1][0] * 8 + 3].setAttribute("pieceid", secondPieceId)
                            } else {
                                // castle kingside 
                                board[selectedPieces[0][0] * 8 + 6].textContent = pieces[pieceId]
                                board[selectedPieces[0][0] * 8 + 6].setAttribute("pieceid", pieceId)

                                board[selectedPieces[1][0] * 8 + 5].textContent = pieces[secondPieceId]
                                board[selectedPieces[1][0] * 8 + 5].setAttribute("pieceid", secondPieceId)
                            }
                            // remove king 
                            board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].textContent = ""
                            board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].setAttribute("pieceid", "")

                            // remove rook 
                            board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].textContent = ""
                            board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].setAttribute("pieceid", "")
                        } else {
                            board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].textContent = ""
                            board[selectedPieces[0][0] * 8 + selectedPieces[0][1]].setAttribute("pieceid", "")
        
                            board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].textContent = pieces[pieceId]
                            board[selectedPieces[1][0] * 8 + selectedPieces[1][1]].setAttribute("pieceid", pieceId)
                        }

                        if (secondPieceId != "") {
                            // this piece will be taken if it was not a castle
                            if (!(secondPieceId[1] == "r" && pieceId[1] == "k")) {
                                if (currentPlayer == "w") setWhiteTaken(whiteTaken => [...whiteTaken, secondPieceId])
                                else setBlackTaken(blackTaken => [...blackTaken, secondPieceId])
                                setHalfMove(0)
                            }
                        } else {
                            if (pieceId[1] != "p") {
                                setHalfMove(halfMove => (halfMove + 1))
                            } else {
                                setHalfMove(0)
                            }
                        }

                        if (pieceId == "wk") setKing(king => [king[0], selectedPieces[1]])
                        else if (pieceId == "bk") setKing(king => [selectedPieces[1], king[1]])
    
                        if (currentPlayer == "w") setCurrentPlayer("b")
                        else {
                            setCurrentPlayer("w")
                            setFullMove(fullMove => (fullMove + 1))
                        }
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
