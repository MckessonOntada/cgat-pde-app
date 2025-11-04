import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import './CreateUser.scss';
import { Button, Heading, StepperMui, Loader } from '@mckesson/mcp-component-library';
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
import Alert from '@src/components/cgat-alert/Alert';

const CreateUser = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const { isEdit = false, isPending = false, isBack = false, permissionsData } = location.state || {};
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alert, setAlert] = useState(null);
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const [isDirty, setIsDirty] = React.useState(false);
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);

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
        const approveResponse = await HttpResourceService.callRest(
          `${ApiRoutes.USERS_PROVISIONING()}/${userId}/status?${serializeParams(reqParams)}`,
          httpVerb.PATCH,
          payload
        );
        // Return both responses for the approval
        return {
          createUser: createUserResponse.data,
          approve: approveResponse.data
        };
      }
      // For rejection,
      const rejectResponse = await HttpResourceService.callRest(
        `${ApiRoutes.USERS_PROVISIONING()}/${userId}/status?${serializeParams(reqParams)}`,
        httpVerb.PATCH,
        payload
      );
      return rejectResponse.data;
    } else {
      const createUserResponse = await HttpResourceService.callRest(`${ApiRoutes.USERS()}?${serializeParams(requestParams)}`, httpVerb.POST, payload);
      return {
        createUser: createUserResponse.data
      };
    }
  });

  const handleGoBack = () => {
    navigate(isEdit ? -1 : isSystemAdminView ? RoutePaths.pathSystemAdminManagement : RoutePaths.pathUserManagement);
  };
  const sanitized = CommonUtils.sanitizeValue(userData?.address);
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
      address1: sanitized.address1 || '',
      address2: sanitized.address2 || '',
      city: sanitized.city || '',
      state: sanitized.state || '',
      zip: sanitized.zip || ''
    }
  };

  const validationSchema = Yup.object({
    name: Yup.object({
      firstName: CommonUtils.getNameValidation(t, {
        field: 'first_name',
        required: true
      }),
      middleName: CommonUtils.getNameValidation(t, {
        field: 'middle_name'
      }),
      lastName: CommonUtils.getNameValidation(t, {
        field: 'last_name',
        required: true
      })
    }),

    contact: Yup.object({
      email: Yup.string().email(t('userManagement.create_user.validation.invalid_email')).required(t('userManagement.create_user.validation.email_required')),
      phone: Yup.string()
        .matches(PHONE_REGEX, t('userManagement.create_user.validation.phone_no')) // 10 digits only
        .required(t('userManagement.create_user.validation.phone_no_required')),
      fax: Yup.string().matches(FAX_REGEX, t('userManagement.create_user.validation.fax')).max(15, t('userManagement.create_user.validation.fax_max'))
    }),

    address: Yup.object({
      address1: Yup.string()
        .required(t('userManagement.create_user.validation.address_1_required'))
        .test('no-leading-trailing-spaces', t('message.noLeadingTrailingSpace'), (value) => value === value?.trim())
        .matches(ADDRESS_REGEX, t('userManagement.create_user.validation.address_1')) // Alphanumeric and special characters
        .min(2, t('userManagement.create_user.validation.address_1'))
        .max(100, t('userManagement.create_user.validation.address_1')),
      address2: Yup.string()
        .test('no-leading-trailing-spaces', t('message.noLeadingTrailingSpace'), (value) => value === value?.trim())
        .matches(ADDRESS_REGEX, t('userManagement.create_user.validation.address_1')),
      city: Yup.string()
        .required(t('userManagement.create_user.validation.city_required'))
        .matches(ALPHABETIC_WITH_SPACE, t('userManagement.create_user.validation.city')) // Only alphabets
        .min(2, t('userManagement.create_user.validation.city_min_max'))
        .max(50, t('userManagement.create_user.validation.city_min_max')),
      state: Yup.string().required(t('userManagement.create_user.validation.state_required')),
      zip: Yup.string()
        .matches(ZIP_REGEX, t('userManagement.create_user.validation.zip')) // Only digits
        .required(t('userManagement.create_user.validation.zip_required'))
        .max(10, t('userManagement.create_account.validation.zip_max'))
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
          setAlert({ type: 'error', message: t('errors.default') });
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
      { isLoading, payload, isReject: false },
      {
        onSuccess: (response) => {
          console.log('User created/updated successfully:', response);
          navigate(
            isEdit
              ? isSystemAdmin
                ? `/system-admin/user/${response?.createUser?.id ? response.createUser?.id : userId}`
                : `/admin/user/${response?.createUser?.id ? response.createUser?.id : userId}`
              : `../${PATHS.userPermissions}/${response?.createUser?.id ? response.createUser?.id : userId}`,
            {
              state: { permissionsData: permissionsData, isEdit: isEdit }
            }
          );
        },
        onError: (error) => {
          const errorKey = handleApiError(error);
          const actionType = isPending ? 'Approve' : isEdit ? 'Update' : 'Create';
          setAlert({ type: 'error', message: t(errorKey) });
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
  if (isLoading) {
    return <Loader type={'screen'} />;
  }

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t(isEdit ? 'userManagement.back_to_user_details' : isSystemAdminView ? 'userManagement.sysadmin.backmessage' : 'userManagement.user.backmessage')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <ModuleHeader
          heading={
            <Heading as="h1">
              {t(
                isEdit
                  ? isSystemAdminView
                    ? 'userManagement.edit_sysadmin'
                    : 'userManagement.edit_organization_user'
                  : isSystemAdminView
                  ? 'userManagement.create_sysadmin'
                  : 'userManagement.create_organization_user'
              )}
            </Heading>
          }
        />

        {!isEdit && !isSystemAdminView && (
          <div className="stepper">
            <StepperMui
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

        {isAlertVisible && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} />}

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
                  <UserDetailsFormSegment comment={userData?.comment} isEdit={isEdit} />
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
      </div>
      <DiscardChangesModal
        heading="Discard Changes"
        description="You have changed user details. Do you still want to go back? Your changes will be discarded!"
        isOpen={Boolean(modalSuccessCallback)}
        onClose={() => setModalSuccessCallback(null)}
        onConfirm={handleNavigate}
      />
    </div>
  );
};

export default CreateUser;
export { UserDetailsFormSegment };
