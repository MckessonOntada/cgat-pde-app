import React from 'react';
import { Button, Stepper, Heading, Required } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate, useParams } from 'react-router-dom';
import { FormList } from '../Constants';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import DetailSegment from '@src/components/DetailSegment';
import { Field, Form, Formik } from 'formik';
import { getFormFields } from './fields';
import * as Yup from 'yup';
import OrderService from '@src/api/commonService/OrderService';
import { useMutation } from 'react-query';
import { useManageOrder } from '@src/mfe/order-management/context/ManageOrderContext';
import OrderHeaderDetails from '../OrderHeaderDetails';

const getValidationSchema = (t) =>
  Yup.object({
    coiId: Yup.number().required(t('COI Id is required')).min(1, ''),
    orderQuantity: Yup.number().required('Order Quantity is required').min(1, ''),
    slotNumber: Yup.string().required('Slot number is required').min(1, '').max(20, 'Slot Number can not be greater than 20'),
    poNumber: Yup.number().required('PO number is required').min(1, '').max(35, 'PO Number can not be greater than 20')
  });

function AdditionalDetails() {
  const initialValues = {
    coiId: '',
    orderQuantity: '',
    slotNumber: '',
    poNumber: '',
    dateOfAdministration: ''
  };
  const { t } = useTranslate();
  const formFields = getFormFields(t);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { formState, setActiveRecord } = useManageOrder();

  const { isLoading: isSaving, mutate: saveAdditionalDetails } = useMutation(
    async (data) => OrderService.saveAdditionalDetails(orderId, data),
    {
      onSuccess: (result) => {
        const { id } = result;
        setActiveRecord(result);
        navigate(`../${id}/summary`);
      },
      onError: console.log
    }
  );

  const handleOnBack = () => {
    //compare data change, display modal for confirmation
    navigate(`../${orderId}/patient`);
  };

  const handleOnSubmit = (values) => {
    const payload = {
      orderQuantity: values.orderQuantity,
      slotNumber: values.slotNumber,
      poNumber: values.poNumber,
      dateOfAdministration: values.dateOfAdministration,
      patientConsentTaken: true
    };

    saveAdditionalDetails(payload);
  };

  const handleOnBackToOrders = () => {
    //compare data change, display modal for confirmation
    navigate('/orders');
  };

  const forms = FormList(t);
  const { therapy, accountDetails, patient, orderCost } = formState.activeRecord || {};
  const validationSchema = getValidationSchema(t);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={t('headings.createNewOrder')} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleOnSubmit(values);
        }}>
        {() => {
          return (
            <Form>
              <div className="MCP-module-body">
                <Stepper
                  activeIndex={4}
                  dividerText="of"
                  mobileLabel={t('labels.steps')}
                  stepHeaders={forms.map((f) => ({ label: f.label }))}
                />
                {/* <div className="MCP-panel-container">
                  <div className={`grid grid-gap-24 grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5`}>
                    <DetailSegment label={t('labels.therapyDescription')} value={therapy?.materialDescription} />
                    <DetailSegment label={t('labels.orderByAccountNumber')} value={'Order by Account Number'} />
                    <DetailSegment label={t('labels.shipToAccountNumber')} value={accountDetails?.shipToAccount?.accountNumber} />
                    <DetailSegment label={t('labels.patientName')} value={patient?.firstName} />
                    <DetailSegment label={t('labels.price')} value={orderCost || '--'} />
                  </div>
                </div> */}
                <OrderHeaderDetails />
                <div className="MCP-panel-container">
                  <div className="row-space-between-center">
                    <Heading as="h3">{t('labels.additionalDetails')}</Heading>
                    <p className="form-instruction">
                      <Required id="Required" /> {t('labels.required')}
                    </p>
                  </div>
                  <div className="grid grid-gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    {formFields.map((field, index) => (
                      <Field
                        key={index}
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        isRequired={field.isRequired}
                        component={field.component}
                        maxLength={field.maxLength}
                      />
                    ))}
                  </div>
                </div>
                <div className="controls">
                  <Button size="md" variant="secondary" onClick={handleOnBack}>
                    {t('captions.btnBack')}
                  </Button>
                  <Button size="md" variant="primary" type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving' : t('captions.btnSaveAndContinue')}
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default AdditionalDetails;
