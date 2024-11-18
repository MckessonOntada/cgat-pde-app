import React from 'react';
import PropTypes from 'prop-types';
import styles from './PageHeader.module.scss';

const ModuleHeader = ({ heading, controls, className=''}) => {
    return (
        <div className={`${styles.headerSegment} ${className}`}>
           <div>{heading}</div>
           <div>{controls}</div>
        </div>
    );
};

ModuleHeader.propTypes = {
    heading: PropTypes.string.isRequired,
    subheading: PropTypes.string,
    children: PropTypes.node,
};

export default ModuleHeader;