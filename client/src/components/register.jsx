import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';

import Alerts from './partials/alerts';


class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            password2: ''
        };
    }

    // Update form input as user types
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // Handle user register request
    userRegister = () => {
        const { name, email, password, password2 } = this.state;
        // Check all input fields are filled
        if (!name || !email || !password || !password2) {
            this.props.setAlert('warning', 'Please fill in all fields');
        }
        // Check that passwords match
        else if (password !== password2) {
            this.props.setAlert('warning', 'Passwords do not match');
        }
        // Check password length
        else if (password.length < 6) {
            this.props.setAlert('warning', 'Password should be at least 6 characters');
        }
        else {
            axios.post('/users/register', {
                    name: name,
                    email: email,
                    password: password
                })
                .then(res => {
                    this.props.setAlert(res.data.type, res.data.msg);
                    if(res.data.type === 'success') {
                        this.props.history.replace('/users/login', { 
                            type: res.data.type,
                            msg: res.data.msg 
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    componentDidMount() {
        // console.log('register-mount');
        this.props.clearAlerts();
    }

    render() {
        // console.log('register');

        // If user is already logged in, redirect to welcome page
        if(this.props.user) { return <Redirect to={'/'} /> }

        return (
            <div className='row mt-5'>
                <div className='col-lg-4 m-auto'>
                    <div className='card card-body'>
                        <h1 className='text-center mb-3'>
                            <i className='fas fa-user-plus'></i> Register
                        </h1>
                        <Alerts alerts={this.props.alerts} clearAlerts={this.props.clearAlerts} />
                        <div className='form-group'>
                            <label htmlFor='name'>Name</label>
                            <input
                                type='name'
                                id='name'
                                name='name'
                                className='form-control'
                                placeholder='Enter Name'
                                onChange={this.handleChange}
                            />
                        </div>
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
                                placeholder='Create Password'
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='password2'>Confirm Password</label>
                            <input
                                type='password'
                                id='password2'
                                name='password2'
                                className='form-control'
                                placeholder='Confirm Password'
                                onChange={this.handleChange}
                            />
                        </div>
                        <button 
                            type='submit' 
                            className='btn btn-primary btn-block' 
                            onClick={this.userRegister}
                        >
                            Register
                        </button>
                        <p className='lead mt-4'>Have An Account? <Link to='/users/login'>Login</Link></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Register);