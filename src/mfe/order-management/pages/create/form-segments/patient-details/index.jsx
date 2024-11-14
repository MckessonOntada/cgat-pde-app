import React from 'react';
import styles from './PatientDetails.module.scss';
import Panel from '../../../../components/panel';
import { Button } from '@mckesson/mcp-component-library';

const PatientDetails = () => {
    return (
        <div className={styles.wrapper}>
            <Panel>
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
            </Panel>
            <Panel>
                Details form
            </Panel>
            <div className={styles.controls}>
                <Button variant="secondary">Cancel</Button>
                <Button variant="primary">Save and Continue</Button>
            </div>
        </div>
    )
}
export default PatientDetails;