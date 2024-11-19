import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import styles from './TherapySelection.module.scss';
import TherapyDetails from './TherapyDetails';
import FloatingDrawer from '@src/components/floating-drawer';
import ModuleHeader from '@src/components/module-header';

function TherapySelection(){
    const [open, setOpen] = React.useState(false);

    const handleOnClose = () => {
        setOpen(false);
    }
    return (
        <div className={styles.wrapper}>
            <div className="MCP-panel-container">
                <div className={styles.row}>
                    <div className={styles.col}>
                        <p className={'fieldName'}>Order by Account Number</p>
                        <p className={'fieldValue'}>11699387</p>
                    </div>
                    <div className={styles.col}>
                        <p className={'fieldName'}>Ship to Account Number</p>
                        <p className={'fieldValue'}>1122332</p>
                    </div>
                </div>
            </div>
            <div className="MCP-panel-container">
                <div className={styles.l}>
                    <p className={styles.title}>Therapy Selection</p>
                    <div className="MCP-panel-container">filterbox</div>
                </div>
            </div>
            <ModuleHeader>
                <Button size="md" variant="secondary">Cancel</Button>
                <Button size="md" variant="primary">Save and Continue</Button>
            </ModuleHeader>
            <FloatingDrawer open={open} anchor='right' onClose={handleOnClose}>
                <TherapyDetails onClose={handleOnClose} />
            </FloatingDrawer>
        </div>
    )
}
export default TherapySelection;