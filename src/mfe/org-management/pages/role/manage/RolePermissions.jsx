import React, { useEffect, useState } from 'react';
import { Button, Alert } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import PageHeader from '@src/components/pageHeader';
import { useTranslate } from '@src/translations/useTranslation';
import { Formik, Form } from 'formik';
import { useMutation } from 'react-query';
import PermissionForm from '../../../../user-management/pages/UserPermissions/PermissionForm';
import HttpResourceService, { httpVerb } from '../../../../../api/HttpResourceService';
import ApiRoutes from '../../../../../api/ApiRoutes';
import { PATHS } from '../../../routes/constants';
import { useRole } from '../../../context/RoleContext';
import DiscardChangesModal from './DiscardChangesModel';

function arePermissionsEqual(arr1, arr2) {
  if ((Array.isArray(arr1) && !arr2) || (Array.isArray(arr2) && !arr1)) return false;

  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  return sortedArr1.every((value, index) => value === sortedArr2[index]);
}

const RolePermissions = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { roleId } = useParams();
  const location = useLocation();
  const row = location.state.data || null;
  const { setMessage, messageConfig, clearMessage } = useRole();
  const [alert, setAlert] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [enabledPermissions, setEnabledPermissions] = React.useState(row?.permissions ? [...row.permissions] : []);
  const [inheritedRole, setInheritedRole] = React.useState(null);
  const { refreshData } = useRole();
  const { isEdit } = location.state || {};

  const handleOnCancelButtonClick = () => {
    if (!arePermissionsEqual(row?.permissions, enabledPermissions)) {
      setModalSuccessCallback('list');
    } else navigate(isEdit ? `/admin/organization/roles/${roleId}` : `/admin/organization/${PATHS.roles}`);
  };

  useEffect(() => {
    if (isAlertVisible) {
      const timer = setTimeout(() => {
        setIsAlertVisible(false);
      }, 10000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isAlertVisible]);

  const mutation = useMutation(
    async (data) => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.GET_ROLE_PERMISSIONS(roleId)}`, httpVerb.PATCH, data);

      return res;
    },
    {
      onSuccess: (res) => {
        const data = res?.data;
        refreshData();
        if (data) {
          if (row?.permissions) {
            setMessage(
              {
                primaryMessage: t('orgManagement.messages.roleUpdate'),
                kind: 'success'
              },
              10000
            );
          } else {
            setMessage(
              {
                primaryMessage: t('orgManagement.messages.newRoleCreation'),
                kind: 'success'
              },
              10000
            );
          }
          refreshData();
          navigate(isEdit ? `/admin/organization/roles/${roleId}` : `/admin/organization/${PATHS.roles}`);
        }
      },
      onError: (error) => {
        console.error('Error posting data:', error);

        setAlert({
          type: 'error',
          description: t('errors.default')
        });
        setIsAlertVisible(true);
      }
    }
  );

  const forms = React.useMemo(
    () => [
      {
        name: 'roleDetails',
        label: t('orgManagement.role.labelRolesDetails')
      },
      {
        name: 'addPermissions',
        label: t('orgManagement.role.labelAddPermissions')
      }
    ],
    [t]
  );

  const handleGoBack = () => {
    if (!arePermissionsEqual(row?.permissions, enabledPermissions)) {
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

  const handleSaveAndContinue = (values) => {
    const payload = {
      permissions: enabledPermissions
    };
    const permissions = Object.values(payload).flat();
    mutation.mutate(payload);
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t('orgManagement.role.captionsBtnBackToManageRoles')}
        </Button>
      </div>

      <ModuleHeader heading={<PageHeader heading={t('orgManagement.role.labelAddRole')} />} />
      {/* {messageConfig.messageKind && messageConfig.primaryMessage && <Alert onClose={clearMessage} description={messageConfig.primaryMessage} type={messageConfig.messageKind} />} */}
      {isAlertVisible && <Alert type={alert.type} title={alert.title} description={alert.description} />}

      <div className="MCP-module-body">
        {/* {!isEdit && (
          <Stepper
            activeIndex={2}
            dividerText="of"
            mobileLabel={t('orgManagement.role.labelStep')}
            stepHeaders={forms.map((f) => ({ label: f.label }))}
          />
        )} */}

        <div>
          <Formik
            initialValues={{}}
            onSubmit={(values, actions) => {
              handleSaveAndContinue(values);
            }}
            validateOnChange={false}
            validateOnBlur={true}>
            {({ values }) => {
              let defaultRole = row ? row : null;
              return (
                <Form>
                  <PermissionForm
                    enabledPermissions={enabledPermissions}
                    setEnabledPermissions={setEnabledPermissions}
                    onRoleChange={setInheritedRole}
                    handleRoleSelect={() => {}}
                    editRoleId={roleId}
                    isRolePage={true}
                    defaultRole={defaultRole}
                  />

                  <div className={'buttonGroup'}>
                    <Button variant="secondary" type="button" onClick={handleOnCancelButtonClick} size={'md'}>
                      {t('orgManagement.button.cancel')}
                    </Button>
                    <Button variant="primary" type="submit" size={'md'}>
                      {t('orgManagement.role.captionsBtnSaveAndCancel')}
                    </Button>
                  </div>
                </Form>
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
