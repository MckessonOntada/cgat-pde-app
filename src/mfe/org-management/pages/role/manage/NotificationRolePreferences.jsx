import React from 'react';
import { Button, Loader } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import PageHeader from '@src/components/pageHeader';
import { useTranslate } from '@src/translations/useTranslation';
import Alert from '@src/components/cgat-alert/Alert';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { useMutation } from 'react-query';
import NotificationPreferencePanel from '@src/mfe/core-config/notifications-setting/communication-preference-panel/NotificationPreferencePanel';
import notificationConfig from '@src/mfe/core-config/notifications-setting/communication-preference-panel/config';
import { Form, Formik } from 'formik';
import { extractUserPreferences, getMergedPreferences } from '@src/mfe/core-config/notifications-setting/communication-preference-panel/helpers';

const NotificationRolePreferences = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { roleId } = useParams();
  const location = useLocation();
  const [alert, setAlert] = React.useState(null);
  const { isEdit, communicationPreferences } = location.state || {};
  const permissions = location.state?.data?.permissions || location.state?.permissions;
  const [preferencesConfig, setPreferenceConfig] = React.useState(notificationConfig);

  React.useEffect(() => {
    const updatedConfig = getMergedPreferences(preferencesConfig, communicationPreferences, {});
    setPreferenceConfig(updatedConfig);
  }, []);

  const handleGoBack = () => {
    navigate(isEdit ? `/admin/organization/roles/${roleId}` : `/admin/organization/roles/${roleId}/permissions`, {
      state: { ...location.state, backFromPreferences: true }
    });
  };
  const { mutate, isLoading } = useMutation(
    async (data) => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.GET_COMMUNICATION_PREFERENCES(roleId)}`, httpVerb.PATCH, data);
      return res;
    },
    {
      onSuccess: (res) => {
        const data = res?.data;
        if (data) {
          navigate(isEdit ? `/admin/organization/roles/${roleId}` : `/admin/organization/roles`, {
            state: {
              showAlert: {
                type: 'success',
                description: t(isEdit ? 'orgManagement.messages.roleUpdate' : 'orgManagement.messages.newRoleCreation')
              }
            }
          });
        }
      },
      onError: (error) => {
        console.error('Error posting data:', error);
        setAlert({
          type: 'error',
          description: t('errors.default')
        });
      }
    }
  );
  const handleSubmit = (values) => {
    const payload = extractUserPreferences(values);
    mutate(payload);
  };
  if (isLoading) {
    return <Loader type={'screen'} />;
  }
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={IconArrowLeft} onClick={handleGoBack} size="md">
          {t(isEdit ? 'control.Back_to_role_details_page' : 'orgManagement.role.captionsBtnBackToManageRoles')}
        </Button>
      </div>

      <ModuleHeader heading={<PageHeader heading={t(isEdit ? 'label.Edit_Role' : 'orgManagement.role.labelAddRole')} />} />
      {alert && <Alert type={alert.type} title={alert.title} description={alert.description} />}

      <Formik initialValues={preferencesConfig} enableReinitialize={true} onSubmit={handleSubmit}>
        <Form>
          <div className="MCP-module-body">
            <div className="MCP-panel-container">
              <NotificationPreferencePanel
                readOnly={false}
                showLabels={true}
                isLoadingPreferences={false}
                allPreferred={true}
                config={{ ...preferencesConfig, userPermissions: permissions }}
              />
            </div>
            <div className={'buttonGroup'}>
              <Button variant="secondary" type="button" onClick={handleGoBack} size={'md'}>
                {t('userManagement.button.back')}
              </Button>
              <Button variant="primary" type="submit" onClick={handleSubmit} size={'md'}>
                {t(isEdit ? 'control.Update_Role' : 'control.Create_Role')}
              </Button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default NotificationRolePreferences;
