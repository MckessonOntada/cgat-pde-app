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
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { PATHS } from '../../routes/constants';
import './index.scss';
import PermissionForm from './PermissionForm';
import { useWidgetContext } from '@src/context/WidgetContext';
import useRouteMode from '../../routes/useRouteMode';
import FormikFormWrapper from '@src/components/form/FormikFormWrapper';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';
import { PERMISSIONS_ENUM } from './permissionsEnum';

const UserPermissions = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { isEdit, id } = useRouteMode({ editSegment: 'edit', paramKey: 'userId' });
  const { state, setValue } = useWidgetContext();
  const [alert, setAlert] = useState(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const [initialFormValues, setInitialFormValue] = React.useState({});
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };
  const selectedRole = state.selectedRole;
  const userDetails = state.userDetails || {};
  const userType = isSystemAdminView ? 'ADMIN' : 'GENERAL';
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
      debugger;
      const filteredPermissions = Object.fromEntries(Object.entries(groupedPermissions).filter(([key, value]) => Object.keys(value).length > 0));
      return filteredPermissions;
    },
    enabled: true,
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    if (userDetails.id && permissions) {
      const filteredPermissionsEnum = isSystemAdminView
        ? permissions || {}
        : Object.fromEntries(Object.entries(permissions || {}).filter(([key]) => key !== 'ORGANIZATION_MANAGEMENT'));
      const _permissions = {};
      Object.entries(filteredPermissionsEnum).map(([category, permissions]) => {
        Object.entries(permissions).map(([key, permission], idx) => {
          _permissions[key] = userDetails.permissions.includes(key) ? true : false;
        });
      });

      setInitialFormValue({
        permissions: _permissions,
        role: userDetails.role
      });
    }
  }, [state.userDetails, permissions]);

  const handleBack = () => {
    if (isEdit) {
      navigate(`../${id}`);
    } else {
      navigate(`../${id}/personal`, { state: { isBack: true } });
    }
  };

  const {
    mutate: savePermissions,
    isLoading: isSaving,
    isError: isSaveUserPermissionError,
    data: saveUserPermissionResponse
  } = useMutation({
    mutationFn: async (payload) => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${id}/roles-permissions?${serializeParams(requestParams)}`, httpVerb.PATCH, payload);
      return res.data;
    },
    onSuccess: (response) => {
      setValue('userDetails', response);
      if (isSystemAdminView) {
        if (selectedRole === 'Customer Centre') {
          navigate(isEdit ? `../../${id}` : `../${id}/${PATHS.MATERIAL}`);
        } else {
          navigate(isEdit ? `../../${id}` : RoutePaths.pathSystemAdminManagement, {
            state: { isSuccess: true }
          });
        }
      } else {
        if (isEdit) {
          navigate(`../../${id}`, {
            state: {
              alert: {
                type: 'success',
                description: 'User role/permissions updated successfully.'
              }
            }
          });
        } else {
          navigate(`../${id}/${PATHS.ACCOUNTS}`);
        }
      }
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

    savePermissions(payload);
  };

  const translationConfig = React.useMemo(() => {
    const config = {};

    if (isEdit) {
      if (isSystemAdminView) {
        config.heading = t('userManagement.edit_sysadmin');
      } else {
        config.heading = t('userManagement.edit_organization_user');
      }

      config.saveButtonLabel = t('userManagement.label.save');
      config.backButtonLabel = t('userManagement.back_to_user_details');
    } else {
      if (isSystemAdminView) {
        config.heading = t('userManagement.create_sysadmin');

        if (selectedRole === 'Customer Centre') {
          config.saveButtonLabel = t('userManagement.button.savencontinue');
        } else {
          config.saveButtonLabel = t('userManagement.label.createSystemAdmin');
        }

        config.backButtonLabel = t('userManagement.sysadmin.backmessage');
      } else {
        config.heading = t('userManagement.create_organization_user');
        config.saveButtonLabel = t('userManagement.button.savencontinue');
        config.backButtonLabel = t('userManagement.user.backmessage');
      }
    }

    return config;
  }, [isEdit, isSystemAdminView, selectedRole]);

  return (
    <div className="MCP-module-wrapper">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <Formik initialValues={initialFormValues} enableReinitialize={true} onSubmit={handleOnSubmit} validateOnChange={false} validateOnBlur={true}>
        {({ values, setFieldValue, dirty }) => {
          React.useEffect(() => {
            console.log(values);
            setIsDirty(dirty);
          }, [dirty]);
          return (
            <FormikFormWrapper disabled={isSaving}>
              <PermissionForm
                permissions={permissions}
                setEnabledPermissions={(permissions) => setFieldValue('permissions', permissions)}
                handleRoleSelect={(value) => setFieldValue('roleId', value)}
                defaultRole={userDetails.role}
              />
              <div className={'buttonGroup'}>
                <Button variant="secondary" type="button" onClick={handleBack} size={'md'}>
                  {t('userManagement.button.back')}
                </Button>
                <Button
                  disabled={!isDirty}
                  variant="primary"
                  isLoadingState={isSaving}
                  Icon={isSaving && ButtonLoadingIcon}
                  iconPosition="left"
                  type="submit"
                  size="md">
                  {translationConfig.saveButtonLabel}
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
