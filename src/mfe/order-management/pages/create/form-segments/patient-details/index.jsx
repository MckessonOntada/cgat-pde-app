import React from 'react';
import styles from './PatientDetails.module.scss';
import { Button } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';

const PatientDetails = () => {
    return (
        <div className={styles.wrapper}>
            <div className="MCP-panel-container">
                <div className={styles.sect}>
                    <div className={`${styles.row}`}>
                        <div className={`${styles.col} ${styles.detailSegment}`}>
                            <div className={styles.fieldName}>Order by Account Number</div>
                            <div className={styles.fieldValue}>11699387</div>
                        </div>
                        <div className={`${styles.col} ${styles.detailSegment}`}>
                            <div className={styles.fieldName}>Ship to Account Number</div>
                            <div className={`${styles.fieldValue} ${styles.price}`}>1122332</div>
                        </div>
                        <div className={`${styles.col} ${styles.detailSegment}`}>
                            <div className={styles.fieldName}>Therapy Description</div>
                            <div className={`${styles.fieldValue} ${styles.price}`}>MPB HEMLIBRA 105MG/0.7ML SDV</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="MCP-panel-container">
                Details form
            </div>
            <ModuleHeader>
                <Button size="md" variant="secondary">Cancel</Button>
                <Button size="md" variant="primary">Save and Continue</Button>
            </ModuleHeader>
        </div>
    )
}
export default PatientDetails;