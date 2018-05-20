const mongoose = require('mongoose');
const serverSocket = require('socket.io').listen(4000).sockets;
const Chat = require('./models/chat');
const Customer = require('./models/customer');
const Consultant = require('./models/consultant');

//main socket
module.exports.socketCreation = () => {
    console.log('Sockets created on port 4000');
    serverSocket.on('connection', (clientSocket) => {
        console.log('socket connection established');

        clientSocket.on('room', (req) => {
            clientSocket.join(req.data.room);

            Chat.getAllByRoom(req.data.room, (err, messages) => {
                if (err) {
                    console.log(err);
                } else {
                    serverSocket.to(req.data.room).emit('output', messages);

                    if (req.data.type === 'customer') {
                        let serverMessage = new Chat({
                          user: 'system',
                          message: req.data.user + ' joined to the room',
                          profileImg: null,
                          room: req.data.room,
                          date: Date.now(),
                          type: 'private',
                          isSystemMessage: true
                        });

                        Chat.addPrivateMessage(serverMessage, (err,res)=>{
                            if(err) console.log(err);
                            else{
                                Chat.getAllByRoom(req.data.room, (err, res) => {
                                    if (err) console.log(err);
                                    serverSocket.to(req.data.room).emit('output', res);
                                    serverSocket.to(req.data.room).emit('customerConnected', req.data.time);
                                })
                            }
                        });
                    }
                }
            });
        });

        clientSocket.on('input', (data) => {
            let newChat = new Chat(data.chat);

            Chat.addPrivateMessage(newChat, (err, savedMessage) => {
                if (err) {
                    console.log(err);
                } else {
                    Chat.getAllByRoom(data.chat.room, (err, res) => {
                        if (err) console.log(err);
                        serverSocket.to(data.chat.room).emit('output', res);
                    });

                    console.log('time' + data.time);
                    Chat.getAllByRoomAndTime(data.chat.room, data.time, (err,res)=>{
                        if(err)console.log(err);
                        serverSocket.to(data.chat.room).emit('customerOutput', res);
                    })
                }
            });
        });

        clientSocket.on('disconnectedMessage', (data)=>{

            let serverMessage = new Chat({
                user: 'system',
                message: data.user + ' left the room',
                profileImg: null,
                room: data.room,
                date: Date.now(),
                type: 'private',
                isSystemMessage: true
            });

            Chat.addPrivateMessage(serverMessage, (err)=>{
                if(err) console.log(err);
                else{
                    Chat.getAllByRoom(data.room, (err, res) => {
                        if (err) console.log(err);
                        serverSocket.to(data.room).emit('output', res);
                        serverSocket.to(data.room).emit('customerDisconnected', res);
                    })
                }
            });
        });

        clientSocket.on('disconnect', ()=>{
            console.log('user disconnected');
        });

        clientSocket.on('forum', ()=>{
            Chat.getAllByRoom()
        })

        // hellman
        clientSocket.on('hellmanInitializeCustomerData', (data) => {
            serverSocket.to(data.room).emit('receiveFromCustomer', data);
        });
        clientSocket.on('hellmanInitializeConsultantData', (data)=>{
            serverSocket.to(data.room).emit('receiveFromConsultant', data);
        });
    });
};

