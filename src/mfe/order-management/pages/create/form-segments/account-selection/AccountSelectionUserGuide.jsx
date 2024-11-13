import React from 'react';
import styles from './AccountSelectionUserGuide.module.scss';
import Panel from '../../../../components/panel';
import { RadioGroup, Button } from '@mckesson/mcp-component-library';
import { ReactComponent as IconClose } from '@src/assets/svg/closeicon.svg';
import initialAccountsData from './../../__mock__';
import AccountCard from './AccountCard';

const AccountSelctionUserGuide = ({ onClose }) => {
    const options = initialAccountsData.slice(0,2);
    const [account, setAccount] = React.useState(null);
    const handleOnChange = (account) => {
        setAccount(account);
    } 
    return (
        <div className={styles.wrapper}>
            <div className={styles.drawerContent}>
                <div className={styles.topSect}>
                    <div className={styles.header}>
                        <h6>Need assistance with selecting an account?</h6>
                        <button onClick={onClose}><IconClose /></button>
                    </div>
                    <Panel>
                        <div className={styles.selectionBlock}>
                            <p>Are you here to order through any of the below programs?</p>
                            <div>
                                <RadioGroup
                                    direction="row"
                                    id="radioGroup + 0.4533187688543612 + 0.4823344741009439"
                                    items={["3PL", "SD", "All"].map(v => ({
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
                        </div>
                    </Panel>
                    <Panel>
                        <div className={styles.selectionBlock}>
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
                        </div>
                    </Panel>

                    <AccountCard options={options} onChange={handleOnChange} />
                </div>

                <div className={styles.controls}>
                    <Button
                        label="Cancel"
                        onClick={onClose}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        label="Select"
                        onClick={() => onsubmit(account)}
                        variant="primary"
                        disabled={!account}
                    >
                        Select
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AccountSelctionUserGuide;