import React from 'react';
import { Button, Heading, CheckboxGroup, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import { RoutePaths } from '@src/routes/constants';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { prescriptionAndSignatureSection } from './finalize-config';
import { Field, Form, Formik } from 'formik';
import { getPrescriptionAndSignatureInitialValues, getPrescriptionAndSignatureSchema } from './validation-schema';
import Components from '@src/components/form/Components';
import useOrder from '../../../orders/useOrder';
import { useMutation } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';
import Alert from '@src/components/cgat-alert/Alert';
import styles from './FinalizeOrder.module.scss';
import AuthUtils from '@src/util/AuthUtils';
import { useWidgetContext } from '@src/context/WidgetContext';

function FinalizeOrder() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [alert, setAlert] = React.useState(null);
  const { state: locationState = {} } = useLocation();
  const { orderId } = useParams();
  const { state } = useWidgetContext();
  const { orderDetails = {} } = state;
  const isPhysician = AuthUtils.isPhysician();

  const initialValues = {
    ...getPrescriptionAndSignatureInitialValues,
    ...orderDetails.spTherapyConfig,
    drugName: orderDetails?.therapy?.materialDescription || '',
    strength: `${orderDetails?.therapy?.strength || ''} ${orderDetails?.therapy?.dosage || ''}`.trim()
  };

  const [consentCheckboxOption, setConsentCheckboxOption] = React.useState({
    isDisabled: false,
    isChecked: false,
    label: t('labels.consent'),
    value: false
  });

  const handleOnConsent = (setErrors, errors, setFieldValue, setFieldTouched) => {
    const updatedOptions = {
      ...consentCheckboxOption,
      isChecked: !consentCheckboxOption.isChecked
    };
    if (errors && errors.consentCheckboxOption) {
      const { consentCheckboxOption, ...newErrors } = errors;
      setErrors(newErrors);
    }
    setFieldValue('reviewConsent', updatedOptions.isChecked);
    setConsentCheckboxOption(updatedOptions);
  };

  const handleOnBackToOrders = () => {
    const prevSearch = locationState?.__prevSearch || '';
    navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
  };

  const handleOnSubmit = (values) => {
    const { quantity, daysSupply, refills, instructions, prescriberName } = values;
    const payload = {
      quantity,
      daysSupply,
      refills,
      instructions,
      prescriberName
    };
    finalizeOrder(payload);
  };

  const { isLoading: isSaving, mutate: finalizeOrder } = useMutation(async (payload) => await OrderService.finalizeOrder(orderId, payload), {
    onSuccess: (_result) => {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/status`, { state: { ...locationState } });
    },
    onError: (error) => {
      const statusCode = error?.response?.status;
      let description = t('error.default');
      if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);
      setAlert({
        description,
        type: 'error'
      });
    },
    retry: false
  });

  return (
    <div className="MCP-module-wrapper">
      {isSaving && <Loader type={'screen'} />}
      <React.Fragment>
        <div>
          <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
            {t(isPhysician ? 'captions.btnBackToPrescriptions' : 'captions.btnBackToManageOrder')}
          </Button>
        </div>

        <PageHeader heading={t('captions.btnFinalizePrescription')} />
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        <Formik
          initialValues={initialValues}
          validationSchema={getPrescriptionAndSignatureSchema(t)}
          enableReinitialize={true}
          onSubmit={(values) => handleOnSubmit(values)}>
          {({ values, setFieldValue, setErrors, errors, touched }) => {
            return (
              <Form>
                <div className="MCP-module-body">
                  <div className="MCP-CardContainer">
                    <div className="MCP-form">
                      {prescriptionAndSignatureSection.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="form-section">
                          <div className={'row-space-between-center'}>
                            <div className="headingBox firstHeading">
                              <Heading as="h3">{t(section.title)}</Heading>
                              <p className="form-instruction">
                                <span className="required">* </span> {t('labels.required')}
                              </p>
                            </div>
                          </div>
                          {section.rows.map((row, rowIndex) => (
                            <div key={rowIndex} className="form-control-row">
                              <div key={rowIndex} className={`${row.grid}`}>
                                {row.controls.map((field, fieldIndex) => (
                                  <div key={`field-${fieldIndex}`}>
                                    <Field
                                      id={field.name}
                                      name={field.name}
                                      label={t(field.label)}
                                      placeholder={field.placeholder || ''}
                                      maxLength={field.maxLength}
                                      isRequired={field.isRequired}
                                      component={Components[field.type]}
                                      isReadOnly={field.readOnly}
                                      {...(field.type === 'textarea'
                                        ? {
                                            fieldlabel: t(field.label),
                                            maxCharHelperText: t('forms.placeholder.max_5000_chars'),
                                            maxCharLimit: 5000,
                                            maxCharWarningLimit: 4900
                                          }
                                        : {})}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          <hr className="form-section-separator secondryTitle" />
                          <div className={'row-space-between-center'}>
                            <div className="headingBox firstHeading">
                              <Heading as="h3">{t('labels.signature')}</Heading>
                              <p className="form-instruction">
                                <span className="required">* </span> {t('labels.required')}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline">
                            <Field
                              id="prescriberName"
                              name="prescriberName"
                              label={t('labels.prescriberName')}
                              placeholder=" "
                              isRequired
                              component={Components['input']}
                              maxLength={50}
                            />
                          </div>
                          <div className={styles.consentWrapper}>
                            <CheckboxGroup
                              id="reviewConsent"
                              s
                              name="reviewConsent"
                              items={[
                                {
                                  ...consentCheckboxOption,
                                  onChange: () => handleOnConsent(setErrors, errors, setFieldValue)
                                }
                              ]}
                              error={touched.reviewConsent && !!errors.reviewConsent}
                              errorMessage={touched.reviewConsent && errors.reviewConsent}
                              size="md"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="footer-wrapper">
                    <div className="controls footer-controls">
                      <Button size="md" variant="secondary" onClick={handleOnBackToOrders}>
                        {t('captions.btnCancel')}
                      </Button>
                      <Button size="md" variant="primary" type="submit">
                        {t('captions.btnFinalizePrescription')}
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </React.Fragment>
    </div>
  );
}

export default FinalizeOrder;
