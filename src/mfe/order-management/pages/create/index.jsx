import React from 'react';
import { Stepper } from '@mckesson/mcp-component-library';
import styles from './CreateOrder.module.scss';
import AccountSelection from './form-segments/account-selection/AccountSelection';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import TherapySelection from './form-segments/therapy-selection';
import { useParams, useNavigate } from 'react-router-dom';
import PatientDetails from './form-segments/patient-details';
import PageHeader from '../../../../components/pageHeader';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

const OrderCreate = () => {
    const forms = [
        {
            name: 'accountSelection',
            label: 'Account Selection',
            form: <AccountSelection />
        },
        {
            name: 'theraphySelection',
            label: 'Theraphy Selection',
            form: <TherapySelection />
        },
        {
            name: 'patientDetails',
            label: 'Patient Details',
            form: <PatientDetails />
        },
        {
            name: 'additionalDetails',
            label: 'Additional Details',
            form: <div>Additional Details</div>
        },
        {
            name: 'summary',
            label: 'Summary',
            form: <div>summary</div>
        },
    ];
    const navigate = useNavigate();
    const [activeForm, setActiveForm] = React.useState(0);
    const { accountId, therapyId } = useParams();
    React.useEffect(() => {
        if (accountId && therapyId)
            setActiveForm(2)
        else if (accountId && !therapyId)
            setActiveForm(1)
        else setActiveForm(0)
    }, []);

    const FormToRender = forms[activeForm]?.form;
    const handleOnBackButtonClick = () => {
        navigate('../')
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                {/* <button className={styles.iconButton} onClick={handleOnBackButtonClick}>
                    <IconArrowLeft />
                    <span>
                        Back to orders
                    </span>
                </button> */}
                <div
                    className="MCP-Icon-Button py2"
                    onClick={handleOnBackButtonClick}
                >
                    <MdOutlineKeyboardArrowLeft />
                    <p>Back to Manage Users</p>
                </div>
            </div>
            <PageHeader
                title={"Create New Order"}
            />
            <div className={styles.stepper}>
                <Stepper
                    activeIndex={activeForm + 1}
                    dividerText="of"
                    mobileLabel="Steps"
                    stepHeaders={forms.map(f => ({ label: f.label }))}
                />
            </div>

            <div>
                {FormToRender}
            </div>
        </div>
    )
}

export default OrderCreate;