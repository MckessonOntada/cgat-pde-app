import React, { useState } from 'react';
import { Stepper, Heading, Button, Alert, Loader } from '@mckesson/mcp-component-library';
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
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';

const UserPermissions = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const { permissionsData, isEdit = false, isBack = false } = location.state || {};
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alert, setAlert] = useState(null);
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const isSystemAdminView = AuthUtils.isSystemAdminView();

  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
  };

  const handleGoBack = () => {
    navigate(isSystemAdminView ? RoutePaths.pathSystemAdminManagement : RoutePaths.pathUserManagement);
  };

  const handleBack = () => {
    if (isEdit) {
      navigate(`../${PATHS.userDetail.replace(':userId', userId)}`);
    } else {
      navigate(`../${PATHS.editUser}/${userId}`, { state: { isBack: true, permissionsData: permissionsData } });
    }
  };

  const isFormValuesChanged = (initialValues, currentValues) => {
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
    const res = await HttpResourceService.callRest(
      `${ApiRoutes.USERS()}/${userId}/roles-permissions?${serializeParams(requestParams)}`,
      httpVerb.PATCH,
      payload
    );
    return res.data;
  });

  const handleSaveAndContinue = (values) => {
    const payload = {
      roleId: permissionsData?.roleId ? permissionsData?.roleId : values.roleId,
      permissions: values.permissions
    };

    mutate(
      { payload },
      {
        onSuccess: (response) => {
          console.log('User created/updated successfully:', response);
          if (isSystemAdminView) {
            navigate(isEdit ? `../${PATHS.userDetail.replace(':userId', userId)}` : RoutePaths.pathUserManagement, {
              state: { isSuccess: true }
            });
          } else {
            navigate(isEdit ? `../${PATHS.userDetail.replace(':userId', userId)}` : `../${PATHS.addAccounts}/${userId}`, {
              state: { permissionsData: payload }
            });
          }
        },
        onError: (error) => {
          setAlert({ type: 'error', message: 'Failed to create/update Permissions' });
          setIsAlertVisible(true);
        }
      }
    );
  };
  if (isSavingUserPermission) {
    return <Loader type={'screen'} />;
  }

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t(isSystemAdminView ? 'userManagement.sysadmin.backmessage' : 'userManagement.user.backmessage')}
        </Button>
      </div>
      <ModuleHeader heading={<Heading as="h1">{t(isEdit ? 'userManagement.edit_user' : 'userManagement.create_user')}</Heading>} />
      {!isEdit && !isSystemAdmin && (
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
          roleId: isBack ? permissionsData.roleid : permissionsData?.role?.id || ''
        }}
        onSubmit={(values) => {
          handleSaveAndContinue(values);
        }}
        validateOnChange={false}
        validateOnBlur={true}>
        {({ values, setFieldValue, initialValues, isValid, handleSubmit }) => {
          const isDirty = (isEdit && values.roleId) || isBack || permissionsData?.roleId || isFormValuesChanged(initialValues, values);
          let defaultRole = permissionsData ? permissionsData.role : null;
          return (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                if (!(isDirty && isValid)) {
                  setAlert({ type: 'error', message: 'Please provide required values.' });
                  setIsAlertVisible(true);
                  return;
                }
                handleSubmit();
              }}>
              <PermissionForm
                enabledPermissions={values.permissions}
                setEnabledPermissions={(permissions) => setFieldValue('permissions', permissions)}
                handleRoleSelect={(value) => setFieldValue('roleId', value)}
                editRoleId={values.roleId ? values.roleId : permissionsData?.roleId}
                defaultRole={defaultRole}
              />
              <div className={'buttonGroup'}>
                <Button variant="secondary" type="button" onClick={handleBack} size={'md'}>
                  {t('userManagement.button.back')}
                </Button>
                <Button variant="primary" type="submit" size={'md'}>
                  {t(isSystemAdminView ? 'userManagement.label.save' : 'userManagement.button.savencontinue')}
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
