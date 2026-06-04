import React from 'react';
import { Button, Loader } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import PageHeader from '@src/components/pageHeader';
import { useTranslate } from '@src/translations/useTranslation';
import Alert from '@src/components/cgat-alert/Alert';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import NotificationPreferencePanel from '@src/mfe/core-config/notifications-setting/communication-preference-panel/NotificationPreferencePanel';
import notificationConfig from '@src/mfe/core-config/notifications-setting/communication-preference-panel/config';
import { Form, Formik } from 'formik';
import { extractUserPreferences, getMergedPreferences } from '@src/mfe/core-config/notifications-setting/communication-preference-panel/helpers';
import RoleService from '@src/api/commonService/RoleService';
import { useWidgetContext } from '@src/context/WidgetContext';
import useRouteMode from '@src/mfe/user-management/routes/useRouteMode';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';
import FormikFormWrapper from '@src/components/form/FormikFormWrapper';

const getSubmitButtonCaption = ({ isEdit, isSaving }) => {
  if (isSaving && isEdit) return 'Updating';
  if (isSaving && !isEdit) return 'Creating';
  if (!isSaving && isEdit) return 'Update Preferences';
  return 'Create Role';
};

const NotificationRolePreferences = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [alert, setAlert] = React.useState(null);
  const [initialValue, setInitialValue] = React.useState(notificationConfig);
  const { state, setValue } = useWidgetContext();
  const { roleDetails, createWizardSteps } = state;
  const { isEdit, id, params } = useRouteMode({ editSegment: 'edit', paramKey: 'roleId' });
  const [isDirty, setIsDirty] = React.useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading: isCommPrefLoading } = useQuery({
    queryKey: ['role-communication-preferences', roleDetails?.id],
    queryFn: () => RoleService.getCommunicationPreferences(roleDetails?.id),
    enabled: !!roleDetails?.id
  });
  React.useEffect(() => {
    const updatedConfig = getMergedPreferences(initialValue, data?.preferences ?? {}, {});
    setInitialValue(updatedConfig);
  }, [data]);

  const handleOnBack = () => {
    navigate(isEdit ? `./../..` : `./../permissions`);
  };

  const { mutate: updateCommunicationPreferences, isLoading: isSaving } = useMutation({
    mutationFn: async (data) => RoleService.updateCommunicationPreferences(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries('role-communication-preferences', roleDetails?.id);
      setValue('roleDetails', data);
      if (data) {
        if (isEdit) {
          navigate(`./../..`, {
            state: {
              alert: {
                pinPoint: 'notification-preferences',
                type: 'success',
                description: t(isEdit ? 'Communication preferences updated successfully.' : 'orgManagement.messages.newRoleCreation')
              }
            }
          });
        } else {
          setValue('createWizardSteps', {
            ...createWizardSteps,
            permissions: true
          });
          navigate(`./../../..`, {
            state: {
              alert: {
                type: 'success',
                description: 'New role created successfully.'
              }
            }
          });
        }
      }
    },
    onError: (error) => {
      setAlert({
        type: 'error',
        description: t('errors.default')
      });
    }
  });

  const handleOnSubmit = (values) => {
    const payload = extractUserPreferences(values);
    updateCommunicationPreferences(payload);
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={IconArrowLeft} onClick={handleOnBack} size="md">
          {t(isEdit ? 'control.Back_to_role_details_page' : 'orgManagement.role.captionsBtnBackToManageRoles')}
        </Button>
      </div>

      <ModuleHeader heading={<PageHeader heading={t(isEdit ? 'Update Communication Preferences' : 'orgManagement.role.labelAddRole')} />} />
      {alert && <Alert type={alert.type} title={alert.title} description={alert.description} />}

      <Formik initialValues={initialValue} enableReinitialize={true} onSubmit={handleOnSubmit}>
        {({ dirty }) => {
          React.useEffect(() => {
            setIsDirty(dirty);
          }, [dirty]);
          return (
            <FormikFormWrapper disabled={isSaving}>
              <div className="MCP-module-body">
                <div className="MCP-panel-container">
                  <NotificationPreferencePanel
                    readOnly={false}
                    showLabels={true}
                    isLoadingPreferences={false}
                    allPreferred={true}
                    config={{ ...initialValue, userPermissions: roleDetails.permissions }}
                  />
                </div>
                <div className={'buttonGroup'}>
                  <Button variant="secondary" type="button" onClick={handleOnBack} size={'md'}>
                    {t('userManagement.button.back')}
                  </Button>
                  <Button
                    disabled={isSaving || !isDirty}
                    variant="primary"
                    isLoadingState={isSaving}
                    Icon={isSaving && ButtonLoadingIcon}
                    iconPosition="left"
                    type={'submit'}
                    size="md">
                    {getSubmitButtonCaption({ isEdit, isSaving })}
                  </Button>
                </div>
              </div>
            </FormikFormWrapper>
          );
        }}
      </Formik>
    </div>
  );
};

export default NotificationRolePreferences;
