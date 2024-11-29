import React from "react";
import { Button } from '@mckesson/mcp-component-library';
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.scss";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.notFoundContainer}>
            <div className={styles.notFoundCard}>
                <p className={styles.heading}>404</p>
                <p>Page Not Found</p>
                <Button size="md" onClick={() => navigate(-1)} className="back-button">
                    Go Back
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
