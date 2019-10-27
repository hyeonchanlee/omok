import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';

import Alerts from './partials/alerts';


class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };
    }

    // Update form input as user types
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // Handle user login request
    userLogin = () => {
        const { email, password } = this.state;
        axios.post('/users/login', {
                email: email,
                password: password
            })
            .then(res => {
                this.props.setAlert(res.data.type, res.data.msg);
                if(res.data.type === 'success') {
                    this.props.connectUser(res.data.user);
                    this.props.history.replace('/');
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    componentDidMount() {
        // console.log('login-mount');
        this.props.clearAlerts();

        // Get the redirect message and alert user
        const redirMsg = this.props.location.state;
        if(redirMsg) {
            this.props.setAlert(redirMsg.type, redirMsg.msg);
            // Clear the redirect message
            this.props.history.replace({
                pathname: '/users/login',
                state: {}
            });
        }
    }

    render() {
        // console.log('login');

        // If user is already logged in, redirect to welcome page
        if(this.props.user) { return <Redirect to={'/'} /> }
        
        return (
            <div className='row mt-5'>
                <div className='col-lg-4 m-auto'>
                    <div className='card card-body'>
                        <h1 className='text-center mb-3'>
                            <i className='fas fa-sign-in-alt'></i> Login
                        </h1>
                        <Alerts alerts={this.props.alerts} clearAlerts={this.props.clearAlerts} />
                        <div className='form-group'>
                            <label htmlFor='email'>Email</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                className='form-control'
                                placeholder='Enter Email'
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='password'>Password</label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                className='form-control'
                                placeholder='Enter Password'
                                onChange={this.handleChange}
                            />
                        </div>
                        <button 
                            type='submit' 
                            className='btn btn-primary btn-block' 
                            onClick={this.userLogin}
                        >
                            Login
                        </button>
                        <p className='lead mt-4'>
                            No Account? <Link to='/users/register'>Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);