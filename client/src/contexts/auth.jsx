import React, { createContext } from 'react';
import { Redirect } from 'react-router-dom';

const AuthContext = createContext(null);

const withAuth = Component => props => (
    <AuthContext.Consumer>
        {auth => 
            auth.user
                ? <Component {...props} auth={auth} />
                : <Redirect to='/login' auth={auth} />
        }
    </AuthContext.Consumer>
);

const withNoAuth = Component => props => (
    <AuthContext.Consumer>
        {auth => 
            auth.user 
                ? <Redirect to='/' auth={auth} />
                : <Component {...props} auth={auth} />
        }
    </AuthContext.Consumer>
);

export {
    AuthContext, 
    withAuth,
    withNoAuth
};