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
import UserCreationStepper from '../CreateUser/UserCreationStepper';
import useUser from '../../useUser';
import { useWidgetContext } from '@src/context/WidgetContext';
import useRouteMode from '../../routes/useRouteMode';

const UserPermissions = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { isEdit, id } = useRouteMode({ editSegment: 'edit', paramKey: 'userId' });
  const { getValue } = useWidgetContext();
  const [alert, setAlert] = useState(null);
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };
  const selectedRole = getValue('selectedRole');
  const { isLoading, data: userDetails = {}, refetch } = useUser(id, requestParams);
  const handleGoBack = () => {
    navigate(isEdit ? -1 : isSystemAdminView ? RoutePaths.pathSystemAdminManagement : RoutePaths.pathUserManagement);
  };

  const handleBack = () => {
    if (isEdit) {
      navigate(`../${id}`);
    } else {
      navigate(`../${id}/${PATHS.EDIT}`, { state: { isBack: true } });
    }
  };

  const {
    mutate: savePermissions,
    isLoading: isSavingUserPermission,
    isError: isSaveUserPermissionError,
    data: saveUserPermissionResponse
  } = useMutation(async ({ payload }) => {
    const res = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${id}/roles-permissions?${serializeParams(requestParams)}`, httpVerb.PATCH, payload);
    return res.data;
  });

  const handleOnSubmit = (values) => {
    const payload = {
      roleId: userDetails?.roleId ? userDetails?.roleId : values.roleId,
      permissions: values.permissions
    };

    savePermissions(
      { payload },
      {
        onSuccess: (response) => {
          if (isSystemAdminView) {
            if (selectedRole === 'Customer Centre') {
              navigate(isEdit ? `../${id}` : `../${id}/${PATHS.MATERIAL}`);
            } else {
              navigate(isEdit ? `../${id}` : RoutePaths.pathSystemAdminManagement, {
                state: { isSuccess: true }
              });
            }
          } else {
            navigate(isEdit ? `../${id}` : `../${id}/${PATHS.ACCOUNTS}`);
          }
        },
        onError: (error) => {
          setAlert({ type: 'error', description: t('errors.default') });
        }
      }
    );
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

  if (isLoading || isSavingUserPermission) {
    return <Loader type={'screen'} />;
  }

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {translationConfig.backButtonLabel}
        </Button>
      </div>
      <ModuleHeader heading={<Heading as="h1">{translationConfig.heading}</Heading>} />
      {!isEdit && (
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
        onSubmit={handleOnSubmit}
        validateOnChange={false}
        validateOnBlur={true}>
        {({ values, setFieldValue }) => {
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
                  {translationConfig.saveButtonLabel}
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
