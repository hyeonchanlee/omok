import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';

import Lobby from './lobby';
import Room from './room';


class Game extends Component {
    constructor(props) {
        super(props);

        // Connect to socket.io
        this.endpoint = 'http://localhost:5000';
        this.socket = io.connect(this.endpoint);

        // Initialize timer for the game
        this.timer = null;

        this.state = {
            rooms: [],
            roomId: null,
            player: null,
            opponent: null,
            turn: null,
            board: Array(19).fill().map(x => Array(19).fill('transparent')),
            chat: [],
            myTime: 300, // 5 minute timer for myself
            oppTime: 300, // 5 minute timer for opponent
            gameWon: null
        };

        // Save initial state for leaving game
        this.baseState = this.state;
    }

    // Count down a second for the player of turn, and check for time running out
    tick = () => {
        this.state.turn ?
            this.setState(prevState => ({ myTime: prevState.myTime - 1 }))
        :
            this.setState(prevState => ({ oppTime: prevState.oppTime - 1 }));

        if(this.state.mytime <= 0) {
            this.socket.emit('resign', {
                user: this.props.user
            });
            this.props.socket.emit('sendMessage', {
                roomId: this.props.roomId,
                user: null,
                message: '-----' + this.props.user.name + ' loses on time'
            });
        }
    }

    // Start the game timer
    startTimer = () => {
        this.timer = setInterval(this.tick, 1000);
    }

    // Stop the game timer
    stopTimer = () => {
        clearInterval(this.timer);
    }

    // Check win conditions for the current board
    checkWinConditions = (player, x, y) => {
        const b = this.state.board;

        // Check horizontally
        let sum_x = 0;
        for (let i = -4; i <= 4; i++) {
            if(b[x+i] && b[x+i][y] && b[x+i][y] === player) { sum_x++; }
            else { sum_x = 0; }
            if(sum_x >= 5) {
                this.stopTimer();
                this.setState({
                    turn: null,
                    gameWon: (player === this.state.player)
                });
            }
        }

        // Check vertically
        let sum_y = 0;
        for (let j = -4; j <= 4; j++) {
            if(b[x] && b[x][y+j] && b[x][y+j] === player) { sum_y++; }
            else { sum_y = 0; }
            if(sum_y >= 5) {
                this.stopTimer();
                this.setState({
                    turn: null,
                    gameWon: (player === this.state.player)
                });
            }
        } 

        // Check diagonally
        let sum_dr = 0, sum_dl = 0;
        for (let k = -4; k <= 4; k++) {
            if(b[x+k] && b[x+k][y+k] && b[x+k][y+k] === player) { sum_dr++; }
            else { sum_dr = 0; }
            if(b[x-k] && b[x-k][y+k] && b[x-k][y+k] === player) { sum_dl++; }
            else { sum_dl = 0; }
            if(sum_dr >= 5) {
                this.stopTimer();
                this.setState({ 
                    turn: null,
                    gameWon: (player === this.state.player) 
                });
            }
            if(sum_dl >= 5) {
                this.stopTimer();
                this.setState({ 
                    turn: null,
                    gameWon: (player === this.state.player) 
                });
            }
        }
    }

    // Socket.IO event handler
    handleSocketEvents = () => {
        // Receive list of all open rooms
        this.socket.on('roomsList', ({ rooms }) => {
            this.setState({ rooms: rooms });
        });

        // Player created room
        this.socket.on('createdRoom', ({ roomId, user }) => {
            this.socket.emit('sendMessage', {
                roomId: roomId,
                user: null,
                message: '-----' + user.name + ' has joined the room'
            });

            // Creator of a room becomes player black
            this.setState({ 
                roomId: roomId,
                player: 'black'
            });
        });
        
        // Player joined room
        this.socket.on('joinedRoom', ({ roomId, user }) => {
            // If a player successfully joined room
            if(roomId) {
                // If you're the player who joined the room
                if(user._id === this.props.user._id) {
                    this.socket.emit('sendMessage', {
                        roomId: roomId,
                        user: null,
                        message: '-----' + user.name + ' has joined the room'
                    });
                    // Player who joins a room becomes player white
                    this.setState({ 
                        roomId: roomId,
                        player: 'white'
                    });
                }
                // Send your user information to your opponent to start game
                this.socket.emit('gameStart', { user: this.props.user });
            }
        });

        // Start the game once player has joined the room
        this.socket.on('gameStart', ({ user }) => {
            // Player black plays first
            this.setState({
                opponent: user,
                turn: (this.state.player === 'black')
            });
            // Start the game timer
            this.startTimer();
        });

        // Player played turn
        this.socket.on('playedTurn', ({ board, player, x, y }) => {
            // Update board information
            this.setState({ board: board });
            // Check win conditions for each player
            this.checkWinConditions(player, x, y);
            // Change turn if game still goes on
            if(this.state.gameWon === null) {
                this.setState(prevState => ({ turn: !prevState.turn }));
            }
        });

        // Player resigned game
        this.socket.on('resigned', ({ user }) => {
            this.stopTimer();
            this.setState({ 
                turn: null,
                gameWon: (user._id !== this.props.user._id)
            });
        });

        // Update chat box with new message
        this.socket.on('receiveMessage', ({ roomId, user, message }) => {
            this.setState(prevState => ({
                chat: [...prevState.chat, { 
                    user: user,
                    message: message 
                }]
            }));
        });

        // Player left the room
        this.socket.on('leftRoom', ({ roomId, user }) => {
            // If player left the room, reset state and redirect to lobby
            if(user._id === this.props.user._id) {
                this.setState(this.baseState);
                this.props.history.replace('/game');
            }
            // Opponent left, if game wasn't over, player wins the game
            else {
                this.setState(prevState => ({
                    opponent: null,
                    turn: null,
                    gameWon: prevState.gameWon === null ? true : prevState.gameWon
                }));
            }
        });

        // Error handling
        this.socket.on('err', (data) => {
            this.props.setAlert(data.type, data.message);
        });
    }

    componentDidMount() {
        // console.log('game-mount');
        this.props.history.replace({ pathname: `/game/${this.state.roomId === null ? 'lobby' : this.state.roomId}` });
        this.handleSocketEvents();
    }

    componentWillUnmount() {
        // Upon unmounting game component, disconnect socket
        this.socket.disconnect();
    }

    render() {
        // console.log('game');
        
        return (
            <div>
                {this.state.roomId === null ? (
                    <Lobby {...this.state} {...this.props} socket={this.socket} />
                ) : (
                    <Room {...this.state} {...this.props} socket={this.socket} />
                )}
            </div>
        );
    }
}

export default withRouter(Game);