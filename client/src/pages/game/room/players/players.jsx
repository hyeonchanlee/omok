import React from 'react';
import { compose } from 'recompose';

import { withAuth } from '../../../../contexts/auth.jsx';
import { withGame } from '../../../../contexts/game.jsx';
import { formatTime } from '../../../../utils/timer.js';
import './players.css';

function Players(props) {
    const { user } = props.auth;
    const { players, time, turn } = props.game;

    const player = user && players[0] && ( 
        players[0]._id === user._id ? 0 : 1 
    );

    return (
        <div className='_players'>
            <div className='player black'>
                <p>{players[0] && players[0].username}</p>
                <p>
                    <i className='far fa-clock'></i> {formatTime(time[0])}
                </p>
                {turn === 0 && 
                    <i className={
                        `fas fa-flag turn ${player === 0 && 'my_turn'}`
                    }></i>
                }
            </div>
            <div className='player white'>
                <p>{players[1] ? players[1].username : 'Computer'}</p>
                <p>
                    <i className='far fa-clock'></i> {formatTime(time[1])}
                </p>
                {turn === 1 && 
                    <i className={
                        `fas fa-flag turn ${player === 1 && 'my_turn'}`
                    }></i>
                }
            </div>
        </div>
    );
}

export default compose(withAuth, withGame)(Players);