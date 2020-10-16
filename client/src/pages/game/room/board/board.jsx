import React from 'react';
import { compose } from 'recompose';

import { withAuth } from '../../../../contexts/auth.jsx';
import { withGame } from '../../../../contexts/game.jsx';
import './board.css';

function Board(props) {
    const { user } = props.auth;
    const { roomId, players, board, turn, socket } = props.game;

    const playMove = (x, y) => {
        // Play the move if it is player's turn, and the board coordinate is empty
        if(players[turn]._id === user._id
            && board[x][y] === 'transparent') {
            socket.emit('playMove', {
                roomId: roomId, 
                x: x, 
                y: y
            });
        }
    }

    const board_cell = (x, y, cell) => (
        <div key={x + ', ' + y} className='cell'>
            <div 
                className={`stone ${cell}`}
                onClick={() => playMove(x, y)}
            >
            </div>
            <div 
                className={
                    `top_left 
                    ${x === 0 && 'no_top'} 
                    ${y === 0 && 'no_left'}`
                }
            >           
            </div>
            <div 
                className={
                    `top_right 
                    ${x === 0 && 'no_top'} 
                    ${y === 18 && 'no_right'}`
                }
            >           
            </div>
            <div 
                className={
                    `bottom_left
                    ${x === 18 && 'no_bottom'} 
                    ${y === 0 && 'no_left'}`
                }
            >           
            </div>
            <div 
                className={
                    `bottom_right 
                    ${x === 18 && 'no_bottom'} 
                    ${y === 18 && 'no_right'}`
                }
            >           
            </div>
        </div>
    );

    return (
        <div className='_board'>
            <div className='board'>
                {board.map((row, x) => (
                    <div className='row' key={x}>
                        {row.map((cell, y) => (
                            board_cell(x, y, cell)
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default compose(withAuth, withGame)(Board);