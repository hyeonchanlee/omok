import React, { Component } from 'react';


class Board extends Component {

    playTurn = (x, y) => {
        // If it is player's turn to play and the square is empty
        if(this.props.turn && this.props.board[x][y] === 'transparent') {
            const board = this.props.board;
            board[x][y] = this.props.player;

            this.props.socket.emit('playTurn', {
                roomId: this.props.roomId,
                board: board,
                player: this.props.player,
                x: x,
                y: y
            });
        }
    }

    passTurn = () => {
        this.props.socket.emit('playTurn', {
            roomId: this.props.roomId,
            board: this.props.board,
            player: this.props.player,
            x: null,
            y: null
        });
    }

    resign = () => {
        this.props.socket.emit('resign', {
            user: this.props.user
        });
        // Let opponent know that player resigned
        this.props.socket.emit('sendMessage', {
            roomId: this.props.roomId,
            user: null,
            message: '-----' + this.props.user.name + ' has resigned'
        });
    }

    componentDidMount() {
        // console.log('board-mount');
    }

    render() {
        // console.log('board');

        // Get the board information from the state
        const board = this.props.board.map((row, i) => {
            return (
                <tr key={'row_' + i}>
                    {row.map((col, j) => {
                        return ( 
                            <td key={i + '_' + j} style={{ backgroundColor: 'transparent', border: '1px solid black' }} onClick={() => this.playTurn(i, j)}>
                                <div className='h-100 rounded-circle' style={{ backgroundColor: this.props.board[i][j] }}></div>
                            </td>
                        );
                    })}
                </tr>
            );
        });

        return (
            this.props.turn === null ? (
                this.props.gameWon === null ? (
                    <div className='position-relative w-100' style={{ paddingTop: '125%' }}>
                        <div className='position-absolute w-100 h-100 fixed-top'>
                            <div className='row align-items-center h-100'>
                                <div className='col text-center'>
                                    <div className='spinner-border mb-2' role='status'></div>
                                    <p>Waiting for an opponent to join...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='position-relative w-100' style={{ paddingTop: '125%' }}>
                        <div className='position-absolute w-100 h-100 fixed-top'>
                            <div className='row align-items-center h-100'>
                                <div className='col text-center'>
                                    {this.props.gameWon ? 
                                        <p>You Win!!</p>
                                    :
                                        <p>You Lose...</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div> 
                )
            ) : (
                <div className='position-relative w-100' style={{ paddingTop: '125%' }}>
                    <div className='position-absolute w-100 fixed-top' style={{ height: '80%', backgroundColor: '#e4e4a1' }}> 
                        <table style={{ width: '90%', height: '90%', marginLeft: '5%', marginTop: '5%' }}>
                            <tbody>
                                {board}
                            </tbody>
                        </table>
                    </div>
                    <div className='position-absolute w-100 fixed-bottom' style={{ height: '20%' }}>
                        {this.props.turn ? (
                            <div className='row align-items-center h-100'>
                                <div className='col mx-auto'>
                                    <button className='btn btn-secondary w-100 mb-2' onClick={this.passTurn}>Pass</button>
                                    <button className='btn btn-secondary w-100' onClick={this.resign}>Resign</button>
                                </div>
                            </div>
                        ) : (
                            <div className='d-flex align-items-center h-100'>
                                <p>Waiting for opponent to play...</p>
                                <div className='spinner-border spinner-border-sm ml-auto' role='status' aria-hidden='true'></div>
                            </div>
                        )}
                    </div>
                </div>
            )
        );
    }
}

export default Board;