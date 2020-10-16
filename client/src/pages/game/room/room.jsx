import React, { useEffect } from 'react';
import { Prompt, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Players from './players/players.jsx';
import Board from './board/board.jsx';
import PopUp from '../../../components/popup/popup.jsx';
import { withAuth } from '../../../contexts/auth.jsx';
import { withGame } from '../../../contexts/game.jsx';
import './room.css';

function Room(props) {
    const { history } = props;
    const { user } = props.auth;
    const { 
        roomId, 
        players, 
        winner, 
        clearGameData, 
        socket 
    } = props.game;

    useEffect(() => {
        return () => {
            if(winner === null) {
                socket.emit('leaveMatch', {
                    user: user, 
                    roomId: roomId
                });
            }
            clearGameData();
        }
    }, []);

    return (
        <div className='_room'>
            <Prompt 
                when={winner === null}
                message={'Are you sure you want to leave?'}
            />
            <PopUp
                when={winner !== null}
                message={
                    players && winner !== null && 
                    players[winner]._id === user._id
                        ? 'You win!'
                        : 'You lose...'
                }
                acceptText='Okay'
                onAccept={() => history.replace('/')}
            />
            <div className='wrapper'>
                <div className='players'>
                    <Players />
                </div>
                <div className='board'>
                    <Board />
                </div>
            </div>
        </div>
    );
}

export default compose(withRouter, withAuth, withGame)(Room);