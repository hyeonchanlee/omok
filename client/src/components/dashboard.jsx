import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';


class Dashboard extends Component {

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
        // console.log('dashboard-mount');
    }

    render() {
        // console.log('dashboard');
        
        return (
            <div className='ml-5'>
                <h1 className='mt-4'>Dashboard</h1>
                <p className='lead mb-3'>Welcome {this.props.user.name}!</p>
                <button className='btn btn-secondary' onClick={this.userLogout}>Logout</button>
            </div>
        );
    }
}

export default withRouter(Dashboard);