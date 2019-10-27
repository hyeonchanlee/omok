const User = require('../models/User');

module.exports = (server) => {
    const io = require('socket.io')(server);

    io.on('connection', (socket) => {
        console.log('A user connected!');

        // Return list of open rooms
        socket.on('getRoomsList', () => {
            const roomsList = Object.assign({}, io.sockets.adapter.rooms);
            const rooms = [];
            
            for (roomId in roomsList) {
                // Remove rooms that are already full
                if(roomsList[roomId].length != 1) {
                    delete roomsList[roomId];
                }
                else {
                    // Remove default rooms for each socket
                    for (const socketId in roomsList[roomId].sockets) {
                        if(roomId === socketId) {
                            delete roomsList[roomId];
                        }
                    }
                }
            }
            // Return list of { room ID, user } pairs for all open rooms
            for (roomId in roomsList) {
                User.findById(roomId)
                    .then(user => {
                        rooms.push({
                            roomId: roomId,
                            user: user
                        });
                        socket.emit('roomsList', { rooms: rooms });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }            
        });

        // Create new room and return room information
        socket.on('createRoom', ({ user }) => {
            socket.join(user._id);
            socket.emit('createdRoom', {
                roomId: user._id,
                user: user
            });
        });

        // Join the room and return room information
        socket.on('joinRoom', ({ roomId, user }) => {
            const room = io.sockets.adapter.rooms[roomId];
            // The room doesn't exist, return error
            if(!room) {
                socket.emit('err', {
                    type: 'error',
                    message: 'That room doesn\'t exist anymore!'
                });
                socket.emit('joinedRoom', {
                    roomId: null,
                    user: user
                });
            }
            // The room is already full, return error
            else if(room.length > 1) {
                socket.emit('err', {
                    type: 'err', 
                    message: 'The room is full!'
                });
                socket.emit('joinedRoom', {
                    roomId: null,
                    user: user
                });
            }
            // If the room is open, join the room
            else {
                socket.join(roomId);
                socket.emit('joinedRoom', {
                    roomId: roomId,
                    user: user
                });
                socket.broadcast.to(roomId).emit('joinedRoom', { 
                    roomId: roomId,
                    user: user
                });
            }
        });

        // Send opponent user information and start game
        socket.on('gameStart', ({ user }) => {
            socket.broadcast.to(roomId).emit('gameStart', { user : user });
        });

        // Player played turn, relay the board information to everyone in the room
        socket.on('playTurn', ({ roomId, board, player, x, y }) => {
            const room = io.sockets.adapter.rooms[roomId];
            if(room.length == 2) {
                socket.emit('playedTurn', {
                    board: board,
                    player: player,
                    x: x, 
                    y: y
                });
                socket.broadcast.to(roomId).emit('playedTurn', {
                    board: board,
                    player: player,
                    x: x,
                    y: y
                });
            }
        });
        
        // Player resigned the game
        socket.on('resign', ({ user }) => {
            socket.emit('resigned', { user: user });
            socket.broadcast.to(roomId).emit('resigned', { user: user });
        });

        // Send message to everyone in the room
        socket.on('sendMessage', ({ roomId, user, message }) => {
            socket.emit('receiveMessage', {
                roomId: roomId,
                user: user,
                message: message
            });
            socket.broadcast.to(roomId).emit('receiveMessage', {
                roomId: roomId,
                user: user,
                message: message
            });
        });

        // Player left room
        socket.on('leaveRoom', ({ roomId, user }) => {
            socket.emit('leftRoom', {
                roomId: roomId,
                user: user
            });
            socket.broadcast.to(roomId).emit('leftRoom', {
                roomId: roomId,
                user: user
            });

            // Force everyone out of room, room is not recyclable
            io.of('/').in(roomId).clients((error, socketIds) => {
                if(error) console.log(error);
                socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(roomId));
            });
        });

        // Socket disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected!');
        });
    });
}