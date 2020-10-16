import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ClickOutside from '../../utils/clickOutside.jsx';
import Logo from '../../assets/images/gomoku.png';
import './navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            toggle: false
        };
    }

    toggleMenu = () => {
        this.setState(prevState => ({
            toggle: !prevState.toggle
        }));
    }

    closeMenu = () => {
        this.setState({ toggle: false });
    }

    render() {
        const { toggle } = this.state;

        const menu_items = (
            <div className='menu_items'>
                <Link 
                    className='menu_item'
                    to='/profile'
                >
                    My Profile
                </Link>
                <Link
                    className='menu_item'
                    to='/'
                    onClick={() => this.props.auth.logoutUser()}
                >
                    Sign Out
                </Link>
            </div>
        );

        return (
            <div className='_navbar'>
                <nav className='wrapper'>
                    <Link className='logo' to='/'>
                        <img className='logo_img' src={Logo} alt='logo' />
                        Omok
                    </Link>
                    <ClickOutside handleClickOutside={this.closeMenu}>
                        {this.props.auth.user && 
                            <div className='menu'>
                                <p className='welcome'>Welcome, <b>{this.props.auth.user.username}</b></p>
                                <i 
                                    className='toggler fas fa-user-circle'
                                    onClick={this.toggleMenu}
                                ></i>
                                {toggle && menu_items}
                            </div>
                        }
                    </ClickOutside>
                </nav>
            </div>
        );
    }
}

export default Navbar;