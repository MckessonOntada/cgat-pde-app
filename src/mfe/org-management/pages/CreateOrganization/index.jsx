import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import { Loader, Alert, Stepper, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import OrgDetailsFormSegment from './CreateOrgForm';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { getValidationSchema, INITIAL_VALUES } from './utils';
import { RoutePaths } from '@src/routes/constants';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import './CreateOrg.scss';
import { PATHS } from '../../routes/constants';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { handleApiError } from '@src/util/ApiUtils';

const CreateOrganization = () => {
  const [organizationData, setOrganizationData] = useState(INITIAL_VALUES);
  const { orgId } = useParams();
  const location = useLocation();
  const [alert, setAlert] = useState(null);

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const isEdit = !!orgId;

  useEffect(() => {
    if (isAlertVisible) {
      const timer = setTimeout(() => {
        setIsAlertVisible(false);
      }, 10000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isAlertVisible]);

  useEffect(() => {
    if (orgId > 0 && location.state) {
      setOrganizationData(location.state);
    }
  }, []);

  const { t } = useTranslate();
  const navigate = useNavigate();

  const validationSchema = getValidationSchema(t);

  const goBack = () => {
    navigate(RoutePaths.pathOrgManagement);
  };

  const createOrg = async (orgData) => {
    // Perform the mutation logic, e.g., make an API request to update the user
    const res = await HttpResourceService.callRest(`${ApiRoutes.PUBLIC_ORGANIZATIONS}`, httpVerb.POST, orgData, {
      'Content-Type': 'multipart/form-data'
    });

    if (![201, 200].includes(res.status)) {
      throw new Error('Failed to create user');
    }
    return res;
  };

  const updateOrgDetails = async (payload) => {
    const res = await HttpResourceService.callRest(`${ApiRoutes.PUBLIC_ORGANIZATIONS}/${orgId}`, httpVerb.PUT, payload, {
      'Content-Type': 'multipart/form-data'
    });

    if (![201, 200].includes(res.status)) {
      throw new Error('Failed to create user');
    }
    return res;
  };

  const onOrgCreateSuccess = (res) => {
    if (location.state) {
      navigate(-1);
    } else {
      const path = PATHS.viewOrg.replace(':orgId', res.data.id);
      navigate(`../${path}`);
    }
  };

  const onOrgCreateError = (error) => {
    const errorKey = handleApiError(error);
    setAlert({
      type: 'error',
      description: t(errorKey)
    });
    setIsAlertVisible(true);
  };

  // Fetch data from server
  const { mutate, isLoading } = useMutation({
    mutationFn: orgId ? updateOrgDetails : createOrg,
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
    navigate(RoutePaths.pathOrgManagement);
  };

  return (
    <div className="main-container">
      {isLoading && <Loader type={'screen'} />}

      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={goBack} size="md">
          {t('orgManagement.back.organization')}
        </Button>
      </div>

      {isAlertVisible && <Alert type={alert.type} title={alert.title} description={alert.description} />}

      {!isEdit && (
        <div className="stepper">
          <Stepper
            activeIndex={1}
            dividerText="of"
            stepHeaders={[
              {
                label: t('orgManagement.stepper.option.org_details')
              },
              {
                label: t('orgManagement.stepper.option.acct_details')
              }
            ]}
          />
        </div>
      )}

      <Formik
        enableReinitialize
        initialValues={organizationData}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          createNewOrg(values);
          actions.setSubmitting(false);
        }}
        validateOnChange={false}
        validateOnBlur={true}>
        {(formik) => (
          <Form>
            <div className="container-box">
              <div className="headingBox">
                <p className="font-bold-title-s">Please complete the form to create a new organization</p>
              </div>
              <OrgDetailsFormSegment formik={formik} />
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
