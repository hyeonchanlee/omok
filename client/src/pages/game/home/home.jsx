import React from 'react';
import { compose } from 'recompose';

import { withAuth } from '../../../contexts/auth.jsx';
import { withGame } from '../../../contexts/game.jsx';
import './home.css';

function Home(props) {
    const { users, socket } = props.game;
    const num_users = Object.keys(users).length;

    const queueRandom = () => {
        socket.emit('joinQueue');
    };

    return (
        <div className='_home'>
            <div className='wrapper'>
                <div className='column'>
                    <h1>Play Omok Online!</h1>
                    <button
                        className='play' 
                        onClick={queueRandom}
                    >
                        <i className='fas fa-user-friends'></i>
                        &nbsp; Find Match
                    </button>
                </div>
                <div className='column'>
                    <h1 className='header'>
                        {num_users} {num_users > 1 ? 'Players' : 'Player'} Online
                    </h1>
                    <div className='list'>
                        {Object.keys(users).map((user, i) => (
                            <div className='list_item' key={i}>
                                <p>
                                    <i className='fas fa-circle online_indicator'></i>
                                    &nbsp; {users[user].username}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default compose(withAuth, withGame)(Home);