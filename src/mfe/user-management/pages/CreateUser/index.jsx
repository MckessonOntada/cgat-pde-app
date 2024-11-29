import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import './CreateUser.scss';
import { Button, Stepper, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import UserDetailsFormSegment from './CreateUserForm';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { PATHS } from '../../routes/constants';
import ModuleHeader from '@src/components/module-header';
import { useQuery, useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import { RoutePaths } from '@src/routes/constants';

const CreateUser = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const { isEdit = false } = location.state || {};
  const { isPending } = location.state || {};
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alert, setAlert] = useState(null);
  const isSystemAdminView = AuthUtils.isSystemAdminView();

  useEffect(() => {
    if (isAlertVisible) {
      const timer = setTimeout(() => {
        setIsAlertVisible(false);
      }, 10000);

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isAlertVisible]);

  const handleAlertClose = () => {
    setIsAlertVisible(false);
  };

  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };
  const practiceId = AuthUtils.getPracticeId() ?? 1;

  const {
    isLoading: isGetUserdetails,
    isError: isGetUserError,
    data: userData
  } = useQuery({
    queryKey: [`users/${userId}`],
    queryFn: async () => {
      const url = !isPending ? `${ApiRoutes.USERS()}/${userId}?${serializeParams(requestParams)}` : `${ApiRoutes.USERS_PROVISIONING()}/${userId}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      return res.data;
    },
    enabled: isEdit || isPending,
    refetchOnWindowFocus: false
  });

  const { mutate, isLoading, isError, data } = useMutation(async ({ payload, isReject }) => {
    if (isEdit) {
      const updatedPayload = {
        ...payload,
        permissions: userData?.permissions || [], // Include permissions from userData
        role: userData?.role || [] // Include roles from userData
      };
      const updateUser = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${userId}?${serializeParams(requestParams)}`, httpVerb.PUT, updatedPayload);
      return updateUser.data;
    } else if (isPending) {
      const reqParams = {
        status: isReject ? 'REJECTED' : 'APPROVED'
      };
      if (!isReject) {
        // For approval, first create the user
        const createUserResponse = await HttpResourceService.callRest(`${ApiRoutes.USERS()}?${serializeParams(requestParams)}`, httpVerb.POST, payload);
        // Then, approve the user
        const approveResponse = await HttpResourceService.callRest(`${ApiRoutes.USERS_PROVISIONING()}/${userId}/status?${serializeParams(reqParams)}`, httpVerb.PATCH, payload);
        // Return both responses for the approval
        return {
          createUser: createUserResponse.data,
          approve: approveResponse.data
        };
      }
      // For rejection,
      const rejectResponse = await HttpResourceService.callRest(`${ApiRoutes.USERS_PROVISIONING()}/${userId}/status?${serializeParams(reqParams)}`, httpVerb.PATCH, payload);
      return rejectResponse.data;
    } else {
      const createUserResponse = await HttpResourceService.callRest(`${ApiRoutes.USERS()}?${serializeParams(requestParams)}`, httpVerb.POST, payload);
      return {
        createUser: createUserResponse.data
      };
    }
  });

  const goBack = () => {
    navigate(-1);
  };

  const initialValues = {
    name: {
      firstName: userData?.name?.firstName || '',
      middleName: userData?.name?.middleName || '',
      lastName: userData?.name?.lastName || ''
    },
    contact: {
      email: userData?.contact?.email || '',
      phone: userData?.contact?.phone || '',
      countryCode: '91',
      fax: userData?.contact?.fax || ''
    },
    address: {
      address1: userData?.address?.address1 || '',
      address2: userData?.address?.address2 || '',
      city: userData?.address?.city || '',
      state: userData?.address?.state || '',
      zip: userData?.address?.zip || ''
    }
  };

  const validationSchema = Yup.object({
    name: Yup.object({
      firstName: Yup.string()
        .matches(/^[A-Za-z]+$/, t('userManagement.create_user.validation.first_name')) // Only alphabets
        .min(2, t('userManagement.create_user.validation.first_name'))
        .required(t('userManagement.create_user.validation.first_name_required')),
      middleName: Yup.string()
        .matches(/^[A-Za-z]+$/, t('userManagement.create_user.validation.middle_name'))
        .min(2, t('userManagement.create_user.validation.middle_name'))
        .nullable(),
      lastName: Yup.string()
        .matches(/^[A-Za-z]+$/, t('userManagement.create_user.validation.last_name')) // Only alphabets
        .min(2, t('userManagement.create_user.validation.last_name'))
        .required(t('userManagement.create_user.validation.last_name_required'))
    }),

    contact: Yup.object({
      email: Yup.string().email(t('userManagement.create_user.validation.invalid_email')).required(t('userManagement.create_user.validation.email_required')),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, t('userManagement.create_user.validation.phone_no')) // 10 digits only
        .required(t('userManagement.create_user.validation.phone_no_required')),
      fax: Yup.string().matches(/^[0-9]{15}$/, t('userManagement.create_user.validation.fax'))
    }),

    address: Yup.object({
      address1: Yup.string()
        .matches(/^[A-Za-z0-9\s.,#&/-]*$/, t('userManagement.create_user.validation.address_1')) // Alphanumeric and special characters
        .min(2, t('userManagement.create_user.validation.address_1'))
        .required(t('userManagement.create_user.validation.address_1_required')),
      address2: Yup.string().matches(/^[A-Za-z0-9\s.,#&/-]*$/, t('userManagement.create_user.validation.address_1')), // Optional field
      city: Yup.string()
        .matches(/^[A-Za-z]+$/, t('userManagement.create_user.validation.city')) // Only alphabets
        .min(2, t('userManagement.create_user.validation.city'))
        .required(t('userManagement.create_user.validation.city_required')),
      state: Yup.string().required(t('userManagement.create_user.validation.state_required')),
      zip: Yup.string()
        .matches(/^\d{5}(-\d{4})?$/, t('userManagement.create_user.validation.zip')) // Only digits
        .required(t('userManagement.create_user.validation.zip_required'))
    })
  });

  const handleRejectRequest = (values) => {
    mutate(
      { values, isReject: true },
      {
        onSuccess: (response) => {
          console.log('User Reject successfully:', response);
          navigate(RoutePaths.pathUserManagement, { state: { isReject: true, isSuccess: true } });
        },
        onError: (error) => {
          setAlert({ type: 'error', message: 'Failed to Reject user' });
          setIsAlertVisible(true);
        }
      }
    );
  };

  const handleSubmit = (values) => {
    const payload = {
      practiceId, // Append the practiceId
      ...values, // Spread the existing form values
      isActive: true
    };

    mutate(
      { payload, isReject: false },
      {
        onSuccess: (response) => {
          console.log('User created/updated successfully:', response);
          navigate(isEdit ? -1 : `../${PATHS.userPermissions}/${response.createUser.id || userId}`);
        },
        onError: (error) => {
          const actionType = isPending ? 'Approve' : isEdit ? 'Update' : 'Create';
          setAlert({ type: 'error', message: `Failed to ${actionType}  user` });
          setIsAlertVisible(true);
        }
      }
    );
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="MCP-module-wrapper">
      <div className="back-navigation py2 capitalize" onClick={goBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>{t(isSystemAdminView ? 'userManagement.sysadmin.backmessage' : 'userManagement.user.backmessage')}</p>
      </div>

      <ModuleHeader heading={<p className="primaryHeading">{t(isSystemAdminView ? 'userManagement.create_sysadmin' : 'userManagement.create_user')}</p>} />
      <div className="stepper">
        <Stepper
          activeIndex={1}
          dividerText="of"
          stepHeaders={[
            {
              label: t('userManagement.stepper.option.user_details')
            },
            {
              label: t('userManagement.stepper.option.roles_and_permissions')
            },
            {
              label: t('userManagement.stepper.option.associate_accounts')
            }
          ]}
        />
      </div>
      {isAlertVisible && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          handleSubmit(values);
          actions.setSubmitting(false);
        }}>
        {() => (
          <Form>
            <div className="MCP-panel-container">
              <p className="font-bold-title-s">{t(isSystemAdminView ? 'userManagement.create_user.details_to_create_sysadmin' : 'userManagement.create_user.details_to_create_user')}</p>
              <UserDetailsFormSegment />
            </div>
            <div className={'buttonGroup'}>
              <Button variant="secondary" type="button" onClick={handleGoBack} size={'md'}>
                {t('userManagement.button.back')}
              </Button>
              {isPending && (
                <Button variant="secondary" type="button" onClick={handleRejectRequest} size={'md'}>
                  {t('userManagement.button.rejectrequest')}
                </Button>
              )}
              <Button type="submit" size={'md'}>
                {t('userManagement.button.savencontinue')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateUser;
export { UserDetailsFormSegment };
