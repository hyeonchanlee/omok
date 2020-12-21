// const board = [
//     ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'], 
//     ['black',       'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
//     ['black',       'transparent', 'white',       'transparent', 'transparent', 'transparent', 'transparent'],
//     ['black',       'transparent', 'transparent', 'white',       'white',       'transparent', 'transparent'],
//     ['black',       'transparent', 'transparent', 'transparent', 'white',       'transparent', 'transparent'], 
//     ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'], 
//     ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'], 
// ];

const board = Array(19).fill().map(() => Array(19).fill('transparent'));

const utility_one_direction = (board, player) => {
    let black_utility = 0;
    let white_utility = 0;

    for (let i = 0; i < board.length; i++) {
        let five_spaces = [];

        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 'black') {
                black_utility += Math.min(i, board.length - i);
                black_utility += Math.min(j, board[i].length - j);
            }
            else if (board[i][j] === 'white') {
                white_utility += Math.min(i, board.length - i);
                white_utility += Math.min(j, board[i].length - j);
            }
            five_spaces.push(board[i][j]);
            while (five_spaces.length > 5) {
                five_spaces.shift();
            } 
            if (five_spaces.length === 5) {
                let black_count = 0;
                let white_count = 0;

                five_spaces.forEach(space => {
                    if (space === 'black') black_count++;
                    else if (space === 'white') white_count++;
                });
                if (black_count === 0) white_utility += white_count;
                if (white_count === 0) black_utility += black_count;
                if (black_count === 5) black_utility = 10000;
                if (white_count === 5) white_utility = 10000;

                if (five_spaces[1] === five_spaces[2] && five_spaces[2] === five_spaces[3]) {
                    if (five_spaces[1] === 'black') black_utility += 500;
                    else if (five_spaces[1] === 'white') white_utility += 500;
                }
            }
        }
    }

    return player === 'black' 
        ? black_utility - white_utility 
        : white_utility - black_utility;
}

const utility = (board, player) => {
    const board_t = board[0].map((_, col) => board.map(row => row[col]));

    let board_diag_left = [];
    let board_diag_right = [];

    // Create diagonal boards from the board
    for (let i = 0; i < 2 * board.length - 1; i++) {
        let temp_left = [];
        let temp_right = [];
        for (let y = board.length - 1; y >= 0; y--) {
            const x_left = i - y;
            const x_right = i - (board.length - y);
            if (x_left >= 0 && x_left < board.length) {
                temp_left.push(board[y][x_left]);
            }
            if (x_right >= 0 && x_right < board.length) {
                temp_right.push(board[y][x_right]);
            }
        }
        if (temp_left.length > 0) board_diag_left.push(temp_left);
        if (temp_right.length > 0) board_diag_right.push(temp_right);
    }

    const h_utility = utility_one_direction(board, player);
    const v_utility = utility_one_direction(board_t, player);
    const dl_utility = utility_one_direction(board_diag_left, player);
    const dr_utility = utility_one_direction(board_diag_right, player);

    return h_utility + v_utility + dl_utility + dr_utility;
}

const checkTerminalStateOneDir = (board) => {
    for (let i = 0; i < board.length; i++) {
        let five_spaces = [];

        for (let j = 0; j < board[i].length; j++) {
            five_spaces.push(board[i][j]);
            while (five_spaces.length > 5) {
                five_spaces.shift();
            } 
            if (five_spaces.length === 5) {
                let black_count = 0;
                let white_count = 0;

                five_spaces.forEach(space => {
                    if (space === 'black') black_count++;
                    else if (space === 'white') white_count++;
                });
                if (black_count === 5 || white_count === 5) {
                    console.log('hello');
                    return true;
                }
            }
        }
    }

    return false;
}

const checkTerminalState = (board) => {
    const board_t = board[0].map((_, col) => board.map(row => row[col]));

    let board_diag_left = [];
    let board_diag_right = [];

    // Create diagonal boards from the board
    for (let i = 0; i < 2 * board.length - 1; i++) {
        let temp_left = [];
        let temp_right = [];
        for (let y = board.length - 1; y >= 0; y--) {
            const x_left = i - y;
            const x_right = i - (board.length - y);
            if (x_left >= 0 && x_left < board.length) {
                temp_left.push(board[y][x_left]);
            }
            if (x_right >= 0 && x_right < board.length) {
                temp_right.push(board[y][x_right]);
            }
        }
        if (temp_left.length > 0) board_diag_left.push(temp_left);
        if (temp_right.length > 0) board_diag_right.push(temp_right);
    }

    return checkTerminalStateOneDir(board) 
        || checkTerminalStateOneDir(board_t)
        || checkTerminalStateOneDir(board_diag_left) 
        || checkTerminalStateOneDir(board_diag_right);
}

const minimax = (board, depth, player, maximizing, a, b) => {
    if (depth <= 0 || checkTerminalState(board)) {
        return { 
            move: null, 
            val: utility(board, player)
        };
    }

    let best_move = null;
    let best_val = maximizing 
        ? Number.NEGATIVE_INFINITY 
        : Number.POSITIVE_INFINITY;
    let x, y;

    for ( let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] === 'transparent') {
                let board_new = JSON.parse(JSON.stringify(board));
                board_new[i][j] = player;
                let { val } = minimax(board_new, depth-1, player, !maximizing, a, b);
                if (maximizing && val > best_val) {
                    best_move = board_new;
                    best_val = val;
                    x = i;
                    y = j;
                    if (best_val > a) a = best_val;
                }
                else if (!maximizing && val < best_val) {
                    best_move = board_new;
                    best_val = val;
                    x = i;
                    y = j;
                    if (best_val < b) b = best_val;
                }
                if (b <= a) break;
            }
        }
    }
    return {
        move: best_move, 
        val: best_val, 
        x: x, 
        y: y
    };
}

// const { val, x, y } = minimax(board, 2, 'white', true, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);

// console.log(val, x, y);

console.log(utility(board, 'black'));

export { minimax };