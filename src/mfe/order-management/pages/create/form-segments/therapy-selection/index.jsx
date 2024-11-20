import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import styles from './TherapySelection.module.scss';
import TherapyDetails from './TherapyDetails';
import FloatingDrawer from '@src/components/floating-drawer';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate } from 'react-router-dom';

const DetailField = ({ label, value, className }) => (
    <div className={className}>
        <p className={'fieldName'}>{label}</p>
        <p className={'fieldValue'}>{value}</p>
    </div>
);

function TherapySelection(){
    const { t } = useTranslate();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const handleOnClose = () => {
        setOpen(false);
    }
    return (
        <div className={styles.wrapper}>
            <div className="MCP-panel-container">
                <div className={styles.row}>
                    <div className={styles.col}>
                        <p className={'fieldName'}>{t('labels.orderByAccountNumber')}</p>
                        <p className={'fieldValue'}></p>
                    </div>
                    <div className={styles.col}>
                        <p className={'fieldName'}>{t('labels.shipToAccountNumber')}</p>
                        <p className={'fieldValue'}></p>
                    </div>
                </div>
            </div>
            <div className="MCP-panel-container">
                    <p className={styles.title}>{t('labels.therapySelection')}</p>
                    <div className="MCP-panel-container"></div>
            </div>
            <ModuleHeader
                controls={
                    <div className='controls'>
                        <Button size="md" variant="secondary">{t('captions.btnCancel')}</Button>
                        <Button 
                            size="md"
                            variant="primary" 
                            onClick={() => navigate('987343')}
                        >{t('captions.btnSaveAndContinue')}</Button>
                    </div>
                }
            />
            <FloatingDrawer open={open} anchor='right' onClose={handleOnClose}>
                <TherapyDetails onClose={handleOnClose} />
            </FloatingDrawer>
        </div>
    )
}
export default TherapySelection;