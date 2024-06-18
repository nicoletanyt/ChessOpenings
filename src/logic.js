// unicode of the pieces & starting board
export const pieces = {
    "wk": "\u2654",
    "wq": "\u2655",
    "wr": "\u2656",
    "wb": "\u2657",
    "wn": "\u2658",
    "wp": "\u2659",
    "bk": "\u265A",
    "bq": "\u265B",
    "br": "\u265C",
    "bb": "\u265D",
    "bn": "\u265E",
    "bp": "\u265F",
}
export const startingBoard = [
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
]
function deepClone(array) {
    return Array.from(array).map(element => element.cloneNode(true))
}

export function isLegal(pieceId, currentPos, previousPos) {
    // for the checking of some pieces
    let displace_x = Math.abs(currentPos[1] - previousPos[1]) 
    let displace_y = Math.abs(currentPos[0] - previousPos[0]) 
    const board = document.querySelectorAll(".cell")
    const secondPieceId = board[currentPos[0] * 8 + currentPos[1]].getAttribute("pieceId")

    switch(pieceId) {
        case "wk":
            return (displace_x <= 1 && displace_y <= 1) || (secondPieceId == "wr")
        case "wq":
            return (displace_x == 0 && displace_y > 0 || displace_y == 0 & displace_x > 0 || displace_x == displace_y) 
        case "wr":
            return (displace_x == 0 && displace_y > 0 || displace_y == 0 & displace_x > 0) 
        case "wb":
            return (displace_x == displace_y) 
        case "wn":
            return (displace_x == 1 && displace_y == 2 || displace_x == 2 && displace_y == 1) 
        case "wp":
            if (startingBoard[previousPos[0]][previousPos[1]] == "wp") {
                // pawn has not moved, can either move up one or two squares
                if (currentPos[0] < previousPos[0] && previousPos[0] - currentPos[0] <= 2) return true
            } else if (previousPos[0] - currentPos[0] == 1) return true
            return false
        case "bk":
            return (displace_x <= 1 && displace_y <= 1) || (secondPieceId == "br")
        case "bq":
            return (displace_x == 0 && displace_y > 0 || displace_y == 0 & displace_x > 0 || displace_x == displace_y) 
        case "br":
            return (displace_x == 0 && displace_y > 0 || displace_y == 0 & displace_x > 0) 
        case "bb":
            return (displace_x == displace_y) 
        case "bn":
            return (displace_x == 1 && displace_y == 2 || displace_x == 2 && displace_y == 1) 
        case "bp":
            if (startingBoard[previousPos[0]][previousPos[1]] == "bp") {
                // pawn has not moved, can either move down one or two squares
                if (currentPos[0] > previousPos[0] && currentPos[0] - previousPos[0] <= 2) return true
            } else if (currentPos[0] - previousPos[0] == 1) return true
            return false

    }
}

export function isOccupied(currentPos, previousPos, currentPlayer, prevPieceId, board, RKMoved) {
    // const board = document.querySelectorAll(".cell")
    const pieceId = board[currentPos[0] * 8 + currentPos[1]].getAttribute("pieceId")
    let obstruction = false
    let displacement = [currentPos[0] - previousPos[0], currentPos[1] - previousPos[1]]

    let previousPiece
    if (prevPieceId == undefined || prevPieceId.length == 0) previousPiece = board[previousPos[0] * 8 + previousPos[1]].getAttribute("pieceId")[1]
    else previousPiece = prevPieceId[1]
    if (previousPiece == "q") {
        // the queen is moving like a rook 
        if (displacement[0] == 0 || displacement[1] == 0) previousPiece = "r"
        else previousPiece = "b"
    }

    switch(previousPiece) {
        case "r":
            if (displacement[0] == 0) {
                // rook is moving horizontally 
                for (let i = Math.min(currentPos[1], previousPos[1]) + 1; i < Math.max(currentPos[1], previousPos[1]); ++i) {
                    // there is a piece obstructing. (colour doesn't matter)
                    if (board[currentPos[0] * 8 + i].getAttribute("pieceId") != "") obstruction = true
                }
            } else {
                // rook is moving vertically 
                for (let i = Math.min(currentPos[0], previousPos[0]) + 1; i < Math.max(currentPos[0], previousPos[0]); ++i) {
                    // there is a piece obstructing. (colour doesn't matter)
                    if (board[i * 8 + currentPos[1]].getAttribute("pieceId") != "") obstruction = true
                }
            }
            break
        case "b":
            // get direction of displacement in the 4 directions of a bishop e.g. [-1, 1], [1, -1]
            let direction = [displacement[0] / Math.abs(displacement[0]), displacement[1] / Math.abs(displacement[1])]
            for (let i = 1; i < Math.abs(displacement[0]); ++i) {
                if (board[(direction[0] * i + previousPos[0]) * 8 + (direction[1] * i + previousPos[1])].getAttribute("pieceId") != "") obstruction = true
            }
            break
        case "p":
            for (let i = Math.min(currentPos[0], previousPos[0]) + 1; i < Math.max(currentPos[0], previousPos[0]); ++i) {
                if (board[i * 8 + currentPos[1]].getAttribute("pieceId") != "") obstruction = true
            }
            // pawn cannot take forwards
            if (displacement[1] == 0) {
                if (pieceId != "") obstruction = true 
            } 
            if (displacement[0] != 0 && displacement[1] != 0) {
                // diagonal, so can take. obstruction if there is no piece at the diagonal square. unless en passant
                if (pieceId == "") obstruction = true
            }
            break
        case "k":
            if (pieceId[1] == "r") {
                let castle;
                if (currentPos[0] == 0 && currentPos[1] == 0) {
                    castle = "q"
                } else if (currentPos[0] == 0 && currentPos[1] == 7) {
                    castle = "k"
                } else if (currentPos[0] == 7 && currentPos[1] == 0) {
                    castle = "Q"
                } else if (currentPos[0] == 7 && currentPos[1] == 7) {
                    castle = "K"
                }
                // can castle
                if (castlingAbility(RKMoved).includes(castle)) return true
            }
            break

    }

    // should return true if nothing is obstructing
    return ((pieceId == "" || pieceId[0] != currentPlayer) && !obstruction)
}

