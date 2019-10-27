import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';


class Home extends Component {

    // Handle user logout request
    userLogout = () => {
        axios.get('/users/logout')
            .then(res => {
                if(res.data.type === 'success') {
                    this.props.history.replace('/users/login', { 
                        type: res.data.type,
                        msg: res.data.msg 
                    });
                    this.props.disconnectUser();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    componentDidMount() {
        // console.log('home-mount');
    }

    render() {
        // console.log('home');
        
        // If user is logged in, render welcome page
        if(this.props.user) {
            return (
                <div className='row mt-5'>
                    <div className='col-lg-4 m-auto'>
                        <div className='card card-body text-center'>
                            <h1><i className='fas fa-crow'></i></h1>
                            <h5>Welcome!</h5>
                            <p>You are logged in as {this.props.user.name}</p>
                            <button className='btn btn-secondary' onClick={this.userLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            );
        }
        // If user is not logged in, let user register or login
        return (
            <div className='row mt-5'>
                <div className='col-lg-4 m-auto'>
                    <div className='card card-body text-center'>
                        <h1><i className='fas fa-crow'></i></h1>
                        <p>Create an account or login</p>
                        <Link to='/users/register' className='btn btn-primary btn-block mb-2'>Register</Link>
                        <Link to='/users/login' className='btn btn-secondary btn-block'>Login</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Home);