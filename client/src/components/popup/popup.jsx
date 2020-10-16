import React from 'react';

import './popup.css';

function PopUp(props) {
    const { 
        when, 
        message, 
        acceptText, 
        rejectText, 
        onAccept, 
        onReject
    } = props;

    if(when) {
        return (
            <div className='_popup'>
                <div className='card'>
                    <p className='message'>{message}</p>
                    <div className='button_group'>
                        <button className='button accept' onClick={onAccept}>
                            {acceptText}
                        </button>
                        {rejectText && onReject &&
                            <button className='button reject' onClick={onReject}>
                                {rejectText}
                            </button>
                        }   
                    </div>
                </div>
            </div>
        );
    }
    else {
        return null;
    }
}

export default PopUp;