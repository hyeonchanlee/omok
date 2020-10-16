import React, { createContext } from 'react';

const AlertContext = createContext(null);

const withAlert = Component => props => (
    <AlertContext.Consumer>
        {alert => 
            <Component {...props} alert={alert} />
        }
    </AlertContext.Consumer>
)

export { AlertContext, withAlert };