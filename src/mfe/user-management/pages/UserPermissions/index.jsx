import { Button, Heading, Loader } from '@mckesson/mcp-component-library';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import Alert from '@src/components/cgat-alert/Alert';
import ModuleHeader from '@src/components/module-header';
import { RoutePaths } from '@src/routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import { PATHS } from '../../routes/constants';
import './index.scss';
import PermissionForm from './PermissionForm';
import UserCreationStepper from '../UserCreationStepper';

const UserPermissions = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const { permissionsData, isEdit = false, isBack = false } = location.state || {};
  const [alert, setAlert] = useState(null);
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const isSystemAdminView = AuthUtils.isSystemAdminView();

  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const handleGoBack = () => {
    navigate(isEdit ? -1 : isSystemAdminView ? RoutePaths.pathSystemAdminManagement : RoutePaths.pathUserManagement);
  };

  const handleBack = () => {
    if (isEdit) {
      navigate(`../${PATHS.userDetail.replace(':userId', userId)}`);
    } else {
      navigate(`../${PATHS.EDIT}/${userId}`, { state: { isBack: true, permissionsData: permissionsData } });
    }
  };

  const isFormValuesChanged = (initialValues, currentValues) => {
    const isRoleChanged = initialValues.roleId !== currentValues.roleId;
    return isRoleChanged;
  };

  const {
    mutate: savePermissions,
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

    savePermissions(
      { payload },
      {
        onSuccess: (response) => {
          if (isSystemAdminView) {
            navigate(isEdit ? `../${PATHS.userDetail.replace(':userId', userId)}` : RoutePaths.pathSystemAdminManagement, {
              state: { isSuccess: true }
            });
          } else {
            navigate(isEdit ? `../${PATHS.userDetail.replace(':userId', userId)}` : `../${userId}/${PATHS.ADD_ACCOUNTS}`, {
              state: { permissionsData: payload }
            });
          }
        },
        onError: (error) => {
          setAlert({ type: 'error', description: t('errors.default') });
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
          {t(isEdit ? 'userManagement.back_to_user_details' : isSystemAdminView ? 'userManagement.sysadmin.backmessage' : 'userManagement.user.backmessage')}
        </Button>
      </div>
      <ModuleHeader heading={<Heading as="h1">{t(isEdit ? 'userManagement.edit_user' : 'userManagement.create_user')}</Heading>} />
      {!isEdit && !isSystemAdmin && (
        <div className="stepper">
          <UserCreationStepper activeIndex={2} />
        </div>
      )}
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <Formik
        initialValues={{
          permissions: permissionsData?.permissions || [],
          roleId: isBack ? permissionsData.roleid : permissionsData?.role?.id || ''
        }}
        onSubmit={handleSaveAndContinue}
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
                  setAlert({ type: 'error', description: 'Please provide required values.' });
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
