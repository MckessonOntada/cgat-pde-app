import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { Button, Heading, Switch } from '@mckesson/mcp-component-library';
import './index.scss';
import ModuleHeader from '@src/components/module-header';
import { useMutation, useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import CommonUtils from '@src/util/CommonUtils.js';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PermittedComponent from '@src/components/permitted-component';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import Alert from '@src/components/cgat-alert/Alert';
import { Form, Formik } from 'formik';
import NotificationPreferencePanel from '@src/mfe/core-config/notifications-setting/communication-preference-panel/NotificationPreferencePanel';
import notificationConfig from '@src/mfe/core-config/notifications-setting/communication-preference-panel/config';
import { getMergedPreferences } from '@src/mfe/core-config/notifications-setting/communication-preference-panel/helpers';
import { useWidgetContext } from '@src/context/WidgetContext';
import RoleService from '@src/api/commonService/RoleService';
import useRouteMode from '@src/mfe/user-management/routes/useRouteMode';

const RoleProfile = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useRouteMode({ editSegment: 'edit', paramKey: 'roleId' });
  const dispatch = useDispatch();
  const [alert, setAlert] = React.useState(null);
  const [preferencesConfig, setPreferenceConfig] = React.useState(notificationConfig);
  const { state, setValue } = useWidgetContext();
  const roleDetails = state?.roleDetails || null;

  const { data, isLoading: isCommPrefLoading } = useQuery({
    queryKey: ['role-communication-preferences', roleDetails?.id],
    queryFn: () => RoleService.getCommunicationPreferences(roleDetails?.id),
    enabled: !!roleDetails?.id
  });
  React.useEffect(() => {
    if (roleDetails && roleDetails.id && data?.preferences) {
      const updatedConfig = getMergedPreferences(notificationConfig, {}, data?.preferences);
      setPreferenceConfig(updatedConfig);
    }
  }, [roleDetails, data?.preferences]);
  React.useEffect(() => {
    const { alert } = location.state || {};
    if (alert) {
      setAlert(alert);
      navigate(`${location.pathname}${location.search}#${alert.pinPoint}`, { replace: true });
    }
  }, [location.state]);

  const handleGoBack = () => {
    navigate('/admin/organization/roles');
  };

  const { mutate: deactivateRole } = useMutation({
    mutationFn: async () => RoleService.deactivateRole(id),
    onSuccess: (data, variables, context) => {
      if (data && data === +id) {
        setValue('roleDetails', { ...roleDetails, isActive: false });
      }
      setAlert({
        type: 'success',
        description: t('orgManagement.messages.deleteRoleSuccess')
      });
    },
    onError: (error, variables, context) => {
      setAlert({
        type: 'error',
        description: t('errors.default')
      });
    }
  });

  const handleOnUserConfirmation = () => {
    const state = {};
    state.title = t('userManagement.confirmationMessage');
    state.body = (
      <div className="MCP-modal-body">
        <p>{t('orgManagement.message.roleDeactivateConfirmationDescription')}</p>
      </div>
    );
    state.footer = (
      <div className="controls">
        <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
          Cancel
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            deactivateRole();
            dispatch(closeModal());
          }}>
          {t('orgManagement.button.OK')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  const groupPermissionsByCategory = (rolePermissions, permissionsEnum) => {
    const groupedPermissions = {};

    rolePermissions.forEach((permission) => {
      Object.keys(permissionsEnum).forEach((category) => {
        const categoryPermissions = permissionsEnum[category];
        if (Object.values(categoryPermissions).includes(permission)) {
          if (!groupedPermissions[category]) {
            groupedPermissions[category] = [];
          }
          groupedPermissions[category].push(permission);
        }
      });
    });

    return groupedPermissions;
  };
  const groupedPermissions = groupPermissionsByCategory(roleDetails?.permissions || [], PERMISSIONS_ENUM);

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-wrapper">
        <div>
          <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
            {t('orgManagement.role.captionsBtnBackToManageRoles')}
          </Button>
        </div>
        {alert && !alert.pinPoint && <Alert {...alert} onClose={() => setAlert(null)} />}
        <div className="MCP-module-body">
          <ModuleHeader heading={<Heading as="h1">{t('orgManagement.role.labelRolesDetails')}</Heading>} />
          <div className="stack" id="details">
            <ModuleHeader
              heading={
                <div className="subheader-text">
                  <EclipsesTextcss str={roleDetails?.name} maxWidth={500} />
                </div>
              }
              controls={
                <PermittedComponent permissions={[PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_ROLES]}>
                  <Button
                    Icon={EditPencil}
                    variant="secondary"
                    className="button-icon"
                    size="md"
                    disabled={!roleDetails?.isActive}
                    onClick={() => navigate(`edit`)}>
                    {t('userManagement.button.edit')}
                  </Button>
                </PermittedComponent>
              }
            />
            {alert && alert.pinPoint === 'details' && <Alert {...alert} onClose={() => setAlert(null)} />}
            <div className="MCP-panel-container">
              <div className="role-header">
                <div className="role-info">
                  <p className="label-text">{roleDetails?.description || '-'}</p>
                </div>
                <div className="role-status">
                  <span className="view_label">{t('userManagement.label.createdOn')}:</span>
                  <span className="label-text">
                    {CommonUtils.convertDateStringFormat(roleDetails?.createdAt ? roleDetails?.createdAt : roleDetails?.updatedAt, 'MM/DD/YYYY')}
                  </span>
                  <PermittedComponent permissions={PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_ROLES}>
                    <Switch
                      handleToggle={handleOnUserConfirmation}
                      id="id"
                      disabled={!roleDetails?.isActive}
                      label={roleDetails?.isActive ? t('userManagement.status.active') : ''}
                      labelPosition="right"
                      name="Toggle"
                      size="lg"
                      value={roleDetails?.isActive}
                    />
                  </PermittedComponent>
                </div>
              </div>
            </div>
          </div>

          <div className="stack" id="permissions">
            <div className="secondryTitle">
              <ModuleHeader
                heading={<Heading as="h1">{t('userManagement.header.view.permissions_granted')}</Heading>}
                controls={
                  <div className="controls">
                    <PermittedComponent permissions={[PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_ROLES]}>
                      <Button
                        Icon={EditPencil}
                        variant="secondary"
                        className="button-icon"
                        size="md"
                        disabled={!roleDetails?.isActive}
                        onClick={() => navigate(`edit/permissions`)}>
                        {t('userManagement.button.edit')}
                      </Button>
                    </PermittedComponent>
                  </div>
                }
              />
            </div>
            {alert && alert.pinPoint === 'permissions' && <Alert {...alert} onClose={() => setAlert(null)} />}
            <div className="MCP-panel-container grid grid-gap-16">
              {roleDetails?.permissions?.length > 0 ? (
                Object.entries(groupedPermissions).map(([categoryKey, permissions]) => (
                  <div key={categoryKey} className="MCP-module-body permission-category">
                    <div className="subheader-text">{t(categoryKey)}</div>
                    <div className="permission-category">
                      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 permission-list">
                        {permissions.map((permissionKey, idx) => {
                          if (!PERMISSIONS_ENUM[categoryKey][permissionKey]) return null; // Validate if permission exists
                          return (
                            <React.Fragment key={idx}>
                              <div className="flex items-center justify-between permission-item">
                                <div className="permission-info">
                                  <h4>{t(`${categoryKey}.${permissionKey}`)}</h4>
                                  <p>{t(`${categoryKey}.${permissionKey}.DESCRIPTION`)}</p>
                                </div>
                              </div>
                              {idx % 2 === 0 && idx !== permissions.length - 1 && <div className="divider"></div>}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyDataTable
                  isLoading={false}
                  image={EmptyDataImage}
                  heading={t('userManagement.label.emptyPermissionListTitle')}
                  description={t('userManagement.label.emptyPermissionListSubtitle')}
                />
              )}
            </div>
          </div>

          <div className="stack" id="notification-preferences">
            <div className="secondryTitle">
              <ModuleHeader
                heading={<Heading as="h1">{t('label.Communication_Preference')}</Heading>}
                controls={
                  <div className="controls">
                    <PermittedComponent permissions={[PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_ROLES]}>
                      <Button
                        Icon={EditPencil}
                        variant="secondary"
                        className="button-icon"
                        size="md"
                        disabled={!roleDetails?.isActive}
                        onClick={() =>
                          navigate(`edit/notification-preferences`, {
                            state: {
                              communicationPreferences: data?.preferences,
                              isEdit: true,
                              permissions: roleDetails?.permissions
                            }
                          })
                        }>
                        {t('userManagement.button.edit')}
                      </Button>
                    </PermittedComponent>
                  </div>
                }
              />
            </div>
            {alert && alert.pinPoint === 'notification-preferences' && <Alert {...alert} onClose={() => setAlert(null)} />}
            <div className="MCP-panel-container grid grid-gap-16">
              {data?.preferences ? (
                <Formik initialValues={preferencesConfig} enableReinitialize={true}>
                  <Form>
                    <div className="MCP-panel-container">
                      <NotificationPreferencePanel
                        readOnly={true}
                        showLabels={true}
                        isLoadingPreferences={false}
                        emptyData={
                          <EmptyDataTable
                            isLoading={false}
                            image={EmptyDataImage}
                            heading={t('empty.role.No_communication_preferences_available')}
                            description={t('empty.role.Please_assign_communication_preference_to_see_it_here')}
                          />
                        }
                        config={{ ...preferencesConfig, userPermissions: roleDetails.permissions }}
                      />
                    </div>
                  </Form>
                </Formik>
              ) : (
                <EmptyDataTable
                  isLoading={false}
                  image={EmptyDataImage}
                  heading={t('empty.role.No_communication_preferences_available')}
                  description={t('empty.role.Please_assign_communication_preference_to_see_it_here')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleProfile;
