import socket from 'socket.io';

import { checkWinCondition } from './gamelogic.js';
import { minimax } from './minimax.js';

const socketHandler = server => {
    const io = socket(server);
    let users = {};
    let rooms = {};

    io.on('connection', socket => {
        socket.on('userConnected', ({ user }) => {
            console.log(user.username, ' connected!');

            users[user._id] = user;

            io.sockets.emit('updateUserList', {
                users: users
            });
        });

        socket.on('userDisconnected', ({ user }) => {
            console.log(user.username, ' disconnected!');

            delete users[user._id];

            io.sockets.emit('updateUserList', {
                users: users
            });
        });

        socket.on('joinQueue', () => {
            socket.join('queue');

            socket.emit('joinedQueue');

            const queue = io.sockets.adapter.rooms['queue'];

            if(queue.length === 2) {
                io.to('queue').emit('foundMatch', {
                    roomId: socket.id
                });
                Object.keys(queue.sockets).forEach(client => {
                    io.sockets.sockets[client].leave('queue');
                });
            }
        });

        socket.on('leaveQueue', () => {
            socket.leave('queue');
        });

        socket.on('joinMatch', ({ user, roomId }) => {
            socket.join(roomId);

            if(rooms[roomId] && rooms[roomId].players) {
                rooms[roomId].players.push(user);

                io.to(roomId).emit('beginMatch', {
                    room: rooms[roomId]
                });
            }
            else {
                rooms[roomId] = { 
                    roomId: roomId, 
                    players: [ user ], 
                    time: [ 300, 300 ], 
                    board: Array(19).fill().map(() => Array(19).fill('transparent')), 
                    turn: 0, 
                    winner: null
                };
            }
        });

        socket.on('joinMatchAI', ({ user, roomId }) => {
            socket.join(roomId);

            rooms[roomId] = {
                roomId: roomId, 
                players: [ user ], 
                time: [ 300, 300 ], 
                board: Array(19).fill().map(() => Array(19).fill('transparent')), 
                turn: 0, 
                winner: null
            };

            io.to(roomId).emit('beginMatch', {
                room: rooms[roomId]
            });
        });

        socket.on('leaveMatch', ({ roomId, user }) => {
            if(rooms[roomId] && rooms[roomId].winner === null) {
                rooms[roomId].winner = rooms[roomId].players[0]._id === user._id
                    ? 1
                    : 0;

                socket.broadcast.to(roomId).emit('endMatch', {
                    room: rooms[roomId]
                });
            }
        });

        socket.on('deleteMatch', ({ roomId }) => {
            const room = io.sockets.adapter.rooms[roomId];
            if(room) {
                Object.keys(room.sockets).forEach(client => {
                    console.log(client, ' leaving room ', roomId);
                    io.sockets.sockets[client].leave(roomId);
                });
            }

            delete rooms[roomId];
        });

        socket.on('countTimer', ({ roomId }) => {
            if(rooms[roomId]) {
                if(rooms[roomId].time[rooms[roomId].turn] <= 0) {
                    rooms[roomId].winner = rooms[roomId].turn;
                    io.to(roomId).emit('endMatch', {
                        room: rooms[roomId]
                    });
                }
                else {
                    rooms[roomId].time[rooms[roomId].turn] -= 1;
                    io.to(roomId).emit('updateMatch', {
                        room: rooms[roomId]
                    });
                }
            }
        });

        socket.on('playMove', ({ roomId, x, y }) => {
            rooms[roomId].board[x][y] = rooms[roomId].turn === 0
                ? 'black'
                : 'white';

            if(checkWinCondition(rooms[roomId].board, rooms[roomId].turn, x, y)) {
                rooms[roomId].winner = rooms[roomId].turn;
                io.to(roomId).emit('endMatch', {
                    room: rooms[roomId]
                });
            }
            else {
                rooms[roomId].turn = rooms[roomId].turn === 0 ? 1 : 0;
                io.to(roomId).emit('updateMatch', {
                    room: rooms[roomId]
                });
            }
        });

        socket.on('playAIMove', ({ roomId }) => {
            const { val, move, x, y } = minimax(rooms[roomId].board, 2, 'white', true, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
            rooms[roomId].board = move;
            console.log(val);

            if(checkWinCondition(rooms[roomId].board, 1, x, y)) {
                rooms[roomId].winner = 1;
                io.to(roomId).emit('endMatch', {
                    room: rooms[roomId]
                });
            }
            else {
                rooms[roomId].turn = 0
                io.to(roomId).emit('updateMatch', {
                    room: rooms[roomId]
                });
            }
        });
    });
}

export default socketHandler;