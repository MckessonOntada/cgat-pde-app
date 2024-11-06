import React from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

export default function Typography({ children, variant }){
    return <p className={styles[variant]}>{children}</p>
}
Typography.prototype = {
    variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'subtitle-01', 'body', 'caption' ])
}

Typography.defaultProps = {
    variant: "body"
}