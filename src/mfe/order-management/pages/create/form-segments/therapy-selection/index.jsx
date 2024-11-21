import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import styles from './TherapySelection.module.scss';
import TherapyDetails from './TherapyDetails';
import FloatingDrawer from '@src/components/floating-drawer';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate } from 'react-router-dom';
import TherapyDataTable from './TherapyDataTable';
import { TherapyProvider } from '../../../../context/TherapyContext';

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
                    <ModuleHeader
                        heading={<p className='secondaryHeading'>{t('labels.therapySelection')}</p>}
                    />
                    <TherapyProvider>
                        <TherapyDataTable />
                    </TherapyProvider>
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