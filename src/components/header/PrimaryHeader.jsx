import React, { useState } from 'react';
import { ReactComponent as AppLogo } from '@src/assets/image/app-logo.svg';
import { ReactComponent as IconNotification } from '@src/assets/svg/bell.svg';
import { ReactComponent as IconLogout } from '@src/assets/svg/logout.svg';
import { ReactComponent as IconMenu } from '@src/assets/svg/burger-menu.svg';
import { ReactComponent as IconArrowDown } from '@src/assets/svg/arrow-down-filled.svg';
import { ReactComponent as IconHelp } from '@src/assets/svg/help-circle-filled.svg';
import { connect, useSelector } from 'react-redux';
import { setUserData } from '@src/store/reducer/userReducer';
import { debugIds, ID } from '@src/common/constants/id';
import { Button, Dropdown, DropdownMenu } from '@mckesson/mcp-component-library';
import styles from './assets/styles/Header.module.scss';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import HeaderConfig from './__mock__';
import FloatingDrawer from '../floating-drawer';
import AuthService from '@src/api/authService/AuthService';
import { useOktaAuth } from '@okta/okta-react';
import { useQuery } from 'react-query';
import CommonDataService from '../../api/commonService/CommonDataService';

const PrimaryHeader = ({ user, setUserData, debugId }) => {
  const intl = useIntl();
  const { oktaAuth, authState } = useOktaAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  // const { isLoading, data, isError, refetch } = useQuery({
  //   queryKey: ['organizations'],
  //   queryFn: async () => {
  //     const orgList = await CommonDataService.getOrganizationList({})
  //     return orgList?.content?.map((item) => {
  //       console.log('item....', item, { ...item, label: item.name, value: item.id })
  //       return { ...item, label: item.name, value: item.id }
  //     })
  //     // console.log('_orgList..', _orgList)

  //   },
  //   refetchOnWindowFocus: false
  // });

  const logout = () => {
    AuthService.userLogout(oktaAuth);
  };

  const LeftSideView = (props) => {
    return (
      <div className={`${styles.navItemsLeft} ${styles.navItemsborder}`} id={''}>
        <div className={styles.branding}>
          <Link
            className={`${styles.appLogo} ${styles.actionLink}`}
            to={''}
            id={''}
            aria-label="dashboard">
            {props.children}
          </Link>
        </div>
        {/* <div className={styles.centerSelector}>
          <Dropdown
            id={''}
            name={''}
            aria-label="Select treatment center"
            options={data?.content || []}
            onChange={() => { }}
          />
        </div> */}
      </div>
    );
  };

  const RightSideView = () => {
    const quickLinks = [
      <Link className={styles.actionLink} to={'notifications'} aria-label="View notifications">
        <span>{intl.formatMessage({ id: 'header.label.notifications' })}</span>
        <IconNotification />
      </Link>,
      <DropdownMenu
        anchorEl={
          <button className={styles.actionLink} aria-label="Account options">
            <span>{user || 'Anonymous'}</span>
            <IconArrowDown />
          </button>
        }
        handleSelect={() => { }}
        options={HeaderConfig.profileOptions}
        aria-label="Profile options"
      />,
      <Link className={styles.actionLink} to={'help'} aria-label="Help center">
        <span>{intl.formatMessage({ id: 'header.label.help' })}</span>
        <IconHelp />
      </Link>,
      <Button
        label={'button.logout'}
        aria-label="Log out of account"
        icon={<IconLogout />}
        iconPosition={'right'}
        id={debugIds(ID.HEADER, ID.NAV, ID.RIGHT, ID.BUTTON, ID.LOGOUT)}
        data-testid={'LOGOUT'}
        size="sm"
        variant="primary"
        onClick={() => {
          logout();
        }}>
        {intl.formatMessage({ id: 'header.label.logout' })}
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
      <div className={styles.wrapper} id={''}>
        {authState?.isAuthenticated ? <LeftSideView><AppLogo /></LeftSideView> :
          <div className={styles.navItemsLeft} id={''}> <div className={styles.branding}> <AppLogo /> </div></div>}
        {authState?.isAuthenticated && (
          <div className={styles.desktopOnly}>
            <RightSideView />
          </div>)
        }
        <div className={styles.mobileOnly}>
          <button onClick={toggleDrawer} aria-label="Open drawer menu">
            <IconMenu />
          </button>
          <FloatingDrawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
            <RightSideView />
          </FloatingDrawer>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.userState.user
});

export default connect(mapStateToProps, { setUserData })(PrimaryHeader);
