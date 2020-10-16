import React from 'react';

import './alert.css';

function Alert(props) {
    const { type, message } = props;

    return (
        <div className='_alert'>
            <p className={type}>
                {message}
            </p>
        </div>
    );
}

export default Alert;