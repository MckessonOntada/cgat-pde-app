import { Button } from '@mckesson/mcp-component-library';
import Alert from '@src/components/cgat-alert/Alert';
import { ADDRESS_REGEX, ALPHABETIC_WITH_SPACE, FAX_REGEX, PHONE_REGEX, ZIP_REGEX } from '@src/components/form/ValidationRegExp';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import { RoutePaths } from '@src/routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import { handleApiError } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import CommonUtils from '@src/util/CommonUtils';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { PATHS } from '../../routes/constants';
import './CreateUser.scss';
import UserDetailsFormSegment from './CreateUserForm';
import useRouteMode from '../../routes/useRouteMode';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';
import FormikFormWrapper from '@src/components/form/FormikFormWrapper';
import { useWidgetContext } from '@src/context/WidgetContext';
import UserService from '@src/api/commonService/UserService';

const getSubmitCaption = ({ isEdit, isCreating, isUpdating }) => {
  if (isUpdating) return 'Updating';
  if (isCreating) return 'Saving';
  if (isEdit) return 'Update';
  return 'Save and Continue';
};

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
  const { setValue, state } = useWidgetContext();
  const { isEdit, id, params } = useRouteMode({ editSegment: 'edit', paramKey: 'userId' });
  const provision = params.provision === 'true';
  const [initialFormValue, setInitialFormValue] = React.useState(INITIAL_VALUES);
  const [alert, setAlert] = useState(null);
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const [isDirty, setIsDirty] = React.useState(false);
  const [isDiscardChangesModalVisible, setIsDiscardChangesModalVisible] = React.useState(false);
  const practiceId = AuthUtils.getPracticeId() ?? 1;
  const userDetails = state.userDetails || {};
  const { createWizardSteps = {} } = state;

  React.useEffect(() => {
    const userDetails = state.userDetails || {};
    if (id && userDetails.id) {
      const sanitized = CommonUtils.sanitizeValue(userDetails.address);
      const { name, contact } = userDetails;
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
    }
  }, [state.userDetails]);

  const onSuccess = (response) => {
    const createdId = response?.id;
    let targetPath = '';
    if (provision) {
      navigate(`./../../${createdId}/create/${PATHS.PERMISSIONS}`);
      return;
    } else if (isEdit) {
      targetPath = `./../..`;
    } else {
      targetPath = `./../${createdId}/${PATHS.PERMISSIONS}`;
    }
    navigate(`${targetPath}${location.search}`, {
      state: {
        alert: {
          type: 'success',
          description: 'User details updated successfully.'
        }
      }
    });
  };

  const onError = (error) => {
    const errorKey = handleApiError(error);
    setAlert({ type: 'error', description: t(errorKey) });
  };

  const { mutate: rejectUserRequest } = useMutation({
    mutationFn: (params) => UserService.rejectUserRequest(id, params),
    onSuccess: (_response) => {
      navigate(RoutePaths.pathUserManagement, { state: { isReject: true, isSuccess: true } });
    },
    onError
  });

  const { mutate: approveUserRequest } = useMutation({
    mutationFn: async ({ payload, params }) => {
      return UserService.createUser(payload, params).then(async (createRes) => {
        await UserService.approveUserRequest(id, payload, params);
        return createRes;
      });
    },
    onSuccess,
    onError
  });

  const { mutate: createUser, isLoading: isCreating } = useMutation({
    mutationFn: ({ payload, params }) => UserService.createUser(payload, params),
    onSuccess: (response) => {
      setValue('userDetails', response);
      const { createWizardSteps = {} } = state;
      setValue('createWizardSteps', {
        ...createWizardSteps,
        personalDetails: true
      });
      onSuccess(response);
    },
    onError
  });

  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: ({ payload, params }) => UserService.updateUser(id, payload, params),
    onSuccess: (response) => {
      setValue('userDetails', response);
      onSuccess(response);
    },
    onError
  });

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

  const handleRejectRequest = () => {
    rejectUserRequest({ status: true });
  };

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      practiceId,
      isActive: true
    };
    const params = {
      userType: isSystemAdminView ? 'ADMIN' : 'GENERAL',
      status: 'APPROVED'
    };
    if (createWizardSteps.personalDetails) {
      if (!isDirty) {
        navigate(`../${id}/permissions`);
      } else {
        updateUser({ payload, params });
      }
    } else if (provision && isEdit) {
      approveUserRequest({ payload, params });
    } else if (isEdit) {
      updateUser({ payload, params });
    } else {
      createUser({ payload, params });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setIsDiscardChangesModalVisible(true);
    } else {
      if (isEdit) {
        navigate(`./../..`);
      } else {
        navigate(`./../../..`);
      }
    }
  };

  const handleNavigate = () => {
    if (isEdit) {
      navigate(`./../..`);
    } else {
      navigate(RoutePaths.pathUserManagement);
    }
  };

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
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
              <FormikFormWrapper disabled={isCreating || isUpdating}>
                <div className="MCP-panel-container">
                  <UserDetailsFormSegment comment={userDetails?.comment} isEdit={isEdit} />
                </div>
                <div className={'buttonGroup'}>
                  <Button variant="secondary" type="button" onClick={handleCancel} size={'md'}>
                    {t('userManagement.button.back')}
                  </Button>
                  {provision && (
                    <Button variant="secondary" type="button" onClick={handleRejectRequest} size={'md'}>
                      {t('userManagement.button.rejectrequest')}
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    isLoadingState={isCreating || isUpdating}
                    Icon={isCreating || (isUpdating && ButtonLoadingIcon)}
                    iconPosition="left"
                    size="md"
                    disabled={!(isDirty || provision || (!isEdit && createWizardSteps.personalDetails))}>
                    {getSubmitCaption({ isEdit, isCreating, isUpdating })}
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
        isOpen={isDiscardChangesModalVisible}
        onClose={() => setIsDiscardChangesModalVisible(false)}
        onConfirm={handleNavigate}
      />
    </div>
  );
};

export default CreateUser;
export { UserDetailsFormSegment };
