import React, { useState } from 'react';
import { Stepper, Button, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import ModuleHeader from '@src/components/module-header';
import './index.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '../../routes/constants';
import { Form, Formik } from 'formik';
import PermissionForm from './PermissionForm';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import { RoutePaths } from '@src/routes/constants';

const UserPermissions = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const { permissionsData, isEdit } = location.state || {};
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alert, setAlert] = useState(null);
  const isSystemAdminView = AuthUtils.isSystemAdminView();

  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
  };

  const handleGoBack = () => {
    navigate(RoutePaths.pathUserManagement);
  };

  const handleBack = () => {
    navigate(isEdit ? `../${PATHS.userDetail.replace(':userId', userId)}` : `../${PATHS.editUser}/${userId}`);
  };

  const isFormValuesChanged = (initialValues, currentValues) => {
    if (isSystemAdminView) {
      return true; // Return true always if it is a system admin view
    }
    const isRoleChanged = initialValues.roleId !== currentValues.roleId;
    const arePermissionsChanged = JSON.stringify(initialValues.permissions) !== JSON.stringify(currentValues.permissions);
    return isRoleChanged;
  };

  const {
    mutate,
    isLoading: isSavingUserPermission,
    isError: isSaveUserPermissionError,
    data: saveUserPermissionResponse
  } = useMutation(async ({ payload }) => {
    const res = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${userId}/roles-permissions?${serializeParams(requestParams)}`, httpVerb.PATCH, payload);
    return res.data;
  });

  const handleSaveAndContinue = (values) => {
    const payload = {
      roleId: isSystemAdminView ? 1 : values.roleId,
      permissions: values.permissions
    };

    mutate(
      { payload },
      {
        onSuccess: (response) => {
          console.log('User created/updated successfully:', response);
          navigate(isEdit ? `../${PATHS.userDetail.replace(':userId', userId)}` : `../${PATHS.addAccounts}/${userId}`);
        },
        onError: (error) => {
          setAlert({ type: 'error', message: 'Failed to create/update Permissions' });
          setIsAlertVisible(true);
        }
      }
    );
  };

  return (
    <div className="MCP-module-wrapper">
      <div className="back-navigation py2 capitalize" onClick={handleGoBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>Back to Manage Users</p>
      </div>
      <ModuleHeader heading={<p className="primaryHeading">{t('userManagement.create_user')}</p>} />

      {!isEdit && (
        <div className="stepper">
          <Stepper
            activeIndex={2}
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
        initialValues={{
          permissions: permissionsData?.permissions || [],
          roleId: permissionsData?.role?.id || ''
        }}
        onSubmit={(values) => {
          handleSaveAndContinue(values);
        }}
        validateOnChange={false}
        validateOnBlur={true}>
        {({ values, setFieldValue, initialValues, isValid }) => {
          const isDirty = isEdit || isFormValuesChanged(initialValues, values);

          return (
            <Form>
              <PermissionForm enabledPermissions={values.permissions} setEnabledPermissions={(permissions) => setFieldValue('permissions', permissions)} handleRoleSelect={(value) => setFieldValue('roleId', value)} editRoleId={values.roleId} />
              <div className={'buttonGroup'}>
                <Button variant="secondary" type="button" onClick={handleBack} size={'md'}>
                  {t('userManagement.button.back')}
                </Button>
                <Button variant="primary" type="submit" size={'md'} disabled={!(isValid && isDirty)}>
                  {t('userManagement.button.savencontinue')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default UserPermissions;
