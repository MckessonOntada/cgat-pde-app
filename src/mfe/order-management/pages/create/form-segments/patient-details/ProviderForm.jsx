import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { getProviderSchema, INITIAL_VALUES_FOR_PROVIDER } from '@src/mfe/core-config/admin/manage-providers/forms/provider.schema';
import { sections } from '@src/mfe/core-config/admin/manage-providers/forms/provider.config';
import { Formik, Form } from 'formik';
import FormRenderer from '@src/mfe/core-config/admin/manage-providers/forms/FormRenderer';
import { useTranslate } from '@src/translations/useTranslation';
import styles from './PatientDetails.module.scss';
import ProviderService from '@src/api/commonService/ProviderService';
import Alert from '@src/components/cgat-alert/Alert';

const transformProviderData = (providerData) => ({
  firstName: providerData?.name?.firstName || '',
  middleName: providerData?.name?.middleName || '',
  lastName: providerData?.name?.lastName || '',
  deaNumber: providerData?.dea || '',
  npiNumber: providerData?.npi || '',
  tinNumber: providerData?.tin || '',
  medicaidNumber: providerData?.medicaidNumber || '',
  licenseState: providerData?.licenseState || '',
  address1: providerData?.address?.address1 || '',
  address2: providerData?.address?.address2 || '',
  city: providerData?.address?.city || '',
  zip: providerData?.address?.zip || '',
  state: providerData?.address?.state || '',
  email: providerData?.email || '',
  phoneNumber: providerData?.phone || '',
  fax: providerData?.fax || ''
});

const transformPayloadForAPI = (values) => ({
  name: {
    firstName: values.firstName,
    middleName: values.middleName,
    lastName: values.lastName
  },
  dea: values.deaNumber || null,
  npi: values.npiNumber,
  tin: values.tinNumber,
  medicaidNumber: values.medicaidNumber || null,
  licenseState: values.licenseState,
  email: values.email,
  phone: values.phoneNumber,
  fax: values.fax,
  address: {
    address1: values.address1,
    address2: values.address2,
    city: values.city,
    state: values.state,
    zip: values.zip
  }
});

const ProviderAddUpdateForm = ({ setShowAddProviderForm, providerData, accountId, onProviderSaved }) => {
  const { t } = useTranslate();
  const isEdit = Boolean(providerData?.id);
  const [alert, setAlert] = React.useState(null);

  const handleServerError = (error) => {
    const { response = {} } = error;
    const errorFromServer = response.data?.errorCodes;
    if (errorFromServer && Array.isArray(errorFromServer) && errorFromServer.length > 0) {
      setAlert({
        description: t(`serverResponse.${errorFromServer.sort().join('.')}`),
        type: 'error'
      });
    } else {
      setAlert({
        description: t('errors.default'),
        type: 'error'
      });
    }
  };

  const handleSubmit = (values) => {
    const payload = transformPayloadForAPI(values);
    if (isEdit) {
      ProviderService.updateProvider(providerData.id, payload)
        .then((response) => {
          if (onProviderSaved) onProviderSaved(response);
          setShowAddProviderForm(false);
        })
        .catch(handleServerError);
    } else {
      ProviderService.addProvider(payload, accountId)
        .then((response) => {
          if (onProviderSaved) onProviderSaved(response);
          setShowAddProviderForm(false);
        })
        .catch(handleServerError);
    }
  };

  return (
    <div>
      <Formik
        validationSchema={getProviderSchema(t)}
        initialValues={transformProviderData(providerData) || INITIAL_VALUES_FOR_PROVIDER}
        onSubmit={handleSubmit}
        enableReinitialize={true}>
        <Form>
          {alert && <Alert description={alert?.description} type={alert?.type} onClose={() => setAlert(null)} />}
          <div className={styles.providerForm}>
            <FormRenderer sections={sections({ fromPage: 'order' })} />
          </div>
          <div className={styles.providerControls}>
            <Button type="submit" size="md" variant="tertiary">
              {t('provider.btnSaveProvider')}
            </Button>
            <Button
              type="button"
              variant="tertiary"
              size="md"
              onClick={() => {
                setShowAddProviderForm(false);
              }}>
              {t('provider.btnCancel')}
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ProviderAddUpdateForm;
