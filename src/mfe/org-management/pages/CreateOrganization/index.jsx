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
import { RoutePaths } from '@src/routes/constants';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import './CreateOrg.scss';
import { PATHS } from '../../routes/constants';

const CreateOrganization = () => {
  const [organizationData] = useState(INITIAL_VALUES);

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

    if (![201, 200].includes(res.status)) {
      throw new Error('Failed to create user');
    }
    console.log('response:', res);
    return res;
  };

  const onOrgCreateSuccess = (res) => {
    const path = PATHS.viewOrg.replace(':orgId', res.data.id);
    navigate(`../${path}`);
  };

  const onOrgCreateError = (error) => {
    const errorMessage = typeof error === 'string' ? error : JSON.stringify(error);
    window.alert(`Error: ${errorMessage}`);
  };

  // Fetch data from server
  const { mutate, isLoading } = useMutation({
    mutationFn: createOrg,
    onError: onOrgCreateError,
    onSuccess: onOrgCreateSuccess
  });

  const createNewOrg = (values) => {
    const formData = new FormData();
    formData.append('logo', 'test');
    formData.append(
      'practiceStr',
      JSON.stringify({
        name: values.name,
        address: values.address,
        contact: values.contact,
        contactPerson: values.contactPerson
      })
    );
    mutate(formData);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="main-container">
      {isLoading && <Loader type={'screen'} />}
      <div className="back-navigation py2 capitalize" onClick={goBack}>
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>{t('orgManagement.back.organization')}</p>
      </div>
      <Formik
        initialValues={organizationData}
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
                {t('orgManagement.button.save')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateOrganization;
export { OrgDetailsFormSegment };
