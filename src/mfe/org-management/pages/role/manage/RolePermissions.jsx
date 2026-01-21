import React, { useState } from 'react';
import { Button, Loader } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import PageHeader from '@src/components/pageHeader';
import { useTranslate } from '@src/translations/useTranslation';
import { Formik } from 'formik';
import { useMutation, useQuery } from 'react-query';
import PermissionForm from '../../../../user-management/pages/UserPermissions/PermissionForm';
import HttpResourceService, { httpVerb } from '../../../../../api/HttpResourceService';
import ApiRoutes from '../../../../../api/ApiRoutes';
import { PATHS } from '../../../routes/constants';
import DiscardChangesModal from './DiscardChangesModel';
import Alert from '@src/components/cgat-alert/Alert';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import AuthUtils from '@src/util/AuthUtils';
import FormikFormWrapper from '@src/components/form/FormikFormWrapper';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';

const RolePermissions = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { roleId } = useParams();
  const location = useLocation();
  const row = location.state.data || null;
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const [initialFormValues, setInitialFormValue] = React.useState({});
  const [alert, setAlert] = useState(null);
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const { isEdit } = location.state || {};
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

      const filteredPermissions = Object.fromEntries(Object.entries(groupedPermissions).filter(([key, value]) => Object.keys(value).length > 0));
      return filteredPermissions;
    },
    enabled: true,
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    if (permissions) {
      const filteredPermissionsEnum = isSystemAdminView
        ? permissions || {}
        : Object.fromEntries(Object.entries(permissions || {}).filter(([key]) => key !== 'ORGANIZATION_MANAGEMENT'));

      const { permissions: existingPermissions, communicationPreferences, ...rest } = row;
      const _permissions = {};
      Object.entries(filteredPermissionsEnum).map(([_category, permissions]) => {
        Object.entries(permissions).map(([key, _permission]) => {
          _permissions[key] = existingPermissions.includes(key);
        });
      });

      setInitialFormValue({
        permissions: _permissions,
        role: {
          ...rest
        }
      });
    }
  }, [permissions, location.state]);

  const handleOnCancelButtonClick = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else navigate(isEdit ? `/admin/organization/roles/${roleId}` : `/admin/organization/${PATHS.roles}`);
  };

  const { mutate: updatePermissions, isLoading: isUpdating } = useMutation({
    mutationFn: async (data) => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.GET_ROLE_PERMISSIONS(roleId)}`, httpVerb.PATCH, data);
      return res;
    },
    onSuccess: (_response) => {
      if (isEdit) {
        navigate(`/admin/organization/roles/${roleId}`, {
          state: { alert: { type: 'success', description: 'Role permissions updated successfully.' } }
        });
      } else {
        navigate(`/admin/organization/roles/${roleId}/notification-permissions`);
      }
    },
    onError: (_error) => {
      setAlert({
        type: 'error',
        description: t('errors.default')
      });
    }
  });

  const handleGoBack = () => {
    if (isDirty) {
      setModalSuccessCallback('mainlist');
    } else {
      navigate(isEdit ? `/admin/organization/roles/${roleId}` : '/admin/organization/roles');
    }
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'back') navigate(`../${roleId}/edit-role`, { state: row });
    else if (modalSuccessCallback === 'list') {
      navigate(isEdit ? `/admin/organization/roles/${roleId}` : '/admin/organization/roles');
    } else if (modalSuccessCallback === 'mainlist') {
      navigate('/admin/organization/roles');
    }
  };

  const handleOnSubmit = (values) => {
    const { permissions = [] } = values;
    const payload = {
      permissions: Object.keys(permissions).filter((k) => permissions[k])
    };
    updatePermissions(payload);
  };

  let defaultRole = row ? row : null;

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t('orgManagement.role.captionsBtnBackToManageRoles')}
        </Button>
      </div>

      <ModuleHeader heading={<PageHeader heading={t('orgManagement.role.labelAddRole')} />} />
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <div className="MCP-module-body">
        <div>
          <Formik initialValues={initialFormValues} onSubmit={handleOnSubmit} enableReinitialize validateOnChange={false} validateOnBlur={true}>
            {({ dirty }) => {
              React.useEffect(() => {
                setIsDirty(dirty);
              }, [dirty]);
              return (
                <FormikFormWrapper disabled={isUpdating}>
                  <PermissionForm permissions={permissions} isRolePage={true} defaultRole={defaultRole} />
                  <div className={'buttonGroup'}>
                    <Button variant="secondary" type="button" onClick={handleOnCancelButtonClick} size={'md'}>
                      {t('orgManagement.button.cancel')}
                    </Button>
                    <Button
                      disabled={isUpdating || !isDirty}
                      variant="primary"
                      isLoadingState={isUpdating}
                      Icon={isUpdating && ButtonLoadingIcon}
                      iconPosition="left"
                      type="submit"
                      size="md">
                      {t('orgManagement.role.captionsBtnSaveAndCancel')}
                    </Button>
                  </div>
                </FormikFormWrapper>
              );
            }}
          </Formik>
        </div>
      </div>
      <DiscardChangesModal
        heading="Discard Changes"
        description="You have changed role permissions. Do you still want to go back? Your changes will be discarded!"
        isOpen={Boolean(modalSuccessCallback)}
        onClose={() => setModalSuccessCallback(null)}
        onConfirm={handleNavigate}
      />
    </div>
  );
};

export default RolePermissions;
