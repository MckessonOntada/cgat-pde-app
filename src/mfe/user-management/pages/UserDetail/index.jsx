import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { ReactComponent as AddIcon } from '@src/assets/svg/add-icon.svg';
import { Badge, Button, Heading, Switch, Modal, CheckboxGroup, IconButton, Loader, Tooltip } from '@mckesson/mcp-component-library';
import './index.scss';
import { PERMISSIONS_ENUM } from '../UserPermissions/permissionsEnum';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { PATHS } from '../../routes/constants';
import ModuleHeader from '@src/components/module-header';
import { useQuery, useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import CommonUtils, { formatFields } from '@src/util/CommonUtils.js';
import { RoutePaths } from '@src/routes/constants';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import UserAccounts from '@src/components/Accounts/Accounts';
import PermittedComponent from '@src/components/permitted-component';
import { CUSTOMER_CENTRE, CUSTOMER_SERVICE } from '@src/api/commonService/CommonService';
import Alert from '@src/components/cgat-alert/Alert';
import NotificationPreferencePanel from '@src/mfe/core-config/notifications-setting/communication-preference-panel/NotificationPreferencePanel';
import { Form, Formik } from 'formik';
import notificationConfig from '@src/mfe/core-config/notifications-setting/communication-preference-panel/config';
import { getMergedPreferences } from '@src/mfe/core-config/notifications-setting/communication-preference-panel/helpers';
import UserMaterial from '../CreateUser/UserMaterial';
import UserService from '@src/api/commonService/UserService';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';
import { useWidgetContext } from '@src/context/WidgetContext';
import MaterialWrapper from '../CreateUser/MaterialWrapper';

function getBackgroundColorByRole(role) {
  switch (role) {
    case 'ORGANIZATION ADMIN':
      return '#DEEBF0';
    case 'ORGANIZATION USER':
      return 'primary';
    default:
      return 'info';
  }
}

const impersonatePromise = (selectedUserId) => {
  return new Promise(async function (resolve, reject) {
    try {
      await AuthUtils.setImpersonateId(selectedUserId);
      resolve('Logged in as impersonate');
    } catch (error) {
      reject('Failed to login as impersonate');
    }
  });
};

const UserDetail = () => {
  const { t: translateFn } = useTranslate();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [alert, setAlert] = useState(null);
  const [isPhysicianUser, setIsPhysicianUser] = useState(false);
  const location = useLocation();
  const { isPending = false, isEdit = false } = location.state || {};
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [isProvisioned, setIsProvisioned] = useState(false);
  const [isConsentError, setIsConsentError] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = React.useState(false);
  const isImpersonateLoggedIn = Boolean(AuthUtils.getImpersonateId());
  const isSelf = userId === AuthUtils.getUserId();
  const [preferencesConfig, setPreferenceConfig] = useState(notificationConfig);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);
  const disablePay = useRef(false);
  const { state, setValue } = useWidgetContext();
  const [selectedUserInfo, setSelectedUserInfo] = useState({
    userId: null,
    isActive: false
  });

  const {
    isLoading,
    data: userDetails = {},
    refetch,
    isError,
    error
  } = useQuery({
    queryKey: [`users/${userId}`],
    queryFn: () => UserService.getUserDetails(userId, requestParams, isPending),
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setValue('userDetails', data);
      const u = data?.userCommunicationPreferences?.preferences;
      const r = data?.role?.communicationPreferences?.preferences;
      const updated = getMergedPreferences(preferencesConfig, u, r);

      setPreferenceConfig(updated);
      setIsPreferencesLoaded(true);

      const role = data?.role;
      setIsPhysicianUser(AuthUtils.isPhysician(role?.name, role?.id));
    },
    select: (data) => {
      if (!data.communicationPreferences) data.communicationPreferences = {};
      return data;
    }
  });

  useEffect(() => {
    if (isEdit) {
      setIsProvisioned(true);
      setAlert({
        description: translateFn('userManagement.message.updateUser'),
        type: 'success'
      });
      navigate(location.pathname);
    }
  }, [isEdit]);

  React.useEffect(() => {
    const { alert } = location.state || {};
    if (alert) {
      setAlert(alert);
      navigate(`${location.pathname}${location.search}#${alert.pinPoint}`, { replace: true });
    }
  }, [location.state]);

  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const handleClickLogin = () => {
    if (disablePay.current) return;
    disablePay.current = setTimeout(() => {
      setIsConsentModalOpen(true);
      disablePay.current = null;
    }, 500);
  };

  const mutation = useMutation(
    async () => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${userId}/retry-okta-provisioning`, httpVerb.POST, null);
      return res.data;
    },
    {
      onSuccess: () => {
        setIsProvisioned(true);
        setAlert({
          description: translateFn('messages.provisionedsuccess'),
          type: 'success'
        });
      },
      onError: () => {
        setIsProvisioned(true);
        setAlert({
          description: translateFn('messages.provisionederrror'),
          type: 'error'
        });
      }
    }
  );

  useEffect(() => {
    if (userDetails?.provisionedInOktaStatus !== 'PROVISIONED' && userDetails?.isActive) {
      setIsProvisioned(true);
      setAlert({
        type: 'error',
        description: translateFn('userManagement.provision.message', {
          click: (
            <span>
              <IconButton label={translateFn('userManagement.button.clickhere')} size="lg" iconButton={false} textButton={true} onClick={handleRetry} />
            </span>
          )
        })
      });
    }
  }, [userDetails?.provisionedInOktaStatus]);

  React.useEffect(() => {
    const alert = location.state?.alert;
    if (!isSystemAdminView && alert) {
      setAlert(alert);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  const handleAlertClose = () => {
    setAlert(null);
    navigate(location.pathname, {
      replace: true,
      state: { isSuccess: false }
    });
  };

  const goBack = () => {
    navigate(isSystemAdminView ? RoutePaths.pathSystemAdminManagement : RoutePaths.pathUserManagement, { state: { isBack: true } });
  };

  const handleRetry = () => {
    if (userId) {
      mutation.mutate();
    }
  };

  const handleActivateDeactivateUser = async ({ userId, isActive }) => {
    let res;
    if (isActive) {
      res = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${userId}?${serializeParams(requestParams)}`, httpVerb.DELETE, null);
    } else {
      res = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${userId}/activate?${serializeParams(requestParams)}`, httpVerb.PATCH, null);
    }
    return res.data;
  };

  const { mutate } = useMutation({
    mutationFn: handleActivateDeactivateUser,
    onSuccess: () => {
      refetch();
      setAlert({
        description: translateFn(selectedUserInfo?.isActive ? 'messages.user_deactivate_success' : 'messages.user_activate_success'),
        type: 'success'
      });
    },
    onError: (error) => {
      setAlert({
        description: translateFn(selectedUserInfo?.isActive ? 'messages.user_deactivate_failure' : 'messages.user_activate_failure'),
        type: 'error'
      });
    }
  });

  const handleActivateDeactivate = () => {
    setIsOpen(true);
  };

  const handleConfirmActivateDeactivate = () => {
    setIsOpen(false);
    mutate(selectedUserInfo);
  };

  const handleConfirmCancel = () => {
    setIsOpen(false);
  };

  const groupPermissionsByCategory = (userPermissions, permissionsEnum) => {
    const groupedPermissions = {};

    userPermissions.forEach((permission) => {
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
  const handleOnBehalfNotification = async () => {
    const res = await HttpResourceService.callRest(`${ApiRoutes.PUBLIC_ORGANIZATIONS}/${userDetails?.practiceId}/on-behalf-notification`, httpVerb.POST);
    return res.data;
  };

  const { mutate: OnBehalfNotification } = useMutation({
    mutationFn: handleOnBehalfNotification,
    onSuccess: () => {},
    onError: () => {
      setAlert({
        description: translateFn('errors.default'),
        type: 'error'
      });

      setIsConsentModalOpen(false);
      setIsConsentError(true);
    }
  });

  const handleOnConsentConfirm = async (selectedUserId) => {
    try {
      await impersonatePromise(selectedUserId);
      await new Promise((resolve, reject) => {
        OnBehalfNotification(null, {
          onSuccess: () => {
            navigate('/?expelled=true');
            resolve();
          },
          onError: (error) => {
            reject(error);
          }
        });
      });
    } catch (error) {}
  };

  const groupedPermissions = groupPermissionsByCategory(userDetails?.permissions || [], PERMISSIONS_ENUM);
  const userFullName = CommonUtils.getFullName(userDetails?.name); //`${data?.name.lastName} ${data?.name.firstName}${data?.name.middleName ? `, ${data?.name.middleName}` : ''}`;
  const loggedUserId = Number(AuthUtils.getUserId());

  const prePermissions = userDetails?.isActive && userDetails?.id !== loggedUserId && !isImpersonateLoggedIn && !isSystemAdminView;
  if (isLoading) {
    return <Loader type={'screen'} />;
  }
  if (isError) {
    const statusCode = error?.response?.status;
    let description = translateFn('error.default');
    if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

    return <Alert type="error" description={description} />;
  }
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={goBack} size="md">
          {translateFn(isSystemAdminView ? 'userManagement.sysadmin.backmessage' : 'userManagement.user.backmessage')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{translateFn('userManagement.header.view.edit_user')}</Heading>}
          controls={
            prePermissions && (
              <PermittedComponent permissions={PERMISSIONS_ENUM.USER_MANAGEMENT.ON_BEHALF_OF_USER}>
                <Tooltip body={userDetails?.role == null || userDetails?.permissions?.length === 0 ? 'User must have a role and at least one permission.' : ''}>
                  <span>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={(e) => handleClickLogin(e)}
                      disabled={userDetails?.role == null || userDetails?.permissions?.length === 0}>
                      {translateFn('button.label.loginAsThisUser')}
                    </Button>
                  </span>
                </Tooltip>
              </PermittedComponent>
            )
          }
        />
        {alert && !alert.pinPoint && <Alert {...alert} onClose={handleAlertClose} />}

        <ModuleHeader
          heading={
            <div className="subheader-text">
              <Heading as="h2" className="entity-name">
                <EclipsesTextcss str={userFullName} maxWidth={500} />
              </Heading>
            </div>
          }
          controls={
            !isPhysicianUser && (
              <PermittedComponent permissions={PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_USERS}>
                <Button
                  Icon={EditPencil}
                  variant="secondary"
                  className="button-icon"
                  size="md"
                  disabled={!userDetails?.isActive || isSelf}
                  onClick={() =>
                    navigate(`${PATHS.EDIT}`, {
                      state: { isEdit: true }
                    })
                  }>
                  {translateFn('userManagement.button.edit')}
                </Button>
              </PermittedComponent>
            )
          }
        />

        <div className="MCP-panel-container">
          <div className="user-header">
            <div className="user-info">
              {userDetails?.role?.name && (
                <Badge
                  text={userDetails?.role?.name === CUSTOMER_CENTRE ? CUSTOMER_SERVICE : userDetails?.role?.name}
                  type={getBackgroundColorByRole(userDetails?.role?.name)}
                  customStyle={{
                    background: '#DEEBF0',
                    color: '#254E56'
                  }}
                />
              )}
            </div>
            <div className="user-status">
              <span className="view_label">{translateFn('userManagement.userDetails.lastUpdatedOn')}</span>
              <span className="label-text">
                {' '}
                {userDetails?.updatedAt
                  ? CommonUtils.convertDateStringFormat(userDetails.updatedAt, 'MM/DD/YYYY')
                  : userDetails?.createdAt
                  ? CommonUtils.convertDateStringFormat(userDetails.createdAt, 'MM/DD/YYYY')
                  : 'N/A'}
              </span>
              {!isPhysicianUser && (
                <PermittedComponent permissions={PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_USERS}>
                  <Switch
                    handleToggle={() => {
                      setSelectedUserInfo({
                        userId: userDetails?.id,
                        isActive: userDetails?.isActive
                      });
                      handleActivateDeactivate();
                    }}
                    id="id"
                    disabled={(!isSystemAdmin && !userDetails?.isActive) || (isSystemAdmin && isSelf && userDetails?.isActive) || isSelf}
                    label={userDetails?.isActive ? translateFn('userManagement.status.active') : ''}
                    labelPosition="right"
                    name="Toggle"
                    size="lg"
                    value={userDetails?.isActive}
                  />
                </PermittedComponent>
              )}
            </div>
          </div>

          <div className="userCardContainer grid grid-gap-24 grid-cols-1 md:grid-cols-4">
            <div>
              <span className="view_label">{translateFn('userManagement.userDetails.userAddress')}</span>
              <p className="label-text">{formatFields(userDetails?.address, ['address1', 'address2'])}</p>
            </div>
            <div>
              <span className="view_label">{translateFn('userManagement.create_user.inputLabel.email')}</span>
              <p className="label-text">{userDetails?.contact.email}</p>
            </div>
            <div>
              <span className="view_label">{translateFn('userManagement.create_user.inputLabel.phone_no')}</span>
              <p className="label-text"> {userDetails?.contact.phone ? CommonUtils.formatPhoneNumber(userDetails.contact.phone) : 'N/A'} </p>
            </div>
            <div>
              <span className="view_label">{translateFn('userManagement.create_user.inputLabel.fax')}</span>
              <p className="label-text">{userDetails?.contact.fax || '-'}</p>
            </div>

            <div>
              <span className="view_label">{translateFn('userManagement.create_user.inputLabel.city')}</span>
              <p className="label-text">{userDetails?.address.city}</p>
            </div>

            <div>
              <span className="view_label">{translateFn('userManagement.create_user.inputLabel.zip')}</span>
              <p className="label-text"> {userDetails?.address.zip}</p>
            </div>

            <div>
              <span className="view_label">{translateFn('userManagement.create_user.inputLabel.state')}</span>
              <p className="label-text">{userDetails?.address.state}</p>
            </div>
          </div>
        </div>

        <div className="MCP-module-body">
          <div id="permissions" className="stack">
            <div className="secondryTitle">
              <ModuleHeader
                heading={<Heading as="h2">{translateFn('userManagement.header.view.permissions_granted')}</Heading>}
                controls={
                  !isPhysicianUser && (
                    <PermittedComponent permissions={PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_USERS}>
                      <div className="controls">
                        <Button
                          Icon={EditPencil}
                          variant="secondary"
                          className="button-icon"
                          size="md"
                          disabled={!userDetails?.isActive || isSelf}
                          onClick={() => navigate(`edit/${PATHS.PERMISSIONS}`)}>
                          {translateFn('userManagement.button.edit')}
                        </Button>
                      </div>
                    </PermittedComponent>
                  )
                }
              />
            </div>
            {alert && alert.pinPoint === 'permissions' && <Alert {...alert} onClose={handleAlertClose} />}
            <div className="MCP-panel-container grid grid-gap-16">
              {userDetails?.permissions?.length > 0 ? (
                Object.entries(groupedPermissions).map(([categoryKey, permissions]) => (
                  <div key={categoryKey} className="MCP-module-body permission-category">
                    <div className="subheader-text">{translateFn(categoryKey)}</div>
                    <div className="permission-category">
                      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 permission-list">
                        {permissions.map((permissionKey, idx) => {
                          if (!PERMISSIONS_ENUM[categoryKey][permissionKey]) return null; // Validate if permission exists

                          return (
                            <React.Fragment key={idx}>
                              <div className="flex items-center justify-between permission-item">
                                <div className="permission-info">
                                  <h4>{translateFn(`${categoryKey}.${permissionKey}`)}</h4>
                                  <p>{translateFn(`${categoryKey}.${permissionKey}.DESCRIPTION`)}</p>
                                </div>
                              </div>
                              {/* Add a divider dynamically */}
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
                  isLoading={isLoading}
                  image={EmptyDataImage}
                  heading={translateFn('userManagement.message.userPermissionEmptyTableTitle')}
                  description={translateFn('userManagement.messages.emptysubtitle')}
                />
              )}
            </div>
          </div>

          {!isSystemAdminView && (
            <div id="accounts" className="stack">
              <ModuleHeader
                heading={<Heading as="h2">{translateFn('userManagement.header.view.linked_accounts')}</Heading>}
                controls={
                  !isPhysicianUser && (
                    <PermittedComponent permissions={PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_USERS}>
                      <div className="controls">
                        <Button
                          Icon={EditPencil}
                          variant="secondary"
                          className="button-icon"
                          size="md"
                          disabled={!userDetails?.isActive}
                          onClick={() => navigate(`edit/${PATHS.ACCOUNTS}`)}>
                          {translateFn('userManagement.button.edit')}
                        </Button>
                      </div>
                    </PermittedComponent>
                  )
                }
              />
              {alert && alert.pinPoint === 'accounts' && <Alert {...alert} onClose={handleAlertClose} />}
              {userDetails?.practiceId && (
                <UserAccounts
                  selectableRows={false}
                  omitColumns={['distributionChannel']}
                  practiceId={userDetails?.practiceId}
                  showSelectedAccounts={false}
                  userId={userId}
                  isPhysicianUser={isPhysicianUser}
                />
              )}
            </div>
          )}
          {(state.selectedRole === 'Customer Centre' || !isSystemAdminView) && (
            <div id="materials" className="stack">
              <ModuleHeader
                heading={<Heading as="h2">{translateFn('userManagement.header.view.linkedMaterials')}</Heading>}
                controls={
                  !isPhysicianUser && (
                    <PermittedComponent permissions={PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_USERS}>
                      <div className="controls">
                        <Button
                          Icon={AddIcon}
                          variant="secondary"
                          className="button-icon"
                          size="md"
                          disabled={!userDetails?.isActive}
                          onClick={() => navigate(`edit/${PATHS.MATERIAL}`)}>
                          {translateFn('userManagement.button.linkMaterials')}
                        </Button>
                      </div>
                    </PermittedComponent>
                  )
                }
              />
              {alert && alert.pinPoint === 'materials' && <Alert {...alert} onClose={handleAlertClose} />}
              <div>
                <MaterialWrapper listingMode="INCLUDED">
                  <UserMaterial onAlert={setAlert} searchPlaceholder={translateFn('placeholder.materialTable')} />
                </MaterialWrapper>
              </div>
            </div>
          )}
          {!isSystemAdminView && (
            <PermittedComponent permissions={PERMISSIONS_ENUM.USER_MANAGEMENT.ON_BEHALF_OF_USER}>
              <div id="notification-preferences" className="MCP-module-wrapper">
                <div className="MCP-module-body">
                  <ModuleHeader
                    heading={<Heading as="h2">{translateFn('Notification Preferences')}</Heading>}
                    controls={
                      <PermittedComponent permissions={PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_USERS}>
                        <div className="controls">
                          <Button
                            Icon={EditPencil}
                            variant="secondary"
                            className="button-icon"
                            size="md"
                            onClick={() => navigate(`${`./edit/${PATHS.NOTIFICATION_PREFERENCES}`}`)}>
                            {translateFn('userManagement.button.edit')}
                          </Button>
                        </div>
                      </PermittedComponent>
                    }
                  />

                  {alert && alert.pinPoint === 'notification_preferences' && <Alert {...alert} onClose={handleAlertClose} />}

                  <Formik initialValues={preferencesConfig} enableReinitialize={true}>
                    <Form>
                      <div className="MCP-panel-container">
                        <NotificationPreferencePanel
                          readOnly={true}
                          showLabels={true}
                          isPreferencesLoaded={isPreferencesLoaded}
                          isLoadingPreferences={isLoading}
                          config={{ ...preferencesConfig, userPermissions: userDetails.permissions || [] }}
                        />
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </PermittedComponent>
          )}
        </div>
      </div>
      <Modal
        {...{
          id: 'xxxs-modal',
          isOpen,
          onClose: () => setIsOpen(false),
          modalTitle: translateFn('userManagement.confirmationMessage'),
          modalBody: (
            <div className="MCP-modal-body">
              <p>{translateFn(selectedUserInfo?.isActive ? 'popup.userDeactivation.question' : 'popup.userActivation.question')}</p>
            </div>
          ),
          modalFooter: (
            <React.Fragment>
              <Button size="md" onClick={handleConfirmCancel} variant="secondary">
                {translateFn('userManagement.label.cancel')}
              </Button>
              <Button size="md" onClick={handleConfirmActivateDeactivate}>
                {translateFn(selectedUserInfo?.isActive ? 'userManagement.button.deactivate' : 'userManagement.button.activate')}
              </Button>
            </React.Fragment>
          ),
          modalSize: 'xxxs'
        }}
      />
      {isConsentModalOpen && (
        <ConsentModal userFullName={userFullName} onYes={() => handleOnConsentConfirm(userDetails.id)} onNo={() => setIsConsentModalOpen(false)} />
      )}
    </div>
  );
};

const ConsentModal = ({ userFullName, onYes, onNo }) => {
  const { t } = useTranslate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [consentCheckboxOption, setConsentCheckboxOption] = React.useState({
    isDisabled: isLoading,
    isChecked: false,
    label: t('popup.message.wishToContinueLoginAsThisUserCheckBoxConsent'),
    value: false
  });

  const handleOnYes = (...args) => {
    setIsLoading(true);
    const updatedOptions = {
      ...consentCheckboxOption,
      isDisabled: true
    };
    setConsentCheckboxOption({ ...updatedOptions });
    onYes && onYes(args);
  };

  const handleOnLoginAsConsentChange = (args) => {
    const updatedOptions = {
      ...consentCheckboxOption,
      isChecked: args.target.checked
    };
    setConsentCheckboxOption({ ...updatedOptions });
  };

  return (
    <Modal
      {...{
        id: 'default-modal',
        isOpen: true,
        onClose: onNo,
        modalTitle: t('popup.title.alert'),
        modalBody: (
          <div className="MCP-modal-body">
            <Heading as="h6">{t('popup.message.wishToContinueLoginAsThisUserQuestion')}</Heading>
            <p>
              {t('popup.message.wishToContinueLoginAsThisUserDescription', {
                targetUser: userFullName
              })}
            </p>
            <div className="checkboxGroup">
              <CheckboxGroup
                id={'login-on-behalf-checkbox'}
                name="login-on-behalf"
                items={[
                  {
                    ...consentCheckboxOption,
                    onChange: handleOnLoginAsConsentChange
                  }
                ]}
                size="md"
              />
            </div>
          </div>
        ),
        modalFooter: (
          <div className="controls">
            <Button variant="secondary" size="md" onClick={onNo}>
              {t('label.no')}
            </Button>
            <Button
              variant="primary"
              isLoadingState={isLoading}
              Icon={isLoading && ButtonLoadingIcon}
              iconPosition="left"
              size="md"
              onClick={handleOnYes}
              disabled={!consentCheckboxOption.isChecked || isLoading}>
              {isLoading ? 'Loading' : t('label.yes')}
            </Button>
          </div>
        ),
        modalSize: 'md'
      }}
    />
  );
};

export default UserDetail;
