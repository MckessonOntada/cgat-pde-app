import { Button, MenuList, Modal } from '@mckesson/mcp-component-library';
import { useOktaAuth } from '@okta/okta-react';
import AuthService from '@src/api/authService/AuthService';
import { ReactComponent as AppLogo } from '@src/assets/svg/HeaderLogo.svg';
import { ReactComponent as IconArrowDown } from '@src/assets/svg/arrow-down-filled.svg';
import { ReactComponent as IconNotification } from '@src/assets/svg/bell.svg';
import { ReactComponent as IconMenu } from '@src/assets/svg/burger-menu.svg';
import { ReactComponent as IconLogout } from '@src/assets/svg/logout.svg';
import { debugIds, ID } from '@src/constants/id';
import { useNotifications } from '@src/mfe/notification-mfe/context/NotificationsContext';
import { setUserData } from '@src/store/reducer/userReducer';
import { useTranslate } from '@src/translations/useTranslation';
import { getFullName } from '@src/util/CommonUtils';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { connect } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CommonDataService from '../../api/commonService/CommonDataService';
import useSessionFeatures from '../../hooks/useSessionFeatures';
import AuthUtils from '../../util/AuthUtils';
import EclipsesTextcss from '../EclipsesText/EclipsesTextcss';
import FloatingDrawer from '../floating-drawer';
import styles from './assets/styles/Header.module.scss';
import { profileOptions } from './constants';

