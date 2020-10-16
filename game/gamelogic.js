const checkWinCondition = (board, turn, x, y) => {
    const player = turn === 0 ? 'black' : 'white';

    // Check horizontally
    let sum_x = 0;
    for(let i = -4; i <= 4; i++) {
        if(board[x + i] && board[x + i][y] && board[x + i][y] === player) {
            sum_x++;
            if(sum_x >= 5) return true;
        }
        else {
            sum_x = 0;
        }
    }

    // Check vertically
    let sum_y = 0;
    for(let j = -4; j <= 4; j++) {
        if(board[x] && board[x][y + j] && board[x][y + j] === player) {
            sum_y++;
            if(sum_y >= 5) return true;
        }
        else {
            sum_y = 0;
        }
    }

    // Check diagnoally
    let sum_d1 = 0, sum_d2 = 0;
    for(let k = -4; k <= 4; k++) {
        if(board[x + k] && board[x + k][y + k] && board[x + k][y + k] === player) {
            sum_d1++;
            if(sum_d1 >= 5) return true;
        }
        else {
            sum_d1 = 0;
        }

        if(board[x - k] && board[x - k][y + k] && board[x - k][y + k] === player) {
            sum_d2++;
            if(sum_d2 >= 5) return true;
        }
        else {
            sum_d2 = 0;
        }
    }

    return false;
}

export { checkWinCondition };