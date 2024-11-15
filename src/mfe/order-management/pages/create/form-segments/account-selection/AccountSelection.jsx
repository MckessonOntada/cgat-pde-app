import React from 'react';
import Panel from '../../../../components/panel';
import { Dropdown, Button } from '@mckesson/mcp-component-library';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AccountSelection.module.scss'
import FloatingDrawer from '@src/components/floating-drawer';
import AccountsTable from './AccountTable';
import AccountSelctionUserGuide from './AccountSelectionUserGuide';

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
                <Panel>
                    <div className={styles.sect}>
                        <p className={styles.sectionHeading}>Account Selction</p>
                        <Panel>
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
                        </Panel>
                    </div>
                    <div className={styles.sect}>
                        <p className={styles.sectionHeading}>Shipping Address</p>
                        <Panel>
                            filters
                        </Panel>
                        <AccountsTable />
                    </div>
                </Panel>
                <FloatingDrawer open={open} anchor='right' onClose={handleOnClose}>
                    <AccountSelctionUserGuide onSubmit={handleOnSubmit} onClose={handleOnClose} />
                </FloatingDrawer>

                <div className={styles.formControls}>
                    <Button
                        label="Cancel"
                        onClick={() => navigate('../')}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        label="Save and Continue"
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