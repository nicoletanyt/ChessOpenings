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
    const board = document.querySelectorAll(".cell")
    switch(pieceId) {
        case "wk":
        case "wq":
        case "wr":
            // NEEDS TO BE EDITED
            let diff = (currentPos[0] - previousPos[0], currentPos[1] - previousPos[1])
            if (diff[0] != 0 && diff[1] != [0]) return false
            if (diff[0] == 0) {
                // move along columns
                let start = Math.min(previousPos[1], currentPos[1])
                let end = Math.max(previousPos[1], currentPos[1])
                for (let i = start; i < end; ++i) {
                    // obstruction 
                    if (board[currentPos[0] * 8 + i] != "") return false
                }
                return true
            } else {
                let start = Math.min(previousPos[0], currentPos[0])
                let end = Math.max(previousPos[0], currentPos[0])

                for (let i = start; i < end; ++i) {
                    // obstruction 
                    if (board[i * 8 + currentPos[0]] != "") return false
                }
                return true
            }
        case "wb":
        case "wn":
        case "wp":
            if (startingBoard[previousPos[0]][previousPos[1]] == "wp") {
                // pawn has not moved, can either move up one or two squares
                if (currentPos[0] < previousPos[0] && previousPos[0] - currentPos[0] <= 2) return true
            } else if (previousPos[0] - currentPos[0] == 1) return true
            return false
        case "bk":
        case "bq":
        case "br":
        case "bb":
        case "bn":
        case "bp":

    }
}