import { Button, Heading, Loader } from '@mckesson/mcp-component-library';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import Alert from '@src/components/cgat-alert/Alert';
import { ADDRESS_REGEX, ALPHABETIC_WITH_SPACE, FAX_REGEX, PHONE_REGEX, ZIP_REGEX } from '@src/components/form/ValidationRegExp';
import ModuleHeader from '@src/components/module-header';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import { RoutePaths } from '@src/routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import { handleApiError, serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import CommonUtils from '@src/util/CommonUtils';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { PATHS } from '../../routes/constants';
import './CreateUser.scss';
import UserDetailsFormSegment from './CreateUserForm';
import UserCreationStepper from './UserCreationStepper';
import useRouteMode from '../../routes/useRouteMode';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';
import FormikFormWrapper from '@src/components/form/FormikFormWrapper';
import { useWidgetContext } from '@src/context/WidgetContext';

const INITIAL_VALUES = {
  name: {
    firstName: '',
    middleName: '',
    lastName: ''
  },
  contact: {
    email: '',
    phone: '',
    fax: '',
    countryCode: '91'
  },
  address: {
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: ''
  }
};

const CreateUser = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { setValue, value } = useWidgetContext();
  const { isEdit, id } = useRouteMode({ editSegment: 'edit', paramKey: 'userId' });
  const { isPending = false, isBack = false } = location.state || {};
  const [initialFormValue, setInitialFormValue] = React.useState(INITIAL_VALUES);
  const [alert, setAlert] = useState(null);
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const [isDirty, setIsDirty] = React.useState(false);
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);

  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };
  const practiceId = AuthUtils.getPracticeId() ?? 1;

  const {
    isLoading: isGetUserDetails,
    isError: isGetUserError,
    data: userData
  } = useQuery({
    queryKey: [`users/${id}`],
    queryFn: async () => {
      const url = !isPending ? `${ApiRoutes.USERS()}/${id}?${serializeParams(requestParams)}` : `${ApiRoutes.USERS_PROVISIONING()}/${id}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});

      return res.data;
    },
    onSuccess: (response) => {
      const sanitized = CommonUtils.sanitizeValue(response.address);
      const { name, contact } = response;
      const initialValues = {
        name: {
          firstName: name.firstName,
          middleName: name.middleName,
          lastName: name.lastName
        },
        contact: {
          email: contact.email,
          phone: contact.phone,
          countryCode: '91',
          fax: contact.fax
        },
        address: {
          address1: sanitized.address1,
          address2: sanitized.address2,
          city: sanitized.city,
          state: sanitized.state,
          zip: sanitized.zip
        }
      };
      setInitialFormValue(initialValues);
      setValue('isLoading', false);
    },
    enabled: isEdit || isPending || isBack,
    refetchOnWindowFocus: false
  });

  const { mutate, isLoading: isSaving } = useMutation(async ({ payload, isReject }) => {
    if (isEdit || isBack) {
      const updateUser = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${id}?${serializeParams(requestParams)}`, httpVerb.PATCH, payload);
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
          `${ApiRoutes.USERS_PROVISIONING()}/${id}/status?${serializeParams(reqParams)}`,
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
        `${ApiRoutes.USERS_PROVISIONING()}/${id}/status?${serializeParams(reqParams)}`,
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
          navigate(RoutePaths.pathUserManagement, { state: { isReject: true, isSuccess: true } });
        },
        onError: (error) => {
          setAlert({ type: 'error', description: t('errors.default') });
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
      { isLoading: isSaving, payload, isReject: false },
      {
        onSuccess: (response) => {
          const createdId = response?.createUser?.id ?? id;
          let targetPath = '';

          if (isEdit) {
            targetPath = isSystemAdmin ? `/system-admin/user/${createdId}` : `/admin/user/${createdId}`;
          } else {
            targetPath = `../${createdId}/${PATHS.PERMISSIONS}`;
          }

          navigate(targetPath, {
            state: { isEdit: isEdit }
          });
        },
        onError: (error) => {
          const errorKey = handleApiError(error);
          setAlert({ type: 'error', description: t(errorKey) });
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
        navigate(`../${id}`);
      } else {
        navigate(RoutePaths.pathUserManagement);
      }
    }
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(RoutePaths.pathUserManagement);
    } else if (modalSuccessCallback === 'details') {
      navigate(`../${id}`);
    }
  };

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
            <UserCreationStepper activeIndex={1} />
          </div>
        )}

        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <Formik
          initialValues={initialFormValue}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values, actions) => {
            handleSubmit(values);
            actions.setSubmitting(false);
          }}>
          {({ dirty }) => {
            React.useEffect(() => {
              setIsDirty(dirty);
            }, [dirty]);

            return (
              <FormikFormWrapper disabled={isSaving}>
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
                  <Button
                    type="submit"
                    variant="primary"
                    isLoadingState={isSaving}
                    Icon={isSaving && ButtonLoadingIcon}
                    iconPosition="left"
                    size="md"
                    disabled={!isDirty}>
                    {t(isSaving ? 'Saving' : 'userManagement.button.savencontinue')}
                  </Button>
                </div>
              </FormikFormWrapper>
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