const PrimaryHeader = ({ onNotificationClick }) => {
  const { t } = useTranslate();
  const { oktaAuth, authState } = useOktaAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [textMaxWidth, setTextMaxWidth] = useState('');
  const [filteredProfileOptions, setFilteredProfileOptions] = useState(profileOptions);
  const navigate = useNavigate();
  const location = useLocation();

  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const userName = AuthUtils.getFullName();
  const impersonatedByUser = AuthUtils.getImpersonatedByUser();
  const impersonatedUserName = getFullName(impersonatedByUser?.name);
  const channel = new BroadcastChannel('auth_channel');
  const { unreadCount: notificationsCount = 0 } = useNotifications() || {};

  useEffect(() => {
    if (!AuthUtils.isRootAdmin()) {
      setFilteredProfileOptions((prev) => [...prev, { label: 'Notification Settings', value: '/notification-setting' }]);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setTextMaxWidth(window.innerWidth <= 992 && window.innerWidth >= 768 ? 160 : '');
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const requestParams = useMemo(
    () => ({
      pageNo: 0,
      pageSize: 12,
      sortBy: 'name',
      sortOrder: 'asc'
    }),
    []
  );

  const { data } = useQuery({
    queryKey: ['organizationListOptions'],
    queryFn: async () => {
      const res = await CommonDataService.getOrganizationListAsPublic(requestParams);
      return res.content;
    },
    enabled: !isSystemAdminView,
    refetchOnWindowFocus: false
  });

  const {
    organization: { setOrganization, selectedOrganization }
  } = useSessionFeatures();

  const { data: organizationLogo } = CommonDataService.useOrganizationLogo(selectedOrganization.logoUrl, selectedOrganization.id);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  const confirmChangeOrganization = () => {
    setIsOpen(false);
    const _selectedOrg = data?.find((i) => i.id == selectedOrg);
    setOrganization(_selectedOrg || {});
    location.pathname === '/' ? window.location.reload() : navigate('/');
  };

  const onCancelOrganizationChange = () => {
    setIsOpen(false);
    setSelectedOrg(null);
  };

  const logout = () => {
    channel.postMessage({ type: 'LOGOUT' });
    AuthService.userLogout(oktaAuth);
  };

  const handleNotificationClick = (closeDrawer) => {
    onNotificationClick?.();
    if (closeDrawer) setDrawerOpen(false);
  };

  const isNewTab = location.pathname === '/contact-us';

  const LeftSideView = ({ children }) => (
    <div className={styles.navItemsLeft}>
      <div className={styles.branding}>
        {isSystemAdminView ? (
          <Link className={`${styles.appLogo} ${styles.actionLink}`} to="" aria-label="dashboard">
            {children}
          </Link>
        ) : (
          <Link to="" className={styles.customheader}>
            {organizationLogo && (
              <div className={styles.logoContainer}>
                <img src={organizationLogo} alt="org-logo" />
              </div>
            )}
            <h2>{selectedOrganization.name}</h2>
          </Link>
        )}
      </div>
    </div>
  );

  const RightSideView = ({ notificationsCount, handleNotificationClick }) => {
    const handleSelectOption = (option) => navigate(option);
    const quickLinks = [
      <button
        key="notification"
        type="button"
        className={styles.actionLink}
        aria-label="View notifications"
        onClick={handleNotificationClick}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
        <span>{t('header.label.notifications')}</span>
        <IconNotification />
        {notificationsCount > 0 && <span className={styles.notificationsCount}>{notificationsCount > 99 ? '99+' : notificationsCount}</span>}
      </button>,
      <MenuList key="menu" size="md" handleSelect={(e) => handleSelectOption(e)} options={filteredProfileOptions} aria-label="Profile options">
        <div className={styles.actionLink} aria-label="Account options">
          <span>
            <EclipsesTextcss str={impersonatedUserName || userName || 'Anonymous'} maxWidth={textMaxWidth} />
          </span>
          <IconArrowDown />
        </div>
      </MenuList>,
      <Button
        key="logout"
        label={'button.logout'}
        aria-label="Log out of account"
        Icon={IconLogout}
        iconPosition="right"
        id={debugIds(ID.HEADER, ID.NAV, ID.RIGHT, ID.BUTTON, ID.LOGOUT)}
        data-testid="LOGOUT"
        size="sm"
        variant="primary"
        onClick={logout}>
        {t('header.label.logout')}
      </Button>
    ];

    return (
      <div className={styles.navItemsRight}>
        <ul className={styles.quickLinks} role="navigation" aria-label="Quick access links">
          {quickLinks.map((item, index) => (
            <li className={styles.linkWrapper} key={`quick-links-item-${index}`}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const RightSideMobile = ({ onClose, notificationsCount, handleNotificationClick }) => (
    <ul className={styles.quickLinksMobile} role="navigation" aria-label="Quick access links">
      <li className={styles.linkWrapperMobile}>
        <div aria-label="Account options">
          <EclipsesTextcss str={impersonatedUserName || userName || 'Anonymous'} maxWidth={textMaxWidth} />
          <ul className={styles.quickLinksInner} role="navigation">
            {filteredProfileOptions.map((item, index) => (
              <li key={`quick-links-item-${index}`}>
                <Link onClick={onClose} className={styles.actionLink} to={item.value}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
      <li>
        <Link onClick={() => handleNotificationClick(true)} className={styles.actionLink}>
          <span>{t('header.label.notifications')}</span>
          <IconNotification />
          {notificationsCount > 0 && <span className={styles.notificationsCount}>{notificationsCount > 99 ? '99+' : notificationsCount}</span>}
        </Link>
      </li>
    </ul>
  );

  return (
    <div className={`${styles.navContainer} ${styles.primary}`}>
      <div className="max-container">
        <div className={styles.wrapper}>
          {authState?.isAuthenticated ? (
            <LeftSideView>
              <AppLogo />
            </LeftSideView>
          ) : (
            <div className={styles.navItemsLeft}>
              <div className={styles.branding}>
                <AppLogo />
              </div>
            </div>
          )}

          {authState?.isAuthenticated && !isNewTab && (
            <div className={styles.desktopOnly}>
              <RightSideView notificationsCount={notificationsCount} handleNotificationClick={handleNotificationClick} />
            </div>
          )}
          {authState?.isAuthenticated && !isNewTab && (
            <div className={styles.mobileOnly}>
              <Button variant="tertiary" className={styles.hamburger} onClick={toggleDrawer} aria-label="Open drawer menu">
                <IconMenu />
              </Button>

              <FloatingDrawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer}
                heading={
                  <Link className={`${styles.appLogo} ${styles.actionLink}`} to="" aria-label="dashboard">
                    <AppLogo />
                  </Link>
                }
                controls={
                  <Button
                    className={styles.logoutBtnMobile}
                    label={'button.logout'}
                    aria-label="Log out of account"
                    Icon={IconLogout}
                    iconPosition="right"
                    id={debugIds(ID.HEADER, ID.NAV, ID.RIGHT, ID.BUTTON, ID.LOGOUT)}
                    data-testid="LOGOUT"
                    size="md"
                    variant="primary"
                    onClick={logout}>
                    {t('header.label.logout')}
                  </Button>
                }>
                <RightSideMobile
                  onClose={() => setDrawerOpen(false)}
                  notificationsCount={notificationsCount}
                  handleNotificationClick={handleNotificationClick}
                />
              </FloatingDrawer>
            </div>
          )}
        </div>
      </div>

      <Modal
        id="xxxs-modal"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        modalTitle={t('orgManagement.confirmationmessage')}
        modalBody={<div className="MCP-modal-body">{t('orgManagement.Orgchangemessage')}</div>}
        modalFooter={
          <>
            <Button onClick={onCancelOrganizationChange} variant="secondary" size="md">
              {t('orgManagement.button.cancel')}
            </Button>
            <Button onClick={confirmChangeOrganization} size="md">
              {t('orgManagement.button.confirm')}
            </Button>
          </>
        }
        modalSize="xxxs"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.userState.user
});

export default connect(mapStateToProps, { setUserData })(PrimaryHeader);
