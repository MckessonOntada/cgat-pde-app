import React, { useCallback, useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import './CreateOrg.scss';
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import OrgDetailsFormSegment from './CreateOrgForm';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { getValidationSchema, INITIAL_VALUES } from './utils';
import CreateOrgStep2 from './CreateOrgStep2';

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
    navigate(-1);
  };

  const handleFirstStep = (values) => {
    setOrganizationData({ formData: values });
    setCurrentStep(2);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const setSelectedAccounts = (selectedAccounts) => {
    console.log(selectedAccounts);
    setOrganizationData((prevState) => ({ ...prevState, selectedAccounts }));
  };

  // console.log('organizationData.formData', organizationData.formData);
  return (
    <div className="main-container">
      <div className="back-navigation py2 capitalize" onClick={goBack}>
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>{t('orgManagement.back.organization')}</p>
      </div>
      {currentStep === 1 && (
        <Formik
          initialValues={organizationData.formData}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            handleFirstStep(values);
            actions.setSubmitting(false);
          }}
          validateOnChange={false}
          validateOnBlur={true}>
          {() => (
            <Form>
              <div className="container-box">
                <div className="headingBox">
                  <p className="font-bold-title-s">
                    {t('Please complete the form to create a new organization')}
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
        <CreateOrgStep2
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
