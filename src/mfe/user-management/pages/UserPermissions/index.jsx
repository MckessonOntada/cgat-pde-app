import { Button } from '@mckesson/mcp-component-library';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import Alert from '@src/components/cgat-alert/Alert';
import { RoutePaths } from '@src/routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import { Formik } from 'formik';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { PATHS } from '../../routes/constants';
import './index.scss';
import PermissionForm from './PermissionForm';
import { useWidgetContext } from '@src/context/WidgetContext';
import useRouteMode from '../../routes/useRouteMode';
import FormikFormWrapper from '@src/components/form/FormikFormWrapper';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';
import { PERMISSIONS_ENUM } from './permissionsEnum';

const getSubmitCaption = ({ isSystemAdminView, selectedRole, isEdit, isSaving }) => {
  if (isSaving && isEdit) return 'Updating';
  if (isSaving && !isEdit) return 'Saving';
  if (isEdit && !isSaving) return 'Update';

  if (isSystemAdminView) {
    if (selectedRole === 'Customer Centre') {
      return 'Save And Continue';
    }
    return 'Add System Admin';
  }

  return 'Save and Continue';
};

const INITIAL_STATE = {
  permissions: {},
  role: null
};

const UserPermissions = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { isEdit, id } = useRouteMode({ editSegment: 'edit', paramKey: 'userId' });
  const { state, setValue } = useWidgetContext();
  const [alert, setAlert] = useState(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const [initialFormValues, setInitialFormValue] = React.useState(INITIAL_STATE);
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const userType = isSystemAdminView ? 'ADMIN' : 'GENERAL';
  const { selectedRole, userDetails = {}, createWizardSteps } = state;
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const { data: permissions } = useQuery({
    queryKey: ['users/permissions'],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.GET_PERMISSIONS(userType)}`, httpVerb.GET, {});
      return res.data || [];
    },
    select: (data) => {
      const groupedPermissions = {
        CREATE_NEW_ORDER: {},
        USER_MANAGEMENT: {},
        ADMIN_MANAGEMENT: {},
        ORGANIZATION_MANAGEMENT: {},
        ORDER_MANAGEMENT: {},
        SYSTEM_CONFIGURATION: {},
        PAYMENT_INVOICING: {},
        MANAGE_PROVIDERS: {},
        MANAGE_LINKED_ACCOUNTS: {}
      };

      data.forEach((permission) => {
        Object.entries(PERMISSIONS_ENUM).forEach(([key, value]) => {
          if (Object.values(value).includes(permission)) {
            groupedPermissions[key][permission] = permission;
          }
        });
      });
      const filteredPermissions = Object.fromEntries(Object.entries(groupedPermissions).filter(([key, value]) => Object.keys(value).length > 0));
      return filteredPermissions;
    },
    enabled: true,
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    if (userDetails.permissions && permissions) {
      const filteredPermissionsEnum = isSystemAdminView
        ? permissions || {}
        : Object.fromEntries(Object.entries(permissions || {}).filter(([key]) => key !== 'ORGANIZATION_MANAGEMENT'));
      const _permissions = {};
      Object.entries(filteredPermissionsEnum).map(([category, permissions]) => {
        Object.entries(permissions).map(([key, permission], idx) => {
          _permissions[key] = userDetails.permissions.includes(key) ? true : false;
        });
      });
      const formValues = {
        permissions: _permissions
      };
      if (userDetails.role) {
        formValues.role = {
          ...userDetails.role,
          label: userDetails.role.name === 'Customer Centre' ? 'Customer Service' : userDetails.role.name
        };
      }
      setInitialFormValue(formValues);
    }
  }, [state.userDetails, permissions]);

  const handleBack = () => {
    if (isEdit) {
      navigate(`./../..`);
    } else {
      navigate(`./../personal`, { state: { isBack: true } });
    }
  };

  const {
    mutate: savePermissions,
    isLoading: isSaving,
    isError: isSaveUserPermissionError,
    data: saveUserPermissionResponse
  } = useMutation({
    mutationFn: async (payload) => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${id}/roles-permissions?${serializeParams({ userType })}`, httpVerb.PATCH, payload);
      return res.data;
    },
    onSuccess: (response) => {
      setValue('userDetails', response);

      const isCustomerCentre = selectedRole === 'Customer Centre';

      if (isEdit) {
        if (!isSystemAdminView) {
          navigate(`./../..`, {
            state: {
              alert: {
                pinPoint: 'permissions',
                type: 'success',
                description: 'User role/permissions updated successfully.'
              }
            }
          });
          return;
        }

        navigate(`./../..`);
        return;
      }

      if (!isSystemAdminView) {
        setValue('createWizardSteps', {
          ...createWizardSteps,
          rolePermissions: true
        });
        navigate(`../${id}/${PATHS.ACCOUNTS}`);
        return;
      }

      if (isCustomerCentre) {
        setValue('createWizardSteps', {
          ...createWizardSteps,
          rolePermissions: true
        });
        navigate(`../${id}/${PATHS.MATERIAL}`);
        return;
      }

      navigate('./../../..', {
        search: '?tab=USERS',
        state: {
          alert: {
            type: 'success',
            description: 'New user created successfully.'
          }
        }
      });

      setValue('createWizardSteps', {});
    },
    onError: (error) => {
      setAlert({ type: 'error', description: t('errors.default') });
    }
  });

  const handleOnSubmit = (values) => {
    const payload = {
      roleId: values.role.id,
      permissions: Object.keys(values.permissions).filter((key) => values.permissions[key] === true)
    };
    if (!createWizardSteps.rolePermissions || isDirty) {
      savePermissions(payload);
      return;
    }

    if (!isSystemAdminView) {
      navigate(`../${id}/${PATHS.ACCOUNTS}`);
      return;
    }

    if (selectedRole === 'Customer Centre') {
      navigate(`../${id}/${PATHS.MATERIAL}`);
      return;
    }
  };

  return (
    <div className="MCP-module-wrapper">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <Formik initialValues={initialFormValues} enableReinitialize={true} onSubmit={handleOnSubmit} validateOnChange={false} validateOnBlur={true}>
        {({ dirty }) => {
          React.useEffect(() => {
            setIsDirty(dirty);
          }, [dirty]);

          return (
            <FormikFormWrapper disabled={isSaving}>
              <PermissionForm permissions={permissions} />
              <div className={'buttonGroup'}>
                <Button variant="secondary" type="button" onClick={handleBack} size={'md'}>
                  {t('userManagement.button.back')}
                </Button>
                <Button
                  disabled={!(isDirty || (!isEdit && createWizardSteps.rolePermissions))}
                  variant="primary"
                  isLoadingState={isSaving}
                  Icon={isSaving && ButtonLoadingIcon}
                  iconPosition="left"
                  type="submit"
                  size="md">
                  {getSubmitCaption({ isSystemAdminView, selectedRole, isEdit, isSaving })}
                </Button>
              </div>
            </FormikFormWrapper>
          );
        }}
      </Formik>
    </div>
  );
};

export default UserPermissions;
