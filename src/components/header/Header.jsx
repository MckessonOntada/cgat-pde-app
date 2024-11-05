import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useOktaAuth } from '@okta/okta-react';
import { useQuery } from 'react-query';

import { Box, Divider } from '@mui/material';
import { Button } from '@mckesson/mcp-component-library';

import styles from './assets/styles/Header.module.scss';
import { ReactComponent as SettingIcon } from '../../assets/svg/settings.svg';
import { ReactComponent as TemplateIcon } from '../../assets/svg/template-icon.svg';
import { ReactComponent as QueryIcon } from '../../assets/svg/query-icon.svg';
import { ReactComponent as InfoIcon } from '../../assets/svg/question_circle.svg';

import AuthService from '../../api/authService/AuthService';
import CommonService from '../../api/commonService/CommonService';
import AppRoutes from '../../routes/AppRoutes';
import { setUserData } from '../../store/reducer/userReducer';
import { SERVICE_NOW_URL } from '../../config/AppConfig';

import { debugIds, ID } from '../../common/constants/id';
import AuthUtils from '../../common/util/AuthUtils';

function PageHeaderView({ user, setUserData, debugId }) {
  let intl = useIntl();
  const location = useLocation();

  function isLinkActive(path) {
    return location.pathname === path;
  }
  useQuery('getUserDetails', () => CommonService.getUserDetails(), {
    onSuccess: (res) => {
      setUserData(res);
    }
  });

  function LeftSideView() {
    return (
      <Box className={styles.navItemsLeft} id={debugIds(ID.HEADER, ID.NAV, ID.LEFT)}>
        <Divider
          className={styles.actionAreaSeparator}
          orientation="vertical"
          role="presentation"
        />
        <Box>
          <Link
            to={AppRoutes.pathAdmin}
            id={debugIds(ID.HEADER, ID.NAV, ID.LEFT, ID.LOGO, ID.LINK)}>
            {/* <img
              height="100px"
              width="100px"
              className={styles.appLogo}
              src={logoSvg}
              id={debugIds(ID.HEADER, ID.NAV, ID.LEFT, ID.LOGO)}
            /> */}
          </Link>
        </Box>
        <Divider
          className={styles.actionAreaSeparator}
          orientation="vertical"
          role="presentation"
        />
        <Box
          className={`${isLinkActive(AppRoutes.pathAdmin) && styles.navButtonActive} ${
            styles.navButtons
          }`}>
          <Link
            to={AppRoutes.pathAdmin}
            id={debugIds(ID.HEADER, ID.NAV, ID.LEFT, ID.LOGO, ID.LINK)}>
            Projects
          </Link>
        </Box>
        <Divider
          className={styles.actionAreaSeparator}
          orientation="vertical"
          role="presentation"
        />
        {AuthUtils.userHasPermission('userManagementRoute') && (
          <Box
            className={`${isLinkActive(AppRoutes.pathUserManagement) && styles.navButtonActive} ${
              styles.navButtons
            }`}>
            <Link
              to={AppRoutes.pathUserManagement}
              id={debugIds(ID.HEADER, ID.NAV, ID.LEFT, ID.LOGO, ID.LINK)}>
              Users
            </Link>
          </Box>
        )}
        <Divider
          className={styles.actionAreaSeparator}
          orientation="vertical"
          role="presentation"
        />
        {AuthUtils.userHasPermission('contentConsoleView') && (
          <Box
            className={`${
              (isLinkActive(AppRoutes.pathAdminConsole) ||
                isLinkActive(AppRoutes.pathAdminContentManagement)) &&
              styles.navButtonActive
            } ${styles.navButtons}`}>
            <Link
              to={AppRoutes.pathAdminContentManagement}
              id={debugIds(ID.HEADER, ID.NAV, ID.LEFT, ID.LOGO, ID.LINK)}>
              Content
            </Link>
          </Box>
        )}
        <Divider
          className={styles.actionAreaSeparator}
          orientation="vertical"
          role="presentation"
        />
      </Box>
    );
  }

  function RightSideView() {
    let { oktaAuth } = useOktaAuth();

    const logout = () => {
      AuthService.userLogout(oktaAuth);
    };

    return (
      <Box className={styles.navItemsRight} id={debugIds(ID.HEADER, ID.NAV, ID.RIGHT)}>
        <Box
          sx={{
            display: {
              lg: 'none',
              md: 'none',
              smT: 'none',
              tab: 'none',
              sm: 'block',
              xs: 'block'
            }
          }}></Box>
        <div
          id={debugIds(ID.HEADER, ID.NAV, ID.RIGHT, ID.ACTION_ICON)}
          className={styles.actionIcon}>
          {/* <SettingIcon /> */}

          {AuthUtils.userHasPermission('templateManagementIcon') && <TemplateIcon />}
          <QueryIcon />
          <Link to={SERVICE_NOW_URL} target="_blank">
            <InfoIcon />
          </Link>
        </div>
        <div
          className={styles.profileContainer}
          id={debugIds(ID.HEADER, ID.NAV, ID.RIGHT, ID.USER_PROFILE)}>
          <Divider
            className={styles.actionAreaSeparator}
            orientation="vertical"
            role="presentation"
          />
          <div
            className={styles.profileName}
            id={debugIds(ID.HEADER, ID.NAV, ID.RIGHT, ID.USER_PROFILE, ID.FULL_NAME)}>
            {user}
          </div>
          <Divider
            className={styles.actionAreaSeparator}
            orientation="vertical"
            role="presentation"
          />
        </div>
        <div id={debugIds(ID.HEADER, ID.NAV, ID.RIGHT, ID.BUTTON, ID.LOGOUT, ID.CONTAINER)}>
          <Button
            id={debugIds(ID.HEADER, ID.NAV, ID.RIGHT, ID.BUTTON, ID.LOGOUT)}
            data-testid={'LOGOUT'}
            size="sm"
            variant="tertiary"
            textTransform="capitalize"
            onClick={() => logout()}>
            <div
              className={styles.logoutText}
              id={debugIds(ID.HEADER, ID.NAV, ID.RIGHT, ID.BUTTON, ID.LOGOUT, ID.BUTTON_TEXT)}>
              {intl.formatMessage({ id: 'header.label.logout' })}
            </div>
          </Button>
        </div>
      </Box>
    );
  }

  return (
    <div className={styles.globalHeader} id={debugIds(ID.HEADER, ID.GLOBAL)}>
      <Box className={styles.headerContainer} id={debugIds(ID.HEADER, ID.GLOBAL, ID.CONTAINER)}>
        <LeftSideView />
        <RightSideView />
      </Box>
    </div>
  );
}

PageHeaderView.propTypes = {
  user: PropTypes.any,
  setUserData: PropTypes.func
};

const mapStateToProps = (state) => ({
  user: state.userState.user
});

export default connect(mapStateToProps, { setUserData })(PageHeaderView);
