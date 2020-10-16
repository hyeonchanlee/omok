import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';

const passportConfig = passport => {
    passport.use(new LocalStrategy({ 
        usernameField: 'email', 
        passwordField: 'password' 
    }, (email, password, done) => {
        User.findOne({ email: email })
            .then(user => {
                if(!user) {
                    return done(null, false, { message: 'Email is not registered.' });
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false, { message: 'Password incorrect.' });
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}

export default passportConfig;