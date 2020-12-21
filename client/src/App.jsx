import React, { Component } from 'react';
import { 
    Route, 
    Switch, 
    withRouter
} from 'react-router-dom';
import axios from 'axios';
import dotenv from 'dotenv';

import Navbar from './components/navbar/navbar.jsx';
import Footer from './components/footer/footer.jsx';
import Login from './pages/login/login.jsx';
import Register from './pages/register/register.jsx';
import Game from './pages/game/game.jsx';
import Loading from './pages/loading/loading.jsx';
import { AuthContext } from './contexts/auth.jsx';
import { AlertContext } from './contexts/alert.jsx';

dotenv.config();

const instance = axios.create({
    withCredentials: true, 
    baseURL: process.env.REACT_APP_MODE === 'PRODUCTION' 
        ? process.env.REACT_APP_ENDPOINT_PROD
        : process.env.REACT_APP_ENDPOINT_DEV, 
    headers: {
        'Content-Type': 'application/json',
    }
});

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: null, 
            user: null,
            alert: null
        };
    }

    setAlert = (type, message) => {
        this.setState({
            alert: {
                type: type, 
                message: message
            }
        });
    }

    clearAlert = () => {
        this.setState({
            alert: null
        });
    }

    registerUser = (name, username, email, password) => {
        instance.post('/user/register', {
                name: name, 
                username: username, 
                email: email, 
                password: password
            })
            .then(res => {
                this.setAlert(res.data.type, res.data.message);
                if(res.data.type === 'success') {
                    this.loginUser(email, password);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    loginUser = (email, password) => {
        instance.post('/user/login', {
                email: email, 
                password: password
            })
            .then(res => {
                this.setAlert(res.data.type, res.data.message);
                if(res.data.type === 'success') {
                    this.setState({
                        authenticated: true, 
                        user: res.data.user
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    logoutUser = () => {
        instance.post('/user/logout')
            .then(res => {
                if(res.data.type === 'success') {
                    this.setState({
                        authenticated: false, 
                        user: null
                    });
                    this.setAlert(res.data.type, res.data.message);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    deleteUser = () => {
        const { user } = this.state;

        instance.delete(`/user/delete/${user._id}`)
            .then(res => {
                this.setAlert(res.data.type, res.data.message);
                if(res.data.type === 'success') {
                    this.authenticateUser();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    authenticateUser = () => {
        instance.post('/user/authenticate')
            .then(res => {
                if(res.data.type === 'success') {
                    this.setState({
                        authenticated: true, 
                        user: res.data.user
                    });
                }
                else {
                    this.setState({
                        authenticated: false, 
                        user: null
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    componentDidMount() {
        this.authenticateUser();
    }

    render() {
        if(this.state.authenticated === null) return <Loading />;

        const auth = {
            user: this.state.user, 
            registerUser: this.registerUser, 
            loginUser: this.loginUser, 
            logoutUser: this.logoutUser, 
            deleteUser: this.deleteUser, 
            authenticateUser: this.authenticateUser
        };

        const alert = {
            ...this.state.alert, 
            setAlert: this.setAlert, 
            clearAlert: this.clearAlert
        }

        return (
            <AuthContext.Provider value={auth}>
                <AlertContext.Provider value={alert}>
                    <Navbar auth={auth} />
                    <Switch>
                        <Route path='/login' component={Login} />
                        <Route path='/register' component={Register} />
                        <Route path='/' component={Game} />
                    </Switch>
                    <Footer />
                </AlertContext.Provider>
            </AuthContext.Provider>
        );
    }
}

export default withRouter(App);