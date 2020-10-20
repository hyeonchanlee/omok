import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';

import User from '../models/user.model.js';

const userRouter = express.Router();

userRouter.post('/register', (req, res) => {
    const { 
        name, 
        username, 
        email, 
        password 
    } = req.body;

    User.findOne({ email: email })
        .then(user => {
            if(user) {
                return res.send({
                    type: 'error', 
                    message: 'This email is already registered.'
                });
            }
        })
        .catch(() => {
            return res.send({
                type: 'error', 
                message: 'There has been an error.'
            });
        });

    User.findOne({ username: username })
        .then(user => {
            if(user) {
                return res.send({
                    type: 'error', 
                    message: 'This username is already being used.'
                });
            }
        })
        .catch(() => {
            return res.send({
                type: 'error', 
                message: 'There has been an error.'
            });
        });

    const newUser = new User({
        name, 
        username, 
        email, 
        password
    });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;

            newUser.password = hash;
            newUser.save()
                .then(user => {
                    return res.send({
                        type: 'success', 
                        message: 'You were registered successfully!'
                    });
                })
                .catch(err => {
                    return res.send({
                        type: 'error', 
                        message: 'There has been an error.'
                    });
                });
        });
    });
});

userRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {      
        if(err) return next(err);

        if(!user) {
            return res.send({
                type: 'error', 
                message: 'Invalid email or password.'
            });
        }
        req.logIn(user, err => {
            if(err) return next(err);
            return res.send({
                type: 'success', 
                message: 'You were logged in successfully!', 
                user: user
            });
        });
    })(req, res, next);
});

userRouter.get('/logout', (req, res) => {
    req.logout();
    res.send({
        type: 'success', 
        message: 'You have been logged out successfully!'
    });
});

userRouter.get('/authenticate', (req, res) => {
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()) {
        return res.send({
            type: 'success', 
            message: 'Authentication successful.', 
            user: req.user
        });
    }
    else {
        return res.send({
            type: 'error', 
            message: 'Authentication failed.'
        });
    }
});

userRouter.post('/delete', (req, res) => {
    const { user } = req.body;

    User.deleteOne({ email: user.email })
        .then(() => {
            return res.send({
                type: 'success', 
                message: 'Account has been successfully deleted.'
            });
        })
        .catch(() => {
            return res.send({
                type: 'error', 
                message: 'There has been an error.'
            });
        });
});

export default userRouter;