export function isCheck(pieceId, currentPos, currentPlayer, king, board) {
    let kingPos = currentPlayer == "w" ? king[0] : king[1];

    // check if this current move results in a check
    if (isLegal(pieceId, kingPos, currentPos) && isOccupied(kingPos, currentPos, currentPlayer, pieceId, board)) {
        console.log("Check")
        return true
    }

    return false
}

export function isPinned(pieceId, currentPos, previousPos, currentPlayer, king) {
    let opponentPieces = currentPlayer == "w" ? ["br", "bq", "bb"] : ["wr", "wq", "wb"]

    // make a copy of the board where the piece has moved
    const board = document.querySelectorAll(".cell")
    let boardCopy = deepClone(board)
    boardCopy[previousPos[0] * 8 + previousPos[1]].setAttribute("pieceId", "")
    boardCopy[currentPos[0] * 8 + currentPos[1]].setAttribute("pieceId", pieceId)
    
    // check if in this scenario (where the current piece has moved) will result in a check for all possible opponent pieces
    for (let i = 0; i < boardCopy.length; ++i) {
        if (opponentPieces.includes(boardCopy[i].getAttribute("pieceId"))) {
            if (isCheck(boardCopy[i].getAttribute("pieceId"), [Math.floor(i/8), i%8], currentPlayer == "w" ? "b" : "w", king, boardCopy)) {
                console.log("Will result in a check => is pinned")
                return false
            }
        }
    }
    return true
} 

export function checkAll(pieceId, currentPos, previousPos, currentPlayer, king) {
    const board = document.querySelectorAll(".cell")
    let opponent = currentPlayer == "w" ? "b" : "w";

    let boardCopy = deepClone(board)
    boardCopy[previousPos[0] * 8 + previousPos[1]].setAttribute("pieceId", "")
    boardCopy[currentPos[0] * 8 + currentPos[1]].setAttribute("pieceId", pieceId)

    for (let i = 0; i < boardCopy.length; ++i) {
        if (boardCopy[i].getAttribute("pieceId")[0] == opponent) {
            // can be captured
            if (isCheck(boardCopy[i].getAttribute("pieceId"), [Math.floor(i/8), i%8], opponent, king, boardCopy)) {
                console.log("There is still an ongoing check.")
                return true
            }
        }
    }
    return false
}

export function checkWin(currentPlayer, king) {
    let kingPos = currentPlayer == "w" ? king[0] : king[1];

    const board = document.querySelectorAll(".cell")

    // check all moves that the king can make
    const kingMoves = [[0, 1], [0, -1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1]]
    for (let i = 0; i < kingMoves.length; ++i) {
        let currentPos = [kingPos[0] + kingMoves[i][0], kingPos[1] + kingMoves[i][1]]
        // checking if position is in bounds
        if (currentPos[0] >= 0 && currentPos[0] < 8 && currentPos[1] >= 0 && currentPos[1] < 8) {
            // there is a move where the king isn't checked
            if (!checkAll(currentPlayer + "k", currentPos, kingPos, currentPlayer, king)) return false
        }
    }  

    // check if any other piece can block the check 


    // check if any piece can take the piece that is checking

    return true 
}

function castlingAbility(RKMoved) {
    let starting = "KQkq" // starting position
    let rtn = ""
    for (let i = 0; i < RKMoved.length; ++i) {
        if (RKMoved[i] == 0) rtn += starting[i]
    }
    return rtn
}

export function getFEN(board, currentPlayer, RKMoved, EPTarget, halfMove, fullMove) {
    let fen = "", spaceCounter = 0, pieceId = ""

    for (let i = 0; i < board.length; ++i) {
        pieceId = board[i].getAttribute("pieceId")
        if (pieceId == "") spaceCounter++
        else {
            if (spaceCounter != 0) {
                fen += spaceCounter.toString()
                spaceCounter = 0
            } 
            if (pieceId[0] == "b") fen += pieceId[1]
            else fen += pieceId[1].toUpperCase()
        }
        if (i % 8 == 7 && i != 63) {
            if (spaceCounter != 0) {
                fen += spaceCounter.toString()
                spaceCounter = 0
            } 
            fen += "/"   
        }
    }

    fen += " " + currentPlayer
    fen += " " + castlingAbility(RKMoved)
    fen += " " + EPTarget
    fen += " " + halfMove.toString()
    fen += " " + fullMove.toString()

    return fen
}


export async function API(FEN, setResponse) {
    console.log(FEN)
    let endpoint = "https://explorer.lichess.ovh/lichess" + "?fen=" + FEN + "&ratings=1000"
    // "https://lichess.org/api/cloud-eval" + "?fen=" + FEN 
    // "https://stockfish.online/api/s/v2.php" + "?fen=" + FEN + "&depth=15"
    fetch(endpoint)
    .then((response) => response.json()) 
    .then((data) => {
        setResponse(data); 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}