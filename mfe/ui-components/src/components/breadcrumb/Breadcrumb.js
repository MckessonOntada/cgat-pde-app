import React from 'react';
import PropTypes from 'prop-types';
import { FaAngleRight } from "react-icons/fa6";
import './assets/style.scss'
import Link from '../link';

const Breadcrumbs = ({ items }) => {
    return (
        <nav aria-label="breadcrumb">
            <ol className={"breadcrumb"}>
                {items.map((item, index) => (
                    <li key={index} className={"breadcrumb-item"}>
                        {index !== 0 && <span className={"separator"}> <FaAngleRight /> </span>}
                        {item.url ? (
                            <Link to={item.url}>{item.label}</Link>
                        ) : (
                            <span>{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

Breadcrumbs.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            link: PropTypes.string
        })
    ).isRequired
};

export default Breadcrumbs;
