import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Navbar extends Component {

    componentDidMount() {
        // console.log('navbar-mount');
    }

    render() {
        // console.log('navbar');

        return (
            <div>
                <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
                    <Link to='/' className='navbar-brand'>
                        <i className='fas fa-crow ml-2 mr-2'></i>O-MOK
                    </Link>
                    <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#myNavbar'>
                        <span className='navbar-toggler-icon'></span>
                    </button>

                    <div className='collapse navbar-collapse' id='myNavbar'>
                        <div className='navbar-nav'>
                            <Link to='/' className='nav-item nav-link'>Home</Link>
                            <Link to='/dashboard' className='nav-item nav-link'>Dashboard</Link>
                            <Link to='/game' className='nav-item nav-link'>Play</Link>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;