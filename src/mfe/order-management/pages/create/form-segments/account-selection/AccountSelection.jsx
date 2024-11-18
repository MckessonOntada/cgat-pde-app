import React from 'react';
import { Dropdown, Button } from '@mckesson/mcp-component-library';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AccountSelection.module.scss'
import FloatingDrawer from '@src/components/floating-drawer';
import AccountsTable from './AccountTable';
import AccountSelctionUserGuide from './AccountSelectionUserGuide';
import ModuleHeader from '@src/components/module-header';

const options = [
    { label: "Option 1", value: "option1", description: "This is option 1" },
    { label: "Option 2", value: "option2", description: "This is option 2" },
    { label: "Option 3", value: "option3", description: "This is option 3" },
];

const AccountSelection = () => {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleOnClose = () => {
        setOpen(false);
    }
    const handleOnClick = () => {
        setOpen(true);
    }
    const handleOnSubmit = (account) => {
        console.log(account);
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.formSegment}>
                <div className='MCP-panel-container'>
                    <div className={styles.sect}>
                        {/* <ModuleHeader variant={"l2"} heading={'Account Selction'} /> */}
                        <p className='secondaryHeading'>Account Selection</p>
                        <div className='MCP-panel-container'>
                            <div className={styles.account}>
                                <div className={styles.accountDetails}>
                                    <p className={styles.name}><b>Revisions Aesthetics Group</b></p>
                                    <p className={styles.address}>6567 S Elizabeth Way, Centennial, CO, 80121</p>
                                </div>
                                <div className={styles.controls}>
                                    <div className={styles.controlWrapper}>
                                        <Dropdown />
                                    </div>
                                    <Link to="#" onClick={handleOnClick}>Need assistance with selecting an account?</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.sect}>
                        {/* <ModuleHeader variant={"l2"} heading={'Shipping Address'} /> */}
                        <p className='secondaryHeading'>Shipping Address</p>
                        <div className='MCP-panel-container'>
                            filters
                        </div>
                        <AccountsTable />
                    </div>
                </div>
                <FloatingDrawer open={open} anchor='right' onClose={handleOnClose}>
                    <AccountSelctionUserGuide onSubmit={handleOnSubmit} onClose={handleOnClose} />
                </FloatingDrawer>
                <div className='controls'>
                    <Button
                        size="md"
                        onClick={() => navigate('../')}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        size="md"
                        onClick={() => { }}
                        variant="primary"
                    >
                        Save and Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AccountSelection