import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import './CreateUser.scss';
import { Button, Heading, Stepper, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import UserDetailsFormSegment from './CreateUserForm';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { PATHS } from '../../routes/constants';
import ModuleHeader from '@src/components/module-header';
import { useQuery, useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { handleApiError, serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import { RoutePaths } from '@src/routes/constants';
import { ALPHABETIC_WITH_SPECIAL, ALPHABETIC_WITH_SPACE, ADDRESS_REGEX, ZIP_REGEX, PHONE_REGEX, FAX_REGEX } from '@src/components/form/ValidationRegExp';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import CommonUtils from '@src/util/CommonUtils';

const CreateUser = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const { isEdit = false, isPending = false, isBack = false } = location.state || {};
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alert, setAlert] = useState(null);
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const [isDirty, setIsDirty] = React.useState(false);
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);

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
    enabled: isEdit || isPending || isBack,
    refetchOnWindowFocus: false
  });

  const { mutate, isLoading, isError, data } = useMutation(async ({ payload, isReject }) => {
    if (isEdit || isBack) {
      const updateUser = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${userId}?${serializeParams(requestParams)}`, httpVerb.PATCH, payload);
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

  const handleGoBack = () => {
    navigate(RoutePaths.pathUserManagement);
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
        .matches(ALPHABETIC_WITH_SPECIAL, t('userManagement.create_user.validation.first_name')) // Only alphabets
        .min(2, t('userManagement.create_user.validation.first_name_min_max'))
        .required(t('userManagement.create_user.validation.first_name_required')),
      middleName: Yup.string().matches(ALPHABETIC_WITH_SPECIAL, t('userManagement.create_user.validation.middle_name')).min(2, t('userManagement.create_user.validation.middle_name_min_max')).nullable(),
      lastName: Yup.string()
        .matches(ALPHABETIC_WITH_SPECIAL, t('userManagement.create_user.validation.last_name')) // Only alphabets
        .min(2, t('userManagement.create_user.validation.last_name_min_max'))
        .required(t('userManagement.create_user.validation.last_name_required'))
    }),

    contact: Yup.object({
      email: Yup.string().email(t('userManagement.create_user.validation.invalid_email')).required(t('userManagement.create_user.validation.email_required')),
      phone: Yup.string()
        .matches(PHONE_REGEX, t('userManagement.create_user.validation.phone_no')) // 10 digits only
        .required(t('userManagement.create_user.validation.phone_no_required')),
      fax: Yup.string().matches(FAX_REGEX, t('userManagement.create_user.validation.fax'))
    }),

    address: Yup.object({
      address1: Yup.string()
        .matches(ADDRESS_REGEX, t('userManagement.create_user.validation.address_1')) // Alphanumeric and special characters
        .min(2, t('userManagement.create_user.validation.address_1'))
        .required(t('userManagement.create_user.validation.address_1_required')),
      address2: Yup.string().matches(ADDRESS_REGEX, t('userManagement.create_user.validation.address_1')), // Optional field
      city: Yup.string()
        .matches(ALPHABETIC_WITH_SPACE, t('userManagement.create_user.validation.city')) // Only alphabets
        .min(2, t('userManagement.create_user.validation.city_min_max'))
        .required(t('userManagement.create_user.validation.city_required')),
      state: Yup.string().required(t('userManagement.create_user.validation.state_required')),
      zip: Yup.string()
        .matches(ZIP_REGEX, t('userManagement.create_user.validation.zip')) // Only digits
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
          navigate(isEdit ? `/${isSystemAdminView ? 'system-admin' : 'user'}/${response?.createUser?.id ? response.createUser?.id : userId}` : `../${PATHS.userPermissions}/${response?.createUser?.id ? response.createUser?.id : userId}`);
        },
        onError: (error) => {
          const errorKey = handleApiError(error);
          const actionType = isPending ? 'Approve' : isEdit ? 'Update' : 'Create';
          setAlert({ type: 'error', message: t(errorKey) });
          // setAlert({ type: 'error', message: `Failed to ${actionType}  user` });
          setIsAlertVisible(true);
        }
      }
    );
  };

  const handleCancel = () => {
    if (isDirty) {
      if (isEdit) {
        setModalSuccessCallback('details');
      } else {
        setModalSuccessCallback('list');
      }
    } else {
      if (isEdit) {
        navigate(`../${PATHS.userDetail.replace(':userId', userId)}`);
      } else {
        navigate(RoutePaths.pathUserManagement);
      }
    }
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(RoutePaths.pathUserManagement);
    } else if (modalSuccessCallback === 'details') {
      navigate(`../${PATHS.userDetail.replace(':userId', userId)}`);
    }
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t(isSystemAdminView ? 'userManagement.sysadmin.backmessage' : 'userManagement.user.backmessage')}
        </Button>
      </div>

      <ModuleHeader heading={<Heading as="h1">{t(isSystemAdminView ? 'userManagement.create_sysadmin' : 'userManagement.create_user')}</Heading>} />
      {!isEdit && (
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
      )}

      {isAlertVisible && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          handleSubmit(values);
          actions.setSubmitting(false);
        }}>
        {({ values, isValid, dirty }) => {
          React.useEffect(() => {
            setIsDirty(dirty);
          }, [dirty]);

          return (
            <Form>
              <div className="MCP-panel-container">
                <Heading as="h2">{t(isSystemAdminView ? 'userManagement.create_user.details_to_create_sysadmin' : 'userManagement.create_user.details_to_create_user')}</Heading>
                <UserDetailsFormSegment />
              </div>
              <div className={'buttonGroup'}>
                <Button variant="secondary" type="button" onClick={handleCancel} size={'md'}>
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
          );
        }}
      </Formik>
      <DiscardChangesModal heading="Discard Changes" description="You have changed user details. Do you still want to go back? Your changes will be discarded!" isOpen={Boolean(modalSuccessCallback)} onClose={() => setModalSuccessCallback(null)} onConfirm={handleNavigate} />
    </div>
  );
};

export default CreateUser;
export { UserDetailsFormSegment };
