import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import Alert from '../../components/alert/alert.jsx';
import { withNoAuth } from '../../contexts/auth.jsx';
import { withAlert } from '../../contexts/alert.jsx';
import './register.css';

class Register extends Component { 
    constructor(props) {
        super(props);

        this.state = {
            name: '', 
            username: '', 
            email: '', 
            password: '', 
            password2: ''
        };
    }

    onInputChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    clearFields = () => {
        this.setState({
            name: '', 
            username: '', 
            email: '', 
            password: '', 
            password2: ''
        });
    }

    userRegister = event => {
        const {
            name, 
            username, 
            email, 
            password, 
            password2 
        } = this.state;

        if(!name || !email || !username || !password || !password2) {
            this.props.alert.setAlert('warning', 'Please fill in all fields.');
            this.clearFields();
        }
        else if(password !== password2) {
            this.props.alert.setAlert('warning', 'Passwords do not match.');
            this.clearFields();
        }
        else if(password.length < 6) {
            this.props.alert.setAlert('warning', 'Password should be at least 6 characters.');
            this.clearFields();
        }
        else {
            this.props.auth.registerUser(name, username, email, password);
        }

        event.preventDefault();
    }

    componentWillUnmount() {
        this.props.alert.clearAlert();
    }

    render() {
        const { name, username, email, password, password2 } = this.state;

        return (
            <div className='_register'>
                <form className='form' onSubmit={this.userRegister}>
                    <div className='header'>
                        <i className='icon fas fa-user-plus'></i>
                        &nbsp; <p>Sign Up</p>
                    </div>
                    <Alert 
                        type={this.props.alert.type}
                        message={this.props.alert.message}
                    />
                    <label>Name</label>
                    <input 
                        className='input'
                        type='text'
                        name='name'
                        value={name}
                        placeholder='Your Name'
                        onChange={this.onInputChange}
                    />
                    <label>Username</label>
                    <input 
                        className='input'
                        type='text'
                        name='username'
                        value={username}
                        placeholder='Your Username'
                        onChange={this.onInputChange}
                    />
                    <label>Email</label>
                    <input 
                        className='input'
                        type='email'
                        name='email'
                        value={email}
                        placeholder='Your Email'
                        onChange={this.onInputChange}
                    />
                    <label>Password</label>
                    <input 
                        className='input'
                        type='password'
                        name='password'
                        value={password}
                        placeholder='Password'
                        onChange={this.onInputChange}
                    />
                    <label>Confirm Password</label>
                    <input 
                        className='input'
                        type='password'
                        name='password2'
                        value={password2}
                        placeholder='Confirm Password'
                        onChange={this.onInputChange}
                    />
                    <button className='submit' type='submit'>
                        Sign Up
                    </button>
                    <p>
                        Already Have Account? &nbsp;
                        <Link className='link' to='/login'>
                            Log In Here
                        </Link>
                    </p>
                </form>
            </div>
        );
    }
}

export default compose(withNoAuth, withAlert)(Register);