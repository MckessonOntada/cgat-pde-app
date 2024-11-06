import React, { useState, useEffect, useRef } from 'react';


const ToggleUI = ({ children, in: inProp, timeout = 300 }) => {
    const [height, setHeight] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.scrollHeight + 24);
        }
    }, [children]);

    useEffect(() => {
        if (inProp) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [inProp]);

    return (
        <div
            className="collapse-panel"
            style={{
                height: isOpen ? `${height}px` : '0px',
                overflow: 'hidden',
                transition: `height ${timeout}ms ease-in-out`,
            }}
        >
            <div style={{ boxSizing: "content-box" }} ref={contentRef}>{children}</div>
        </div>
    );
};

export default ToggleUI;