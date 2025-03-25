import React, { useEffect, useMemo, useState } from 'react';
import { ReactComponent as AppLogo } from '@src/assets/image/app-logo.svg';
import { ReactComponent as IconNotification } from '@src/assets/svg/bell.svg';
import { ReactComponent as IconLogout } from '@src/assets/svg/logout.svg';
import { ReactComponent as IconMenu } from '@src/assets/svg/burger-menu.svg';
import { ReactComponent as IconArrowDown } from '@src/assets/svg/arrow-down-filled.svg';
import { ReactComponent as IconHelp } from '@src/assets/svg/help-circle-filled.svg';
import { connect } from 'react-redux';
import { setUserData } from '@src/store/reducer/userReducer';
import { debugIds, ID } from '@src/constants/id';
import { Button, MenuList, Modal } from '@mckesson/mcp-component-library';
import styles from './assets/styles/Header.module.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HeaderConfig from './constants';
import FloatingDrawer from '../floating-drawer';
import AuthService from '@src/api/authService/AuthService';
import { useOktaAuth } from '@okta/okta-react';
import useSessionFeatures from '../../hooks/useSessionFeatures';
import { useQuery } from 'react-query';
import CommonDataService from '../../api/commonService/CommonDataService';
import AuthUtils from '../../util/AuthUtils';
import { useTranslate } from '@src/translations/useTranslation';
import { currentLocale } from '@src/translations/i18n';
import EclipsesTextcss from '../EclipsesText/EclipsesTextcss';

const PrimaryHeader = () => {
  const { t } = useTranslate();
  const { oktaAuth, authState } = useOktaAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const userName = AuthUtils.getFullName();
  const [textMaxWidth, setTextMaxWidth] = useState('');
  const channel = new BroadcastChannel('auth_channel');

  useEffect(() => {
    const handleResize = () => {
      setTextMaxWidth(window.innerWidth <= 992 && window.innerWidth >= 768 ? 160 : '');
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on mount to set initial width

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

  const { isLoading, data, isError, refetch } = useQuery({
    queryKey: ['organizationListOptions'],
    queryFn: async () => {
      if (!isSystemAdminView) return {};
      const res = await CommonDataService.getOrganizationListAsPublic(requestParams);
      return res.content;
    },
    refetchOnWindowFocus: false
  });

  const {
    organization: { setOrganization, selectedOrganization }
  } = useSessionFeatures();

  const { data: organizationLogo } = CommonDataService.useOrganizationLogo(selectedOrganization.logoUrl, selectedOrganization.id);

  const handleChange = (value) => {
    setSelectedOrg(value);
    setIsOpen(true);
  };

  const confirmChangeOrganization = () => {
    setIsOpen(false);
    const _selectedOrg = data.find((i) => i.id == selectedOrg);
    setOrganization(_selectedOrg || {});
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  const onCancelOrganizationChange = () => {
    setIsOpen(false);
    setSelectedOrg(null);
  };

  const logout = () => {
    channel.postMessage({ type: 'LOGOUT' });
    AuthService.userLogout(oktaAuth);
  };

  const LeftSideView = (props) => {
    return (
      <div className={`${styles.navItemsLeft}`} id={''}>
        <div className={styles.branding}>
          {isSystemAdminView ? (
            <Link className={`${styles.appLogo} ${styles.actionLink}`} to={''} id={''} aria-label="dashboard">
              {props.children}
            </Link>
          ) : (
            <Link to={''} id={''} className={`${styles.customheader}`}>
              {organizationLogo && (
                <div className={`${styles.logoContainer}`}>
                  <img src={organizationLogo || ''} />
                </div>
              )}
              <h2>{selectedOrganization.name}</h2>
            </Link>
          )}
        </div>
      </div>
    );
  };

  const RightSideView = () => {
    const currentLanguage = HeaderConfig.languages.find((lang) => lang.value == currentLocale);
    const quickLinks = [
      <Link className={styles.actionLink} to={'notifications'} aria-label="View notifications">
        <span>{t('header.label.notifications')}</span>
        <IconNotification />
      </Link>,

      <MenuList handleSelect={() => {}} options={HeaderConfig.profileOptions} aria-label="Profile options">
        <div className={styles.actionLink} aria-label="Account options">
          <span>
            <EclipsesTextcss str={userName || 'Anonymous'} maxWidth={textMaxWidth} />
          </span>
          <IconArrowDown />
        </div>
      </MenuList>,
      // <div className={styles.languageSelect}>
      //   <MenuList
      //     handleSelect={(val) => {
      //       localStorage.setItem('APP_LOCALE', val);
      //       window.location.reload();
      //     }}
      //     options={HeaderConfig.languages}
      //     aria-label="language options">
      //     <div className={styles.actionLink} aria-label="language options">
      //       <span>{currentLanguage?.label || 'English'}</span>
      //       <IconArrowDown />
      //     </div>
      //   </MenuList>
      // </div>,
      // <Link className={styles.actionLink} to={'help'} aria-label="Help center">
      //   <span>{t('header.label.help')}</span>
      //   <IconHelp />
      // </Link>,
      <Button
        label={'button.logout'}
        aria-label="Log out of account"
        Icon={IconLogout}
        iconPosition="right"
        id={debugIds(ID.HEADER, ID.NAV, ID.RIGHT, ID.BUTTON, ID.LOGOUT)}
        data-testid={'LOGOUT'}
        size="sm"
        variant="primary"
        onClick={() => {
          logout();
        }}>
        {t('header.label.logout')}
      </Button>
    ];
    return (
      <div className={styles.navItemsRight} id={''}>
        <ul className={styles.quickLinks} role="navigation" aria-label="Quick access links">
          {quickLinks.map((item, index) => {
            return (
              <li className={styles.linkWrapper} key={`quick-links-item-${index}`}>
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className={`${styles.navContainer} ${styles.primary}`}>
      <div className="max-container">
        <div className={styles.wrapper} id={''}>
          {authState?.isAuthenticated ? (
            <LeftSideView>
              <AppLogo />
            </LeftSideView>
          ) : (
            <div className={styles.navItemsLeft} id={''}>
              {' '}
              <div className={styles.branding}>
                {' '}
                <AppLogo />{' '}
              </div>
            </div>
          )}
          {authState?.isAuthenticated && (
            <div className={styles.desktopOnly}>
              <RightSideView />
            </div>
          )}
          <div className={styles.mobileOnly}>
            <Button variant="tertiary" onClick={toggleDrawer} aria-label="Open drawer menu">
              <IconMenu />
            </Button>
            <FloatingDrawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
              <RightSideView />
            </FloatingDrawer>
          </div>
        </div>
      </div>
      <Modal
        {...{
          id: 'xxxs-modal',
          isOpen,
          onClose: () => setIsOpen(false),
          modalTitle: t('orgManagement.confirmationmessage'),
          modalBody: <div className="MCP-modal-body">{t('orgManagement.Orgchangemessage')}</div>,

          modalFooter: (
            <React.Fragment>
              <Button onClick={onCancelOrganizationChange} variant="secondary" size="md">
                {t('orgManagement.button.cancel')}
              </Button>
              <Button onClick={confirmChangeOrganization} size="md">
                {' '}
                {t('orgManagement.button.confirm')}
              </Button>
            </React.Fragment>
          ),
          modalSize: 'xxxs'
        }}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.userState.user
});

export default connect(mapStateToProps, { setUserData })(PrimaryHeader);
