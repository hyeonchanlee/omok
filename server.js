const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();
const server = require('http').Server(app);

// Dotenv config
require('dotenv').config();

// Passport Config
require('./config/passport')(passport);

// Connect to Database
mongoose.connect(process.env.MONGO_URI, { 
        useUnifiedTopology: true, 
        useNewUrlParser: true 
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Socket.IO Event Handler
require('./config/socket')(server);

// Bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));