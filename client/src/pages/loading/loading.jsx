import React from 'react';

import './loading.css';

function Loading() {
    return (
        <div className='_loading'>
            <div className='loading'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <p className='text'>Loading game . . .</p>
        </div>
    );
}

export default Loading;