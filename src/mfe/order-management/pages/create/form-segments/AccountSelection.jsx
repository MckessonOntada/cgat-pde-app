import React from 'react';
import Panel from "../../../components/panel";
import { Dropdown, RadioGroup, Button } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import styles from './../CreateOrder.module.scss'
import { ReactComponent as IconClose } from '@src/assets/svg/closeicon.svg';
import FloatingDrawer from '@src/components/floating-drawer';
import AccountsTable from './AccountTable';

const AccountSelection = () => {
    const [open, setOpen] = React.useState(false);
    const handleOnClose = () => {
        setOpen(false);
    }
    const handleOnClick = () => {
        setOpen(true);
    }
    return (
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
                <div className={styles.drawerContent}>
                    <div className={styles.topSect}>
                        <div className={styles.header}>
                            <h6>Need assistance with selecting an account?</h6>
                            <button onClick={handleOnClose}><IconClose /></button>
                        </div>
                        <Panel>
                            <p>Are you here to order through any of the below programs?</p>
                            <div>
                                <RadioGroup
                                    direction="row"
                                    id="radioGroup + 0.4533187688543612 + 0.4823344741009439"
                                    items={["WAC", "GOV", "340B"].map(v => ({
                                        label: v,
                                        value: v,
                                    }))}
                                    onChangeValue={() => { }}
                                    onOtherTextChange={() => { }}
                                    onSubRadioFieldChange={() => { }}
                                    radioBtnWidth="auto"
                                    value="option1"
                                />
                            </div>
                        </Panel>
                    </div>

                    <div className={styles.formControls}>
                        <Button
                            label="Cancel"
                            onClick={() => { }}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            label="Select"
                            onClick={() => { }}
                            variant="primary"
                        >
                            Select
                        </Button>
                    </div>
                </div>
            </FloatingDrawer>

            <div className={styles.formControls}>
                <Button
                    label="Cancel"
                    onClick={() => { }}
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
    )
}


export default AccountSelection