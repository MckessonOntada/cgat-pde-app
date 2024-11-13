import React from 'react';
import Panel from '../../../../components/panel';
import styles from './TherapySelection.module.scss';
import TherapyDetails from './TherapyDetails';
import FloatingDrawer from '../../../../../../components/floating-drawer';

function TherapySelection(){
    const [open, setOpen] = React.useState(true);

    const handleOnClose = () => {
        setOpen(false);
    }
    const handleOnClick = () => {
        setOpen(true);
    }
    return (
        <div className={styles.wrapper}>
            <Panel>
                <div className={styles.summary}>
                    <div className={styles.col}>
                        <p className={styles.fieldName}>Order by Account Number</p>
                        <p className={styles.fieldValue}>11699387</p>
                    </div>
                    <div className={styles.col}>
                        <p className={styles.fieldName}>Ship to Account Number</p>
                        <p className={styles.fieldValue}>1122332</p>
                    </div>
                </div>
            </Panel>
            <Panel>
                <div className={styles.l}>
                    <p className={styles.title}>Therapy Selection</p>
                    <Panel>filterbox</Panel>
                </div>
            </Panel>
            <FloatingDrawer open={open} anchor='right' onClose={handleOnClose}>
                <TherapyDetails />
            </FloatingDrawer>
        </div>
    )
}
export default TherapySelection;