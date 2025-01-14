import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { Badge, Button, Heading, Switch, Alert, Modal, CheckboxGroup } from '@mckesson/mcp-component-library';
import './index.scss';
import { PERMISSIONS_ENUM } from '../UserPermissions/permissionsEnum';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { PATHS } from '../../routes/constants';
import ModuleHeader from '@src/components/module-header';
import { useQuery, useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import CommonUtils from '@src/util/CommonUtils.js';
import { RoutePaths } from '@src/routes/constants';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import UserAccounts from '@src/components/Accounts/Accounts';
import { useDispatch } from 'react-redux';
import PermittedComponent from '@src/components/permitted-component';

function getBackgroundColorByRole(role) {
  switch (role) {
    case 'ORGANIZATION ADMIN':
      return 'success';
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
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [searchText, setSearchText] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [alertDescription, setAlertDescription] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const location = useLocation();
  const isSuccess = location.state?.isSuccess || false;
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeactivate, setIsDeactivate] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = React.useState(false);
  const isImpersonateLoggedIn = Boolean(AuthUtils.getImpersonateId());
  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: [`users/${userId}`],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${userId}?${serializeParams(requestParams)}`, httpVerb.GET, {});
      return res.data;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (!isSuccess) return;

    setIsAlertVisible(true);
    setAlertDescription(`${location.state.recCount} new accounts have been successfully linked to this user.`);

    const timer = setTimeout(handleAlertClose, 10000);

    return () => clearTimeout(timer);
  }, [isSuccess, location.pathname, location.state, navigate]);

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    navigate(location.pathname, { replace: true, state: { ...location.state, isSuccess: false } });
  };

  const goBack = () => {
    navigate(isSystemAdminView ? RoutePaths.pathSystemAdminManagement : RoutePaths.pathUserManagement);
  };

  const onRemoveAccount = useCallback(
    (item) => {
      setSelectedAccounts(selectedAccounts.filter((account) => account.id !== item.id));
    },
    [selectedAccounts, setSelectedAccounts]
  );

  const handleSearchChange = (inputValue) => {
    setSearchText(inputValue);
  };

  const handleDeactivateUser = async (userId) => {
    const res = await HttpResourceService.callRest(
      `${ApiRoutes.USERS()}/${userId}?${serializeParams(requestParams)}`,
      httpVerb.DELETE,
      null
    );
    return res.data;
  };

  const { mutate } = useMutation({
    mutationFn: handleDeactivateUser,
    onSuccess: (response) => {
      refetch();
      setIsDeactivate(true);
      setIsAlertVisible(true);
      setAlertDescription(t('messages.user_deactivate_success'));
    },
    onError: (error) => {
      console.error(`Failed to deactivate user:`, error);
      setIsDeactivate(true);
      setIsAlertVisible(true);
      setAlertDescription(t('messages.user_deactivate_failure'));
    }
  });

  const handleDeactivate = () => {
    setIsOpen(true);
  };

  const handleConfirmDeactivate = () => {
    setIsOpen(false);
    mutate(userId);
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

  const handleOnConsentConfirm = () => {
    const selectedUserId = data.id;
    if (selectedUserId) {
      impersonatePromise(selectedUserId)
        .then((message) => {
          navigate('/');
        })
        .catch((error) => {
          console.log(`error ${error}`);
        });
    } else {
      throw new Error('Something went wrong. Missing user identifier or invalid permission list.');
    }
  };

  const groupedPermissions = groupPermissionsByCategory(data?.permissions || [], PERMISSIONS_ENUM);
  const userFullName = `${data?.name.lastName} ${data?.name.firstName},${data?.name.middleName}`;
  const loggedUserId = Number(AuthUtils.getUserId());

  const prePermissions = data?.isActive && data?.id !== loggedUserId && !isImpersonateLoggedIn && !AuthUtils.isSystemAdmin();

  return (
    <div className="MCP-module-wrapper">
      <div className="back-navigation py2 capitalize" onClick={goBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>{t(isSystemAdminView ? 'userManagement.sysadmin.backmessage' : 'userManagement.user.backmessage')}</p>
      </div>

      {isDeactivate && isAlertVisible && (
        <Alert description={alertDescription} onClose={handleAlertClose} type="success" duration={10000} />
      )}
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('userManagement.header.view.edit_user')}</Heading>}
          controls={
            prePermissions && (
              <PermittedComponent permissions={PERMISSIONS_ENUM.USER_MANAGEMENT.ON_BEHALF_OF_USER}>
                <Button variant="primary" size="md" onClick={() => setIsConsentModalOpen(true)}>
                  {t('button.label.loginAsThisUser')}
                </Button>
              </PermittedComponent>
            )
          }
        />
        <ModuleHeader
          heading={
            <div className="subheader-text">
              <EclipsesTextcss str={userFullName} maxWidth={500} />
            </div>
          }
          controls={
            <Button
              Icon={EditPencil}
              variant="secondary"
              className="button-icon"
              size="md"
              disabled={!data?.isActive}
              onClick={() => navigate(`../${PATHS.editUser}/${userId}`, { state: { isEdit: true } })}>
              {t('userManagement.button.edit')}
            </Button>
          }
        />

        <div className="MCP-panel-container">
          <div className="user-header">
            <div className="user-info">
              {data?.role?.name && <Badge text={data?.role?.name} type={getBackgroundColorByRole(data?.role?.name)} />}
            </div>
            <div className="user-status">
              <span className="view_label">{t('userManagement.userDetails.lastUpdatedOn')}</span>

              <span className="label-text">
                {' '}
                {data?.updatedAt
                  ? CommonUtils.convertDateStringFormat(data.updatedAt, 'MM-DD-YYYY')
                  : data?.createdAt
                  ? CommonUtils.convertDateStringFormat(data.createdAt, 'MM-DD-YYYY')
                  : 'N/A'}
              </span>
              <Switch
                handleToggle={handleDeactivate}
                id="id"
                disabled={!data?.isActive}
                label={data?.isActive ? t('userManagement.status.active') : ''}
                labelPosition="right"
                name="Toggle"
                size="lg"
                value={data?.isActive}
              />
            </div>
          </div>

          <div className="userCardContainer grid grid-gap-24 grid-cols-1 md:grid-cols-4">
            <div>
              <span className="view_label">{t('userManagement.userDetails.userAddress')}</span>
              <p className="label-text">
                {data?.address.address1}, {data?.address.address2}
              </p>
            </div>

            <div>
              <span className="view_label">{t('userManagement.create_user.inputLabel.email')}</span>
              <p className="label-text">{data?.contact.email}</p>
            </div>

            <div>
              <span className="view_label">{t('userManagement.create_user.inputLabel.phone_no')}</span>
              <p className="label-text"> {data?.contact.phone ? CommonUtils.formatPhoneNumber(data.contact.phone) : 'N/A'} </p>
            </div>

            <div>
              <span className="view_label">{t('userManagement.create_user.inputLabel.fax')}</span>
              <p className="label-text">{data?.contact.fax}</p>
            </div>

            <div>
              <span className="view_label">{t('userManagement.create_user.inputLabel.city')}</span>
              <p className="label-text">{data?.address.city}</p>
            </div>

            <div>
              <span className="view_label">{t('userManagement.create_user.inputLabel.zip')}</span>
              <p className="label-text"> {data?.address.zip}</p>
            </div>

            <div>
              <span className="view_label">{t('userManagement.create_user.inputLabel.state')}</span>
              <p className="label-text">{data?.address.state}</p>
            </div>
          </div>
        </div>

        <ModuleHeader
          heading={<Heading as="h1">{t('userManagement.header.view.permissions_granted')}</Heading>}
          controls={
            <div className="controls">
              <Button
                Icon={EditPencil}
                variant="secondary"
                className="button-icon"
                size="md"
                disabled={!data?.isActive}
                onClick={() => navigate(`../${PATHS.userPermissions}/${userId}`, { state: { isEdit: true, permissionsData: data } })}>
                {t('userManagement.button.edit')}
              </Button>
            </div>
          }
        />

        <div className="MCP-panel-container grid grid-gap-16">
          {data?.permissions?.length > 0 ? (
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
              heading={t('message.emptyTableTitle')}
              description={t('userManagement.messages.emptysubtitle')}
            />
          )}
        </div>

        {!isSystemAdminView && (
          <div className="MCP-module-body">
            <ModuleHeader
              heading={<Heading as="h1">{t('userManagement.header.view.linked_accounts')}</Heading>}
              controls={
                <div className="controls">
                  <Button
                    Icon={EditPencil}
                    variant="secondary"
                    className="button-icon"
                    size="md"
                    disabled={!data?.isActive}
                    onClick={() => navigate(`../${PATHS.addAccounts}/${userId}`, { state: { isEdit: true } })}>
                    {t('userManagement.button.edit')}
                  </Button>
                </div>
              }
            />
            {isSuccess && isAlertVisible && (
              <Alert
                description={alertDescription} //Number should be dynamic --To Do
                onClose={handleAlertClose}
                type="success"
                duration={10000}
              />
            )}
            {data?.practiceId && (
              <UserAccounts
                selectableRows={false}
                omitColumns={['distributionChannel']}
                practiceId={data?.practiceId}
                showSelectedAccounts={false}
                userId={userId}
              />
            )}
          </div>
        )}
      </div>

      <Modal
        {...{
          id: 'xxxs-modal',
          isOpen,
          onClose: () => setIsOpen(false),
          modalTitle: 'Confirmation message',
          modalBody: <h3>Are you sure you wish to Deactivate this User ?</h3>,
          modalFooter: (
            <React.Fragment>
              <Button onClick={handleConfirmCancel} variant="secondary">
                {t('userManagement.label.cancel')}
              </Button>
              <Button onClick={handleConfirmDeactivate}>{t('userManagement.button.deactivate')}</Button>
            </React.Fragment>
          ),
          modalSize: 'xxxs'
        }}
      />
      {isConsentModalOpen && (
        <ConsentModal userFullName={userFullName} onYes={handleOnConsentConfirm} onNo={() => setIsConsentModalOpen(false)} />
      )}
    </div>
  );
};

const ConsentModal = ({ userFullName, onYes, onNo }) => {
  const { t } = useTranslate();
  const [consentCheckboxOption, setConsentCheckboxOption] = React.useState({
    isDisabled: false,
    isChecked: false,
    label: t('popup.message.wishToContinueLoginAsThisUserCheckBoxConsent'),
    value: false
  });

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
            <p>{t('popup.message.wishToContinueLoginAsThisUserDescription').replace('{{targetUser}}', userFullName)}</p>
            <div>
              <CheckboxGroup
                id={'default'}
                name="order-agreement"
                items={[{ ...consentCheckboxOption, onChange: handleOnLoginAsConsentChange }]}
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
            <Button variant="primary" size="md" onClick={onYes} disabled={!consentCheckboxOption.isChecked}>
              {t('label.yes')}
            </Button>
          </div>
        ),
        modalSize: 'md'
      }}
    />
  );
};

export default UserDetail;
