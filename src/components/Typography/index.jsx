import React from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

export default function Typography({ children, variant }){
    return <p className={styles[variant]}>{children}</p>
}
Typography.prototype = {
    variant: PropTypes.oneOf(['title-01', 'title-02', 'title-03', 'title-04', 'subtitle-01', 'body', 'caption' ])
}

Typography.defaultProps = {
    variant: "body"
}