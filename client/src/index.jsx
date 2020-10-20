import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import App from './App';
import './constants/globals.css';
import './constants/colors.css';
import './constants/fonts.css';

ReactDOM.render(
    <Router>
        <App />
    </Router>
    , document.getElementById('root')
);