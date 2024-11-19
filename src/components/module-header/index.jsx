import React from 'react';
import PropTypes from 'prop-types';
import styles from './ModuleHeader.module.scss';

const ModuleHeader = ({ heading, controls, className=''}) => {
    return (
        <div className={`${styles.headerSegment} ${className}`}>
           <div>{heading}</div>
           <div>{controls}</div>
        </div>
    );
};

ModuleHeader.propTypes = {
    heading: PropTypes.node,
    controls: PropTypes.node,
};

export default ModuleHeader;