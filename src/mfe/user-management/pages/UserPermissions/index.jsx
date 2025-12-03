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
import useUser from '../../useUser';

const UserPermissions = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const { isEdit = false, isBack = false } = location.state || {};
  const [alert, setAlert] = useState(null);
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const { isLoading, data: userDetails = {}, refetch } = useUser(userId, requestParams);
  const handleGoBack = () => {
    navigate(isEdit ? -1 : isSystemAdminView ? RoutePaths.pathSystemAdminManagement : RoutePaths.pathUserManagement);
  };

  const handleBack = () => {
    if (isEdit) {
      navigate(`../${userId}`);
    } else {
      navigate(`../${userId}/${PATHS.EDIT}`, { state: { isBack: true } });
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
      roleId: userDetails?.roleId ? userDetails?.roleId : values.roleId,
      permissions: values.permissions
    };

    savePermissions(
      { payload },
      {
        onSuccess: (response) => {
          if (isSystemAdminView) {
            navigate(isEdit ? `../${userId}` : RoutePaths.pathSystemAdminManagement, {
              state: { isSuccess: true }
            });
          } else {
            navigate(isEdit ? `../${userId}` : `../${userId}/${PATHS.ADD_ACCOUNTS}`);
          }
        },
        onError: (error) => {
          setAlert({ type: 'error', description: t('errors.default') });
        }
      }
    );
  };

  if (isLoading || isSavingUserPermission) {
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
      {!isEdit && !isSystemAdminView && (
        <div className="stepper">
          <UserCreationStepper activeIndex={2} />
        </div>
      )}
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <Formik
        initialValues={{
          permissions: userDetails.permissions || [],
          roleId: userDetails.role?.id
        }}
        enableReinitialize={true}
        onSubmit={handleSaveAndContinue}
        validateOnChange={false}
        validateOnBlur={true}>
        {({ values, setFieldValue, initialValues, isValid, handleSubmit, isDirty }) => {
          return (
            <Form>
              <PermissionForm
                enabledPermissions={values.permissions}
                setEnabledPermissions={(permissions) => setFieldValue('permissions', permissions)}
                handleRoleSelect={(value) => setFieldValue('roleId', value)}
                editRoleId={values.roleId}
                defaultRole={userDetails.role}
              />
              <div className={'buttonGroup'}>
                <Button variant="secondary" type="button" onClick={handleBack} size={'md'}>
                  {t('userManagement.button.back')}
                </Button>
                <Button variant="primary" type="submit" size={'md'}>
                  {isEdit
                    ? t('userManagement.label.save')
                    : t(isSystemAdminView ? 'userManagement.label.createSystemAdmin' : 'userManagement.button.savencontinue')}
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
