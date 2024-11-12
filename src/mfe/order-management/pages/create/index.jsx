import React from 'react';
import { Stepper } from '@mckesson/mcp-component-library';
import styles from './CreateOrder.module.scss';
import AccountSelection from './form-segments/AccountSelection';
import {ReactComponent as IconArrowLeft} from '@src/assets/svg/arrow-left.svg';

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
            form: <div>Theraphy Selection</div>
        },
        {
            name: 'patientDetails',
            label: 'Patient Details',
            form: <div>Patient Details</div>
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
    ]
    const [activeForm, setActiveForm] = React.useState(0);
    const FormToRender = forms[activeForm].form;
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <button className={styles.iconButton}>
                        <IconArrowLeft />
                        <span>
                            Back to orders
                        </span>
                    </button>
                </div>
                <p className={styles.title}>Create New Order</p>
            </div>
            <Stepper
                activeIndex={activeForm + 1}
                dividerText="of"
                mobileLabel="Steps"
                stepHeaders={forms.map(f => ({ label: f.label }))}
            />
            <div className={styles.formWrapper}>
                {FormToRender}
            </div>
        </div>
    )
}

export default OrderCreate;