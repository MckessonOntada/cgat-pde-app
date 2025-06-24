import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { setUserData } from '@src/store/reducer/userReducer';
import { Button, TabList } from '@mckesson/mcp-component-library';
import styles from './assets/styles/Header.module.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useSessionFeatures from '@src/hooks/useSessionFeatures';
import AuthUtils from '@src/util/AuthUtils';
import { SESSION_CONST } from '@src/constants/SessionConstants';
import { useTranslate } from '@src/translations/useTranslation';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';

const impersonateLogout = () => {
  return new Promise(async function (resolve, reject) {
    try {
      await AuthUtils.removeImpersonateId();
      resolve('Exiting impersonate login');
    } catch (error) {
      reject(error);
    }
  });
};

const SecondaryHeader = ({ navLinks }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const isCustomerCenterView = AuthUtils.isCustomerCenterView();
  const impersonatedUsername = sessionStorage.getItem(SESSION_CONST.IMPERSONATE_USERNAME);
  const dispatch = useDispatch();

  const location = useLocation();
  const {
    organization: { removeOrganization }
  } = useSessionFeatures();
  const handleSystemAdminViewClick = () => {
    removeOrganization();

    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/?expelled=true');
    }
  };

  const tabs = useMemo(() => {
    if (isSystemAdminView) {
      return [
        {
          label: 'System Administrator',
          path: '/',
          id: 1,
          configName: t('dashboard.card.systemAdministrator'),
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
          if (item.configName === 'Dashboard' || (item.configName !== 'Dashboard' && AuthUtils.userHasRoutePermission(item.permittedRoute))) {
            let isActiveTab = false;

            if (item.configName === 'Dashboard' && location.pathname === '/') isActiveTab = true;

            if (item.configName !== 'Dashboard' && location.pathname.includes(item.path)) isActiveTab = true;

            if (item.configName === 'Orders' && isSystemAdmin) {
              return false;
            }

            return {
              ...item,
              isActiveTab: isActiveTab,
              ariaSelected: isActiveTab ? 'true' : 'false',
              configName: t(item.translationName)
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
    const exitUserView = () => {
      impersonateLogout()
        .then(() => {
          navigate('/?expelled=true');
        })
        .catch((error) => {
          console.log(`error: ${error}`);
        });
    };
    const handleOnExitUserView = () => {
      const state = {};
      state.title = `${t('button.captions.exitUserView')}?`;
      state.body = (
        <div className="MCP-modal-body">
          <p>
            <p>{`${t('message.exitUserViewConfirmation')} ${impersonatedUsername}?`}</p>
          </p>
        </div>
      );
      state.footer = (
        <div className="controls">
          <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
            {t('button.caption.no')}
          </Button>
          <Button size="md" variant="primary" onClick={exitUserView}>
            {t('button.caption.yes')}
          </Button>
        </div>
      );
      dispatch(openModal(state));
    };
    if (impersonatedUsername) {
      return (
        <div className="impersonate-info-panel">
          <p className="logged-in-label">{t('header.label.loggedInAs', { impersonatedUsername })}</p>
          <Button color="secondary" onClick={handleOnExitUserView}>
            {t('button.captions.exitUserView')}
          </Button>
        </div>
      );
    }
  };

  const showSystemAdminViewBtn = () => {
    return (
      (AuthUtils.isSystemAdmin() && !AuthUtils.isSystemAdminView()) ||
      (AuthUtils.isCustomerCenter() && !AuthUtils.isCustomerCenterView()) ||
      (AuthUtils.isTreatmentCentreExecutive() && !AuthUtils.isTreatmentCentreExecutiveView())
    );
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
          {showSystemAdminViewBtn() && (
            <Button color="secondary" onClick={handleSystemAdminViewClick}>
              {t('header.label.systemAdminView')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.navContainer} ${styles.secondary}`} aria-label="Secondary header">
      <div className="max-container">
        <div className={styles.wrapper}>
          <LeftSideView />
          <RightSideView />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.userState.user
});

export default connect(mapStateToProps, { setUserData })(SecondaryHeader);
