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

const movements = {
    "wk": [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, 1), (-1, 1), (1, -1)],
    "wq": [],
    "wr": [],
    "wb": [],
    "wn": [],
    "wp": [],
    "bk": [],
    "bq": [],
    "br": [],
    "bb": [],
    "bn": [],
    "bp": [],
}

export function isLegal(pieceId, currentPos, previousPos) {
    // for the checking of some pieces
    let displace_x = Math.abs(currentPos[1] - previousPos[1]) 
    let displace_y = Math.abs(currentPos[0] - previousPos[0]) 

    switch(pieceId) {
        case "wk":
            return (displace_x <= 1 && displace_y <= 1) 
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
            return (displace_x <= 1 && displace_y <= 1) 
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

export function isOccupied(currentPos, previousPos, currentPlayer) {
    const board = document.querySelectorAll(".cell")
    const pieceId = board[currentPos[0] * 8 + currentPos[1]].getAttribute("pieceId")
    let obstruction = false
    let displacement = [currentPos[0] - previousPos[0], currentPos[1] - previousPos[1]]

    let previousPiece = board[previousPos[0] * 8 + previousPos[1]].getAttribute("pieceId")[1]
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
        case "b":
            // get direction of displacement in the 4 directions of a bishop e.g. [-1, 1], [1, -1]
            let direction = [displacement[0] / Math.abs(displacement[0]), displacement[1] / Math.abs(displacement[1])]
            for (let i = 1; i < Math.abs(displacement[0]); ++i) {
                if (board[(direction[0] * i + previousPos[0]) * 8 + (direction[1] * i + previousPos[1])].getAttribute("pieceId") != "") obstruction = true
            }
        case "p":
            for (let i = Math.min(currentPos[0], previousPos[0]) + 1; i < Math.max(currentPos[0], previousPos[0]); ++i) {
                if (board[i * 8 + currentPos[1]].getAttribute("pieceId") != "") obstruction = true
            }
            // pawn cannot take forwards
            if (displacement[1] == 0) {
                if (pieceId != "") obstruction = true 
            } 
            if (displacement[0] != 0 && displacement[1] != 0) {
                // diagonal, so can take. obstruction if there is no piece at the diagonal square
                if (pieceId == "") obstruction = true
            }
    }
    
    return ((pieceId == "" || pieceId[0] != currentPlayer) && !obstruction)
}

export function isCheck(pieceId, currentPos, currentPlayer, king) {
    // check if the new move can capture the king next
    let kingPos;
    if (currentPlayer == "w") kingPos = king[1]
    else kingPos = king[0]

    // TODO: DOES NOT WORK YET

    if (isLegal(pieceId, kingPos, currentPos)) {
        console.log("Check")
    }
    return true
}