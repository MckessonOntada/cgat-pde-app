import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { setUserData } from '@src/store/reducer/userReducer';
import { Button, TabList } from '@mckesson/mcp-component-library';
import styles from './assets/styles/Header.module.scss';
import { useIntl } from 'react-intl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useSessionFeatures from '@src/hooks/useSessionFeatures';
import AuthUtils from '@src/util/AuthUtils';
import { routePermissionConfig } from '@src/routes/RoutePermissionConstats';
import CommonUtils from '@src/util/CommonUtils';

const impersonateLogout = () => {
  return new Promise(function (resolve, reject) {
    try {
      AuthUtils.removeImpersonate();
      resolve('Exiting impersonate login');
    } catch (error) {
      reject(error);
    }
  });
};

const SecondaryHeader = ({ user, setUserData, debugId, navLinks }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const impersonateDetails = AuthUtils.getImpersonateDetails();

  const location = useLocation();
  const {
    organization: { removeOrganization }
  } = useSessionFeatures();

  const handleSystemAdminViewClick = () => {
    removeOrganization();

    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  const tabs = useMemo(() => {
    if (isSystemAdminView) {
      return [
        {
          label: 'System Administrator',
          path: '/',
          id: 1,
          configName: `${intl.formatMessage({ id: 'dashboard.card.systemAdministrator' })}`,
          isActive: true,
          isActiveTab: true,
          labelForMobile: 'System Administrator',
          sequence: 1,
          ariaSelected: true
        }
      ];
    }

    let updatedTabs = [];

    if (Array.isArray(navLinks) && navLinks.length > 0) {
      updatedTabs = navLinks
        .map((item) => {
          if (
            item.configName === 'Dashboard' ||
            (item.configName !== 'Dashboard' && AuthUtils.userHasRoutePermission(routePermissionConfig.paymentInvoices))
          ) {
            const isDashboard = item.configName === 'Dashboard' && location.pathname === '/';
            const isMatchingPath = item.path !== '/' && location.pathname.includes(item.path);
            return {
              ...item,
              isActiveTab: isDashboard || isMatchingPath,
              ariaSelected: isDashboard || isMatchingPath ? 'true' : 'false',
              configName: `${intl.formatMessage({ id: item.translationName })}`
            };
          }
        })
        .filter((item) => !!item);
    }
    return updatedTabs;
  }, [navLinks, location.pathname]);

  const LeftSideView = () => {
    return (
      <div className={`${styles.navItemsLeft} ${styles.secondaryNav}`} aria-label="Navigation tabs">
        <TabList
          className={styles.compactTablist}
          type="link"
          options={tabs}
          showShadow={false}
          alignment={'left'}
          useAsButton={false}
          role="tablist"
          aria-label="Secondary navigation tabs"
          LinkComponent={Link}
        />
      </div>
    );
  };

  const getImpersonateLoginDetails = () => {
    const handleOnExitUserView = () => {
      impersonateLogout()
        .then((message) => {
          navigate('?expelled=true');
        })
        .catch((error) => {
          console.log(`error: ${error}`);
        });
    };
    if (impersonateDetails?.id) {
      return (
        <div className="impersonate-info-panel">
          <p className="logged-in-label">
            {intl
              .formatMessage({ id: 'header.label.loggedInAs' })
              .replace('{{impersonateFullName}}', CommonUtils.getFullName(impersonateDetails.name))}
          </p>
          <Button color="secondary" onClick={handleOnExitUserView}>
            {intl.formatMessage({ id: 'button.captions.exitUserView' })}
          </Button>
        </div>
      );
    }
  };

  const RightSideView = () => {
    if (isSystemAdminView) {
      return null;
    }
    return (
      <div className={styles.navItemsRight} aria-label="System administration view">
        <div className={styles.navOptions}>
          {/* 
            The button is only visible for system admin.
            The isSystemAdminView return false for non-admin user.
          */}
          {getImpersonateLoginDetails()}
          {AuthUtils.isSystemAdmin() && !AuthUtils.isSystemAdminView() && (
            <Button color="secondary" onClick={handleSystemAdminViewClick}>
              {intl.formatMessage({ id: 'header.label.systemAdminView' })}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.navContainer} ${styles.secondary}`} aria-label="Secondary header">
      <div className={styles.wrapper}>
        <LeftSideView />
        <RightSideView />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.userState.user
});

export default connect(mapStateToProps, { setUserData })(SecondaryHeader);
