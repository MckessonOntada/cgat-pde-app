import React, { useMemo } from 'react';
import { Button, TabList, Modal } from '@mckesson/mcp-component-library';
import { SESSION_CONST } from '@src/constants/SessionConstants';
import useSessionFeatures from '@src/hooks/useSessionFeatures';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { setUserData } from '@src/store/reducer/userReducer';
import { useTranslate } from '@src/translations/useTranslation';
import AuthUtils from '@src/util/AuthUtils';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './assets/styles/Header.module.scss';
import { navLinks, systemAdminTab } from './constants';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';

const impersonateLogout = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await AuthUtils.removeImpersonateId();
      resolve('Exiting impersonate login');
    } catch (error) {
      reject(error);
    }
  });
};

const SecondaryHeader = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const isCustomerCenter = AuthUtils.isCustomerCenterView();
  const impersonatedUsername = sessionStorage.getItem(SESSION_CONST.IMPERSONATE_USERNAME);
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    organization: { removeOrganization }
  } = useSessionFeatures();
  const state = useSelector((state) => state.orderState);
  const [exitUserViewModalOpen, setExitUserViewModalOpen] = React.useState(false);
  const [exitingUserView, setExitingUserView] = React.useState(false);

  const handleSystemAdminViewClick = () => {
    removeOrganization();
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/?expelled=true');
    }
  };
  const tabs = useMemo(() => {
    if (isSystemAdminView || isCustomerCenter) {
      const isOrdersPath = location.pathname.includes('orders');

      const filteredTabs = systemAdminTab.filter((item) => {
        if (isSystemAdminView && !isCustomerCenter) {
          return item.configName === 'systemAdministrator';
        }
        if (isCustomerCenter) {
          return true;
        }
        return false;
      });

      return filteredTabs.map((item) => {
        const isActiveTab = item.configName === 'orders' ? isOrdersPath : !isOrdersPath;

        return {
          ...item,
          isActiveTab,
          ariaSelected: String(isActiveTab),
          configName: t(`dashboard.card.${item.configName}`)
        };
      });
    }

    if (!Array.isArray(navLinks) || navLinks.length === 0) return [];

    return navLinks
      .map((item) => {
        if (item.configName === 'Dashboard' || (item.configName !== 'Dashboard' && AuthUtils.userHasRoutePermission(item.permittedRoute))) {
          let isActiveTab = false;
          if (item.configName === 'Dashboard' && location.pathname === '/') isActiveTab = true;
          if (item.configName !== 'Dashboard' && location.pathname.includes(item.path)) isActiveTab = true;
          if (item.configName === 'Orders' && isSystemAdmin) return false;
          return {
            ...item,
            isActiveTab,
            ariaSelected: isActiveTab ? 'true' : 'false',
            configName: t(item.translationName)
          };
        }
      })
      .filter(Boolean);
  }, [navLinks, location.pathname]);

  const handleOnClick = (tab) => {
    if (state.hasUnsavedChanges) {
      const modalState = {
        title: t('messages.confirmation.discardheader'),
        body: (
          <div className="MCP-modal-body">
            <p>{t('messages.confirmation.discardUnsavedOrder')}</p>
          </div>
        ),
        footer: (
          <div className="controls">
            <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
              {t('orgManagement.button.cancel')}
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={() => {
                dispatch(closeModal());
                navigate(tab.path);
              }}>
              {t('orgManagement.button.OK')}
            </Button>
          </div>
        )
      };
      dispatch(openModal(modalState));
    } else {
      navigate(tab.path);
    }
  };

  const LeftSideView = () => (
    <div className={`${styles.navItemsLeft} ${styles.secondaryNav}`} aria-label="Navigation tabs">
      <TabList
        className={styles.compactTablist}
        type="link"
        options={tabs}
        showShadow={false}
        alignment="left"
        useAsButton
        role="tablist"
        aria-label="Secondary navigation tabs"
        LinkComponent={Link}
        onTabClick={handleOnClick}
      />
    </div>
  );

  const exitUserView = () => {
    setExitingUserView(true);
    impersonateLogout()
      .then(() => {
        navigate('/?expelled=true');
      })
      .catch((error) => {
        setExitingUserView(false);
        console.log(`error: ${error}`);
      });
  };

  const getImpersonateLoginDetails = () => {
    const handleOnExitUserView = () => {
      setExitUserViewModalOpen(true);
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

  const showSystemAdminViewBtn = () =>
    (AuthUtils.isSystemAdmin() && !AuthUtils.isSystemAdminView()) ||
    (AuthUtils.isCustomerCenter() && !AuthUtils.isCustomerCenterView()) ||
    (AuthUtils.isTreatmentCentreExecutive() && !AuthUtils.isSystemAdminView());

  const RightSideView = () => {
    if (isSystemAdminView) return null;
    return (
      <div className={styles.navItemsRight} aria-label="System administration view">
        <div className={styles.navOptions}>
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
          {exitUserViewModalOpen && impersonatedUsername && (
            <ExitUserViewConfirmation
              onClose={() => setExitUserViewModalOpen(false)}
              title={`${t('button.captions.exitUserView')}?`}
              body={<p>{`${t('message.exitUserViewConfirmation')} ${impersonatedUsername}?`}</p>}
              footer={[
                <Button size="md" variant="secondary" onClick={() => setExitUserViewModalOpen(false)}>
                  {t('button.caption.no')}
                </Button>,
                <Button
                  variant="primary"
                  isLoadingState={exitingUserView}
                  Icon={exitingUserView && ButtonLoadingIcon}
                  iconPosition="left"
                  type="submit"
                  onClick={exitUserView}
                  size="md">
                  {exitingUserView ? 'Exiting User View' : t('button.caption.yes')}
                </Button>
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ExitUserViewConfirmation = ({ title, body, footer, onClose }) => {
  return (
    <Modal
      isOpen={true}
      onClose={(e, reason) => {
        if (reason && reason === 'backdropClick') {
          return;
        }
        onClose && onClose();
      }}
      modalTitle={title}
      modalBody={<div className="MCP-modal-body">{body}</div>}
      isFooterCenterAlign={false}
      modalFooter={<div className="controls">{footer}</div>}
      modalSize={'xxs'}
    />
  );
};

const mapStateToProps = (state) => ({
  user: state.userState.user
});

export default connect(mapStateToProps, { setUserData })(SecondaryHeader);
