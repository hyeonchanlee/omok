import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import { compose } from 'recompose';

import Home from './home/home.jsx';
import Queue from './queue/queue.jsx';
import Room from './room/room.jsx';
import Profile from './profile/profile.jsx';
import { withAuth } from '../../contexts/auth.jsx';
import { GameContext } from '../../contexts/game.jsx';

import dotenv from 'dotenv';
dotenv.config();

class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: {}, 
            rooms: {}, 
            roomId: null, 
            players: [], 
            time: [], 
            board: Array(19).fill().map(() => Array(19).fill('transparent')), 
            turn: 0, 
            winner: null
        }

        this.socket = io.connect(process.env.REACT_APP_MODE === 'PRODUCTION'
            ? process.env.REACT_APP_ENDPOINT_PROD
            : process.env.REACT_APP_ENDPOINT_DEV
        );

        this.timer = null;
    }

    countTimer = () => {
        const { user } = this.props.auth;
        const { roomId, players, turn } = this.state;

        if(players[turn] && players[turn]._id === user._id) {
            this.socket.emit('countTimer', ({
                roomId: roomId
            }));
        }
    }

    startTimer = () => {
        this.timer = setInterval(this.countTimer, 1000);
    }

    stopTimer = () => {
        clearInterval(this.timer);
    }

    clearGameData = () => {
        this.setState({
            roomId: null, 
            players: [], 
            time: [], 
            board: Array(19).fill().map(() => Array(19).fill('transparent')), 
            turn: 0, 
            winner: null
        });
    }

    leaveGame = () => {
        const { roomId, winner } = this.state;
        const { user } = this.props.auth;

        if(roomId && winner === null) {
            this.socket.emit('leaveMatch', {
                user: user, 
                roomId: roomId
            });
        }

        this.socket.emit('userDisconnected', {
            user: this.props.auth.user
        });

        this.socket.disconnect();
    }

    handleSocketEvents = () => {
        this.socket.on('updateUserList', ({ users }) => {
            this.setState({ users: users });
        });

        this.socket.on('joinedQueue', () => {
            this.props.history.replace('/queue');
        });

        this.socket.on('foundMatch', ({ roomId }) => {         
            this.socket.emit('joinMatch', {
                user: this.props.auth.user, 
                roomId: roomId
            });
        });

        this.socket.on('beginMatch', ({ room }) => {
            this.setState(room);
            this.props.history.replace(`/game/${room.roomId}`);
            this.startTimer();
        });

        this.socket.on('updateMatch', ({ room }) => {
            this.setState(room);
        })
        
        this.socket.on('endMatch', ({ room }) => {
            this.stopTimer();
            this.setState(room);
            this.socket.emit('deleteMatch', {
                roomId: room.roomId
            });
        });
    }

    componentDidMount() {
        this.handleSocketEvents();

        this.socket.emit('userConnected', {
            user: this.props.auth.user
        });

        window.addEventListener('beforeunload', this.leaveGame);
    }

    componentWillUnmount() {
        this.leaveGame();

        window.removeEventListener('beforeunload', this.leaveGame);
    }

    render() {
        const game = {
            ...this.state, 
            clearGameData: this.clearGameData, 
            socket: this.socket
        };

        return (
            <GameContext.Provider value={game}>
                <Switch>
                    <Route path='/queue' component={Queue} />
                    <Route path='/game' component={Room} />
                    <Route path='/profile' component={Profile} />
                    <Route path='/' component={Home} />
                </Switch>
            </GameContext.Provider>
        );
    }
}

export default compose(withRouter, withAuth)(Game);