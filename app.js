const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/database');
const passport = require('passport');
const port = process.env.PORT || 8000;
const Chat = require('./models/chat');
const Product = require('./models/product');

//db connection
mongoose.connect(config.connectionString, (err) => {
        if (err) console.log('Database error' + err);
        else {
            console.log('Connected to database ' + config.dbName);
        }
    }
);

const app = express();

//modules usage
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public')));
app.use(passport.initialize());
app.use(passport.session());


//routes
const customers = require('./routes/customers');
app.use('/customers', customers);
const companies = require('./routes/companies');
app.use('/companies', companies);
const consultants = require('./routes/consultants');
app.use('/consultants', consultants);
const products = require('./routes/products');
app.use('/products', products);

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

let http = require('http').Server(app);

http.listen(port, () => {
    console.log('Main server app listening on port ' + port);
});

// sockets
let serverSocket = require('socket.io')(http);

serverSocket.on('connection', (clientSocket) => {
    console.log('socket connection established');

    clientSocket.on('room', (req) => {
        console.log(req);
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

                    Chat.addPrivateMessage(serverMessage, (err, res) => {
                        if (err) console.log(err);
                        else {
                            Chat.getAllByRoom(req.data.room, (err, res) => {
                                if (err) console.log(err);
                                serverSocket.to(req.data.room).emit('output', res);
                                serverSocket.to(req.data.room).emit('customerConnected', req.data.time);
                            })
                        }
                    });
                    Product.getById(req.data.productId)
                    serverSocket.to(req.data.room).emit('currentProduct', req.data.product);
                }
            }
        });
    });

    clientSocket.on('roomMobile', (req) => {
        console.log(req);
        clientSocket.join(req.data.room);

        Chat.getAllByRoom(req.data.room, (err, messages) => {
            if (err) {
                console.log(err);
            } else {
                serverSocket.to(req.data.room).emit('output', messages);

                let serverMessage = new Chat({
                    user: 'system',
                    message: req.data.user + ' joined to the room',
                    profileImg: null,
                    room: req.data.room,
                    date: Date.now(),
                    type: 'private',
                    isSystemMessage: true
                });

                Chat.addPrivateMessage(serverMessage, (err, res) => {
                    if (err) console.log(err);
                    else {
                        Chat.getAllByRoom(req.data.room, (err, res) => {
                            if (err) console.log(err);
                            serverSocket.to(req.data.room).emit('output', res);
                            serverSocket.to(req.data.room).emit('customerConnected', req.data.time);
                        })
                    }
                });
                Product.getById(req.data.productId, (err, product) => {
                    serverSocket.to(req.data.room).emit('currentProduct', product);
                });
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
                Chat.getAllByRoomAndTime(data.chat.room, data.time, (err, res) => {
                    if (err) console.log(err);
                    console.log(res);
                    serverSocket.to(data.chat.room).emit('customerOutput', res);
                })
            }
        });
    });

    clientSocket.on('disconnectedMessage', (data) => {
        let serverMessage = new Chat({
            user: 'system',
            message: data.user + ' left the room',
            profileImg: null,
            room: data.room,
            date: Date.now(),
            type: 'private',
            isSystemMessage: true
        });

        Chat.addPrivateMessage(serverMessage, (err) => {
            if (err) console.log(err);
            else {
                Chat.getAllByRoom(data.room, (err, res) => {
                    if (err) console.log(err);
                    serverSocket.to(data.room).emit('output', res);
                    serverSocket.to(data.room).emit('customerDisconnected', res);
                })
            }
        });
    });

    clientSocket.on('disconnect', () => {
        console.log('user disconnected');
    });

    clientSocket.on('forum', () => {
        Chat.getAllByRoom()
    });
});

