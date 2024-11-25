import React, { useCallback, useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import { Loader } from '@mckesson/mcp-component-library';
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import OrgDetailsFormSegment from './CreateOrgForm';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { getValidationSchema, INITIAL_VALUES } from './utils';
import { RoutePaths } from '../../../../routes/constants';
import OrgDetails from './OrgDetails';
import { useMutation } from 'react-query';
import ApiRoutes from '../../../../api/ApiRoutes';
import './CreateOrg.scss';

const CreateOrganization = () => {
  const [organizationData, setOrganizationData] = useState({
    formData: INITIAL_VALUES,
    selectedAccounts: []
  });

  const [currentStep, setCurrentStep] = useState(1);

  const { t } = useTranslate();
  const navigate = useNavigate();

  const validationSchema = getValidationSchema(t);

  const goBack = () => {
    navigate(RoutePaths.pathOrgManagement);
  };

  const createOrg = async (orgData) => {
    // Perform the mutation logic, e.g., make an API request to update the user
    const res = await HttpResourceService.callRest(
      `${ApiRoutes.ORGANIZATIONS}`,
      httpVerb.POST,
      orgData,
      {
        'Content-Type': 'multipart/form-data'
      }
    );

    if (!res.ok) {
      throw new Error('Failed to update user');
    }

    return res.json();
  };

  const onOrgCreateSuccess = () => {
    setCurrentStep(2)
  };

  const onOrgCreateError = () => {
    goBack();
  }

  // Fetch data from server
  const { mutate, isLoading } = useMutation({
    mutationFn: createOrg,
    onError: onOrgCreateError,
    onSuccess: onOrgCreateSuccess
  });

  const createNewOrg = (values) => {
    const formData = new FormData();
    formData.append("logo", "test");
    formData.append("practiceStr", JSON.stringify({
      name: values.name,
      address: values.address,
      contact: values.contact,
      contactPerson: values.contactPerson
    }))
    mutate(formData);
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const setSelectedAccounts = (selectedAccounts) => {
    setOrganizationData((prevState) => ({ ...prevState, selectedAccounts }));
  };

  return (
    <div className="main-container">
      { isLoading && <Loader type={'screen'} />}
      <div className="back-navigation py2 capitalize" onClick={goBack}>
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>{t('orgManagement.back.organization')}</p>
      </div>
      {currentStep === 1 && (
        <Formik
          initialValues={organizationData.formData}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            createNewOrg(values);
            actions.setSubmitting(false);
          }}
          validateOnChange={false}
          validateOnBlur={true}>
          {() => (
            <Form>
              <div className="container-box">
                <div className="headingBox">
                  <p className="font-bold-title-s">
                  Please complete the form to create a new organization
                  </p>
                </div>
                <OrgDetailsFormSegment />
              </div>

              <div className={'buttonGroup'}>
                <Button variant="secondary" type="button" onClick={handleGoBack} size={'md'}>
                  {t('orgManagement.button.back')}
                </Button>
                <Button type="submit" size={'md'}>
                  {t('orgManagement.button.next')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
      {currentStep === 2 && (
        <OrgDetails
          prevStepData={organizationData.formData}
          onEditClick={() => setCurrentStep(1)}
          selectedAccounts={organizationData.selectedAccounts}
          setSelectedAccounts={setSelectedAccounts}
        />
      )}
    </div>
  );
};

export default CreateOrganization;
export { OrgDetailsFormSegment };
