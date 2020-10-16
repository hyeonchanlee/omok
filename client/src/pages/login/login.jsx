import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import Alert from '../../components/alert/alert.jsx';
import { withNoAuth } from '../../contexts/auth.jsx';
import { withAlert } from '../../contexts/alert.jsx';
import './login.css';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '', 
            password: ''
        }
    }

    onInputChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    clearFields = () => {
        this.setState({
            email: '', 
            password: ''
        });
    }

    userLogin = event => {
        const { email, password } = this.state;

        if(!email || !password) {
            this.props.alert.setAlert('warning', 'Please fill in all fields.');
            this.clearFields();
        }
        else {
            this.props.auth.loginUser(email, password);
        }
        
        event.preventDefault();
    }

    componentWillUnmount() {
        this.props.alert.clearAlert();
    }

    render() {
        const { email, password } = this.state;

        return (
            <div className='_login'>
                <form className='form' onSubmit={this.userLogin}>
                    <div className='header'>
                        <i className='icon fas fa-sign-in-alt'></i>
                        &nbsp; <p>Sign In</p>
                    </div>
                    <Alert 
                        type={this.props.alert.type} 
                        message={this.props.alert.message}
                    />
                    <label>Email</label>
                    <input 
                        className='input'
                        type='email'
                        name='email'
                        value={email}
                        placeholder='Email'
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
                    <button className='submit' type='submit'>
                        Sign In
                    </button>
                    <p>
                        No Account? &nbsp;
                        <Link className='link' to='/register'>
                            Register Here
                        </Link>
                    </p>
                </form>
            </div>
        );
    }
}

export default compose(withNoAuth, withAlert)(Login);