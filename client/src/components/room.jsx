import React, { Component } from 'react';

import Board from './partials/board';
import Chat from './partials/chat';


class Room extends Component {

    componentDidMount() {
        // console.log('room-mount');
    }

    render() {
        // console.log('room');

        return (
            <div className='row justify-content-center my-5'>
                <div className='col-lg-4'>
                    <Board {...this.props} />
                </div>
                <div className='col-lg-4'>
                    <Chat {...this.props} />
                </div>
            </div>
        );
    }
}

export default Room;