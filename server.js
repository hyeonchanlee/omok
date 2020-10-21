import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
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
const PORT = process.env.PORT || 5000;

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

app.use(cookieParser());
app.enable('trust proxy');

// Session Middleware
app.use(session({
    secret: 'keyboard dog', 
    resave: false, 
    saveUninitialized: true, 
    proxy: true, 
    cookie: {
        secure: true
    }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/user', userRouter);

// Socket IO Handler
socketHandler(server);

server.listen(PORT, err => {
    if(err) console.log('Error setting up server!');
    else console.log('Server listeneing on Port', PORT);
});