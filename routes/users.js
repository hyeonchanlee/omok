const bcrypt = require('bcryptjs');
const passport = require('passport');
const express = require('express');
const router = express.Router();

const User = require('../models/User');

// Handle register request
router.post('/register', (req, res) => {
    const { name, email, password } = req.body; 

    User.findOne({ email: email })
        .then(user => {
            if(user) {
                res.send({
                    type: 'error',
                    msg: 'This email is already registered'
                });
            }
            else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;

                        newUser.save()
                            .then(user => {
                                res.send({
                                    type: 'success',
                                    msg: 'You were registered successfully!'
                                });
                            })
                            .catch(err => console.log(err));
                }))
            }
        });
});

// Handle login request
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) { return next(err); }
        if(!user) { 
            return res.send({
                type: 'error',
                msg: 'Invalid username or password.'
            });
        }
        req.logIn(user, (err) => {
            if(err) { return next(err); }
            return res.send({
                type: 'success',
                msg: 'You were logged in successfully!',
                user: user
            });
        })
    })(req, res, next);
});

// Handle logout request
router.get('/logout', (req, res) => {
    req.logout();
    res.send({
        type: 'success',
        msg: 'You have been logged out.'
    });
});

// Authenticate if the user is logged in
router.get('/authenticate', (req, res) => {
    if(req.isAuthenticated()) {
        return res.send({
            type: 'success',
            msg: 'Authentication successful',
            user: req.user
        });
    }
    else {
        return res.send({
            type: 'error',
            msg: 'Authentication failed'
        });
    }
});

module.exports = router;