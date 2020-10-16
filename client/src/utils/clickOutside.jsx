import React, { useRef, useEffect } from 'react';

function ClickOutside(props) {
    const { handleClickOutside, children } = props;
    const wrapperRef = useRef(null);

    useEffect(() => {
        function clickedOutside(event) {
            if(wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                handleClickOutside();
            }
        }

        document.addEventListener('mousedown', clickedOutside);
        return () => {
            document.removeEventListener('mousedown', clickedOutside);
        };
    }, [wrapperRef, handleClickOutside]);

    return <div ref={wrapperRef}>{children}</div>
}

export default ClickOutside;