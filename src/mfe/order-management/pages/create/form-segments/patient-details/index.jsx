import React from 'react';
import styles from './PatientDetails.module.scss';
import { Button, Stepper } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import { FormList } from '../Constants';
import { useNavigate, useParams } from 'react-router-dom';
import PatientDetailsForm from './PatientDetailsForm';
import { Form, Formik } from 'formik';
import { getValidationSchema } from './PatientDetailsFormUtils';
import { ReactComponent as TickIcon } from '@src/assets/svg/yes_tick_circle_filled.svg';

const PatientDetails = () => {
  const { t } = useTranslate();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const accountDetails = {
    accountNumber: '11699387',
    shipToAccountNumber: '1122332',
    therapyDescription: 'MPB HEMLIBRA 105MG/0.7ML SDV',
    price: '$45,000'
  };

  const handleOnBackButtonClick = () => {
    //compare data change, display modal for confirmation
    navigate(`../${orderId}/accounts`);
  };

  const initialValues = {};

  const handleSubmit = (form) => {
    console.log(form, '❤');
    navigate(`../${orderId}/additional-details`);
  };

  const handleOnBack = () => {
    //compare data change, display modal for confirmation
    navigate('/orders');
  };

  const forms = FormList(t);
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={handleOnBackButtonClick}
          size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={t('headings.createNewOrder')} />

      <div className="MCP-module-body">
        <Stepper activeIndex={3} dividerText="of" mobileLabel={t('labels.steps')} stepHeaders={forms.map((f) => ({ label: f.label }))} />

        <div className={styles.wrapper}>
          <div className="MCP-panel-container">
            <div className={styles.sect}>
              <div className={`row-space-between-center`}>
                <div className={styles.row}>
                  <div className={`${styles.col} ${styles.detailSegment}`}>
                    <div className={'fieldName'}>{t('labels.therapyDescription')}</div>
                    <div className={`${'fieldValue'} ${styles.price}`}>
                      {accountDetails.therapyDescription}
                      <TickIcon />
                    </div>
                  </div>
                  <div className={`${styles.col} ${styles.detailSegment}`}>
                    <div className={'fieldName'}>{t('labels.orderByAccountNumber')}</div>
                    <div className={'fieldValue'}>{accountDetails.accountNumber}</div>
                  </div>
                </div>
                <div className={`${styles.col} ${styles.detailSegment}`}>
                  <div className={'fieldName'}>{t('labels.shipToAccountNumber')}</div>
                  <div className={`${'fieldValue'} ${styles.price}`}>{accountDetails.shipToAccountNumber}</div>
                </div>
                <div className={`${styles.col} ${styles.detailSegment}`}>
                  <div className={'fieldName'}>{t('labels.priceDetails')}</div>
                  <div className={`${'fieldValue'} ${styles.price}`}>{accountDetails.price}</div>
                </div>
              </div>
            </div>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={getValidationSchema(t)}
            enableReinitialize
            onSubmit={(values, actions) => {
              handleSubmit(values);
              actions.setSubmitting(false);
            }}>
            {({ values, isValid, dirty }) => {
              const isButtonDisabled = !(dirty && isValid);

              return (
                <Form>
                  <div className={styles.wrapper}>
                    <div className="MCP-panel-container">
                      <PatientDetailsForm />
                    </div>
                    <ModuleHeader
                      controls={
                        <div className="controls">
                          <Button size="md" variant="secondary" onClick={handleOnBack}>
                            {t('captions.btnBack')}
                          </Button>
                          <Button size="md" variant="primary" disabled={isButtonDisabled} type="submit">
                            {t('captions.btnSaveAndContinue')}
                          </Button>
                        </div>
                      }
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};
export default PatientDetails;
