import React from 'react';
import { Stepper } from '@mckesson/mcp-component-library';
import AccountSelection from './form-segments/account-selection/AccountSelection';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import TherapySelection from './form-segments/therapy-selection';
import { useParams, useNavigate } from 'react-router-dom';
import PatientDetails from './form-segments/patient-details';
import PageHeader from '@src/components/pageHeader';
import Summary from './form-segments/summary';
import { useTranslate } from '@src/translations/useTranslation';

const formsConfig = (t) => [
    {
        name: 'accountSelection',
        label: t('labels.accountSelection'),
        form: <AccountSelection />
    },
    {
        name: 'therapySelection',
        label: t('labels.therapySelection'),
        form: <TherapySelection />
    },
    {
        name: 'patientDetails',
        label: t('labels.patientDetails'),
        form: <PatientDetails />
    },
    {
        name: 'additionalDetails',
        label: t('labels.additionalDetails'),
        form: <div>Additional Details</div>
    },
    {
        name: 'summary',
        label: t('labels.summary'),
        form: <Summary />
    },
];

const OrderCreate = () => {
    const { t } = useTranslate();
    const forms = formsConfig(t);
    const navigate = useNavigate();
    const [activeForm, setActiveForm] = React.useState(0);
    const { accountId, therapyId } = useParams();

    React.useEffect(() => {
        if (accountId && therapyId)
            setActiveForm(2)
        else if (accountId && !therapyId)
            setActiveForm(1)
        else setActiveForm(0)
    }, [accountId, therapyId]);

    const handleOnBackButtonClick = () => {
        navigate('../');
    };

    const FormToRender = forms[activeForm]?.form || (
        <div>{t('messages.formNotFound')}</div>
    );
    return (
        <div className="MCP-module-wrapper">
            <div>
                <button
                    className="MCP-Icon-Button py2"
                    onClick={handleOnBackButtonClick}
                >
                    <IconArrowLeft />
                    <p>{t('captions.btnBackToManageOrder')}</p>
                </button>
            </div>

            <PageHeader heading={t("headings.createNewOrder")} />

            <div className='MCP-module-body'>
                <Stepper
                    activeIndex={activeForm + 1}
                    dividerText="of"
                    mobileLabel={t('labels.steps')}
                    stepHeaders={forms.map(f => ({ label: f.label }))}
                />
                <div>{FormToRender}</div>
            </div>
        </div>
    )
}

export default OrderCreate;