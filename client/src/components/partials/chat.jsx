import React, { Component } from 'react';


class Chat extends Component {
    constructor(props) {
        super(props);

        // Create ref for chat box
        this.messageList = React.createRef();
    }

    sendMessage = () => {
        // Get message from the message input element
        const message = document.getElementById('messageBox').value;
        if(message !== '') {
            this.props.socket.emit('sendMessage', {
                roomId: this.props.roomId,
                user: this.props.user,
                message: message
            }); 
        }

        // Clear the message input element after sending message
        document.getElementById('messageBox').value = '';
    }

    leaveRoom = () => {
        this.props.socket.emit('sendMessage', {
            roomId: this.props.roomId,
            user: null,
            message: '-----' + this.props.user.name + ' has left the room'
        });
        this.props.socket.emit('leaveRoom', {
            roomId: this.props.roomId,
            user: this.props.user
        });
    }

    scrollToBottom = () => {
        // scroll the chat box to the bottom
        if(this.messageList) {
            const scrollHeight = this.messageList.scrollHeight;
            const height = this.messageList.clientHeight;
            const maxScrollTop = scrollHeight - height;
            this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        }
    }

    componentDidMount() {
        // console.log('chat-mount');
    }

    componentDidUpdate(prevProps) {
        // Every time there is new message, scroll the chat box to bottom
        if(this.props.chat !== prevProps.chat) {
            this.scrollToBottom();
        }
    }
    
    render() {
        // console.log('chat');

        const playerCard = (player) => {
            return (
                <div>
                    {player === 'black' ? <h6>Player Black</h6> : <h6>Player White</h6>}
                    <div className='d-flex h-100 justify-content-center'>
                        {this.props.player === player ? (
                            <div className='align-self-center text-center'>
                                <p>{this.props.user.name}</p>
                                <p>{Math.floor(this.props.myTime/60)} min {this.props.myTime%60} sec</p>
                            </div>
                        ) : (
                            this.props.opponent === null ? (
                                Array(5).fill().map((e, i) => {
                                    return <div className='spinner-grow spinner-grow-sm align-self-center mx-1' key={i}></div>
                                })
                            ) : (
                                <div className='align-self-center text-center'>
                                    <p>{this.props.opponent.name}</p>
                                    <p>{Math.floor(this.props.oppTime/60)} min {this.props.oppTime%60} sec</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className='position-relative w-100' style={{ paddingTop: '125%' }}>
                <div className='position-absolute w-100 h-25 fixed-top'>
                    <div className='form-row h-100'>
                        <div className='col'>
                            <div className='card card-body bg-primary text-light h-100'>
                                {playerCard('black')}
                            </div>
                        </div>
                        <div className='col'>
                            <div className='card card-body bg-light text-dark h-100'>
                                {playerCard('white')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='position-absolute w-100 h-50' style={{ top: '25%' }}>
                    <div 
                        className='pre-scrollable'
                        style={{ 
                            width: '100%', 
                            height: '90%', 
                            maxHeight: '90%', 
                            marginTop: '5%',
                            border: '1px solid LightGray'
                        }}
                        ref={(div) => { this.messageList = div; }}
                    >
                        {this.props.chat && this.props.chat.map((message, i) => { 
                            return (
                                message.user === null ? (
                                    <p key={i} className='my-1'>{message.message}</p>
                                ) : (
                                    <div 
                                        key={'chat_' + i} 
                                        className={message.user._id === this.props.user._id ? (
                                            'card card-body bg-primary text-light rounded ml-5 my-1'
                                        ) : ( 
                                            'card card-body bg-light text-dark rounded mr-5 my-1'
                                        )}
                                    >
                                        <p key={i}>
                                            {message.user._id === this.props.user._id ? 'Me' : message.user.name}: {message.message}
                                        </p>
                                    </div>
                                )
                            )
                        })}
                    </div>
                </div>
                <div className='position-absolute w-100 h-25 fixed-bottom'>
                    <div className='form-row w-100 mx-auto'>
                        <div className='col'>
                            <input className='form-control h-100' id='messageBox' placeholder='Type your message here' />
                        </div>
                        <button className='btn btn-primary' onClick={this.sendMessage}>Send</button>
                    </div>
                    <button className='btn btn-primary w-100 m-1 mt-5' onClick={this.leaveRoom}>Leave Room</button>
                </div>
            </div>
        );
    }
}

export default Chat;