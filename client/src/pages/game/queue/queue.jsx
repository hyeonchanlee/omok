import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withGame } from '../../../contexts/game.jsx';
import './queue.css';

function Queue(props) {
    const { history } = props;
    const { socket } = props.game;

    useEffect(() => {
        return () => {
            socket.emit('leaveQueue');
        }
    }, []);

    return (
        <div className='_queue'>
            <div className='loading'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <p className='text'>Looking for Match . . .</p>
            <button 
                className='cancel'
                onClick={() => history.replace('/')}
            >
                Cancel
            </button>
        </div>
    );
}

export default compose(withRouter, withGame)(Queue);