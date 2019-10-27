import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import axios from 'axios';

import Dashboard from './components/dashboard';
import Game from './components/game';
import Home from './components/home';
import Login from './components/login';
import Navbar from './components/navbar';
import Register from './components/register';


// Function for private routes (requires login)
const PrivateRoute = ({ component: Component, data, ...rest }) => {
    return <Route {...rest} render={() => (
        data.user ? 
            <Component {...data} /> 
        : 
            <Redirect to={{
                pathname: '/users/login',
                state: {
                    type: 'warning',
                    msg: 'You must be logged in first'
                }
            }} />
    )} />
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: null,
            user: null,
            alerts: {
                error: '',
                warning: '',
                success: ''
            }
        };
    }

    // Show alert messages to user
    setAlert = (type, alert) => {
        const newAlerts = this.state.alerts;
        newAlerts[type] = alert;

        this.setState({ alerts: newAlerts });
    }

    // Clear alert messages
    clearAlerts = () => {
        this.setState({ alerts: {
            error: '',
            warning: '',
            success: ''
        }});
    }

    // User is logged in
    connectUser = (user) => {
        this.setState({
            authenticated: true,
            user: user
        });
    }

    // User is not logged in
    disconnectUser = () => {
        this.setState({
            authenticated: false,
            user: null
        });
    }

    // Authenticate user login status
    authenticateUser = () => {
        axios.get('/users/authenticate')
            .then(res => {
                if(res.data.type === 'success') {
                    this.connectUser(res.data.user);
                }
                else {
                    this.disconnectUser();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    componentDidMount() {
        // console.log('app-mount');

        // Authenticate user whenever page reloads
        this.authenticateUser();
    }

    render() {
        // console.log('app');

        // Wait for user authentication before rendering
        if(this.state.authenticated === null) { return null }

        // Props to pass to child components
        const props = {
            ...this.state,
            endpoint: this.endpoint,
            setAlert: this.setAlert,
            clearAlerts: this.clearAlerts,
            connectUser: this.connectUser,
            disconnectUser: this.disconnectUser,
            userJoinedRoom: this.userJoinedRoom,
            userLeftRoom: this.userLeftRoom
        };

        return (
            <div>
                <Navbar />

                <Route exact path='/' render={() => ( <Home {...props} /> )} />
                <Route path='/users/register' render={() => ( <Register {...props} /> )} />
                <Route path='/users/login' render={() => ( <Login {...props} /> )} />
                <PrivateRoute path='/dashboard' component={Dashboard} data={props} />
                <PrivateRoute path='/game' component={Game} data={props} />
            </div>
        );
    }
}

export default App;