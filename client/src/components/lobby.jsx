import React, { Component } from 'react';

import Alerts from './partials/alerts';


class Lobby extends Component {

    // Fetch list of open rooms from the server
    getRoomsList = () => {
        this.props.socket.emit('getRoomsList');
    }

    createRoom = () => {
        this.props.socket.emit('createRoom', { 
            user: this.props.user
        });
    }

    joinRoom = () => {
        // Get user's room selection from the room options
        const roomsList = document.getElementById('roomsList');
        // If user selected a room, join the room
        if(roomsList.selectedIndex >= 0) {
            const roomId = roomsList.options[roomsList.selectedIndex].id;
            this.props.socket.emit('joinRoom', {
                roomId: roomId,
                user: this.props.user
            });
        }
        // If user didn't select a room
        else {
            this.props.setAlert('warning', 'You didn\'t select a room to join!');
        }
    }

    componentDidMount() {
        // console.log('lobby-mount');
        this.props.clearAlerts();
        this.getRoomsList();
    }

    render() {
        // console.log('lobby');

        return (
            <div className='row mt-5'>
                <div className='col-lg-4 m-auto'>
                    <div className='card card-body'>
                        <h1 className='text-center mb-3'>
                            <i className='fas fa-chess-pawn'></i> Play Game
                        </h1>
                        <Alerts alerts={this.props.alerts} clearAlerts={this.props.clearAlerts} />
                        <h5>Create New Room</h5>
                        <button className='btn btn-primary mb-5' onClick={this.createRoom}>Create New</button>
                        <h5>Or Join Existing Room</h5>
                        <div className='form-group'>
                            <select multiple className='form-control' id='roomsList'>
                                {this.props.rooms.map((room, i) => { 
                                    return <option key={i} id={room.roomId}>{room.roomId}: {room.user.name}</option> 
                                })}
                            </select>
                        </div>
                        <button className='btn btn-secondary' onClick={this.joinRoom}>Join</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Lobby;