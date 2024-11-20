import React from 'react';
import { Dropdown, Button } from '@mckesson/mcp-component-library';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AccountSelection.module.scss'
import FloatingDrawer from '@src/components/floating-drawer';
import AccountsTable from './AccountTable';
import AccountSelectionUserGuide from './AccountSelectionUserGuide';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';

const AccountSelection = () => {
    const { t } = useTranslate();
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
        <div className={`MCP-module-wrapper`}>
                <div className='MCP-panel-container'>
                    <div className={`MCP-module-body`}>
                        <ModuleHeader heading={<p className='secondaryHeading'>{t('labels.accountSelection')}</p>} />
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
                                    <Link to="#" onClick={handleOnClick}>{t('labels.needAssistanceSelectingAccount')}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="MCP-module-body">
                        <ModuleHeader
                            heading={<p className='secondaryHeading'>{t('headings.shippingAddress')}</p>}
                        />
                        <div className='MCP-panel-container'>
                            
                        </div>
                        <div className="MCP-table-wrapper">
                            <AccountsTable />
                        </div>
                    </div>
                    <div className='controls'>
                        <Button
                            size="md"
                            onClick={() => navigate('../')}
                            variant="secondary"
                        >
                            {t('captions.btnCancel')}
                        </Button>
                        <Button
                            size="md"
                            onClick={() => navigate('32151')}
                            variant="primary"
                        >
                            {t('Save and Continue')}
                        </Button>
                    </div>
                </div>
                <FloatingDrawer open={open} anchor='right' onClose={handleOnClose}>
                    <AccountSelectionUserGuide onSubmit={handleOnSubmit} onClose={handleOnClose} />
                </FloatingDrawer>
        </div>
    )
}

export default AccountSelection