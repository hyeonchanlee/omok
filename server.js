import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';

import socketHandler from './game/socket.js';
import passportConfig from './config/passport.js';
import userRouter from './routes/user.route.js';

passportConfig(passport);
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.log(err));

// Initialize Express Server and Port
const app = express();
const server = http.Server(app);

// CORS
const whitelist = [
    'http://localhost:3000', 
    'https://hyeonchanlee.github.io', 
    'https://www.omokonline.com'
];
const corsOptions = {
    credentials: true, 
    origin: (origin, callback) => {
        (whitelist.indexOf(origin) !== -1 || !origin)
            ? callback(null, true)
            : callback(new Error('Not allowed by CORS!'));
    }
};
app.use(cors(corsOptions));

// Bodyparser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NPM_CONFIG_PRODUCTION) {
    app.set('trust proxy', 1);
}

// Session Middleware
app.use(session({
    secret: 'keyboard dog', 
    resave: false, 
    saveUninitialized: true, 
    cookie: {
        maxAge: (60 * 60 * 1000), 
        sameSite: true, 
        httpOnly: true, 
        proxy: true, 
        secure: process.env.NPM_CONFIG_PRODUCTION
    }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/user', userRouter);

server.listen(PORT, err => {
    if(err) console.log('Error setting up server!');
    else console.log('Server listeneing on Port', PORT);
});

// Socket IO Handler
socketHandler(server);