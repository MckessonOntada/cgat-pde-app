import React from 'react';
import { Button, Stepper } from '@mckesson/mcp-component-library';
import styles from './TherapySelection.module.scss';
import TherapyDetails from './TherapyDetails';
import FloatingDrawer from '@src/components/floating-drawer';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TherapyDataTable from './TherapyDataTable';
import { TherapyProvider } from '../../../../context/TherapyContext';
import FilterPanel from './FilterPanel';
import { FormList } from '../Constants';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import { useMutation } from 'react-query';

const DetailField = ({ label, value, className }) => (
    <div className={className}>
        <p className={'fieldName'}>{label}</p>
        <p className={'fieldValue'}>{value}</p>
    </div>
);

function TherapySelection() {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const { orderId } = useParams();
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

    const { mutate } = useMutation(
        async (data) => {
            const res = await Promise.resolve({ id: Math.floor(Math.random() * (1000 - 100 + 1)) + 100 });
            return res;
        },
        {
            onSuccess: ({ id }) => navigate(`../${id}/account-selection`),
            onError: console.log
        }
    )

    const handleOnClick = () => {
        mutate();
    }

    const handleOnBackButtonClick = () => {
        //compare data change, display modal for confirmation
        navigate('/orders');
    };

    const handleOnCancel = () => {
        //compare data change, display modal for confirmation
        navigate('/orders');
    }

    const forms = FormList(t);

    return (
        <div className="MCP-module-wrapper">
            <div>
                <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackButtonClick} size="md">
                    {t('captions.btnBackToManageOrder')}
                </Button>
            </div>

            <PageHeader heading={t("headings.createNewOrder")} />

            <div className='MCP-module-body'>
                <Stepper
                    activeIndex={1}
                    dividerText="of"
                    mobileLabel={t('labels.steps')}
                    stepHeaders={forms.map(f => ({ label: f.label }))}
                />
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
                                    <Button size="md" variant="secondary" onClick={handleOnCancel}>{t('captions.btnCancel')}</Button>
                                    <Button
                                        size="md"
                                        variant="primary"
                                        type="submit"
                                        onClick={handleOnClick}
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
            </div>
        </div>
    )
}
export default TherapySelection;