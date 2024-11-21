import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import styles from './TherapySelection.module.scss';
import TherapyDetails from './TherapyDetails';
import FloatingDrawer from '@src/components/floating-drawer';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation, useNavigate } from 'react-router-dom';
import TherapyDataTable from './TherapyDataTable';
import { TherapyProvider } from '../../../../context/TherapyContext';
import FilterPanel from './FilterPanel';

const DetailField = ({ label, value, className }) => (
    <div className={className}>
        <p className={'fieldName'}>{label}</p>
        <p className={'fieldValue'}>{value}</p>
    </div>
);

function TherapySelection() {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const therapyDetails = searchParams.get('therapy-details');
    const handleOnClose = () => {
        searchParams.delete('therapy-details');
        navigate({
            pathname: '',
            search: searchParams.toString() ? `?${searchParams.toString()}` : '',
        });
    }
    return (
        <TherapyProvider>
            <div className={styles.wrapper}>
                <div className="MCP-panel-container">
                    <ModuleHeader
                        heading={<p className='secondaryHeading'>{t('labels.therapySelection')}</p>}
                    />
                    <FilterPanel />
                    <TherapyDataTable />
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
                {
                    therapyDetails && <FloatingDrawer open={true} anchor='right' onClose={handleOnClose}>
                        <TherapyDetails therapyId={therapyDetails} onClose={handleOnClose} />
                    </FloatingDrawer>
                }
            </div>
        </TherapyProvider>
    )
}
export default TherapySelection;