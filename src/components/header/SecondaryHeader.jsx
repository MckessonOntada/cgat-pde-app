import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { setUserData } from '@src/store/reducer/userReducer';
import { Button, TabList } from '@mckesson/mcp-component-library';
import styles from './assets/styles/Header.module.scss';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import useSessionFeatures from '@src/common/hooks/useSessionFeatures';

const SecondaryHeader = ({ user, setUserData, debugId, navLinks }) => {
  let intl = useIntl();
  const location = useLocation();
  const {
    organization: { selectedOrganization }
  } = useSessionFeatures();

  const tabs = useMemo(() => {
    let updatedTabs = [];
    if (Array.isArray(navLinks) && navLinks.length > 0) {
      updatedTabs = navLinks.map((item) => {
        const isDashboard = item.configName === 'Dashboard' && location.pathname === '/';
        const isMatchingPath = item.path !== '/' && location.pathname.includes(item.path);
        return {
          ...item,
          isActiveTab: isDashboard || isMatchingPath,
          ariaSelected: isDashboard || isMatchingPath ? 'true' : 'false'
        };
      });
    };
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
        />
      </div>
    );
  };

  const RightSideView = () => {
    return (
      <div className={styles.navItemsRight} aria-label="System administration view">
        <div className={styles.navOptions}>
          {!selectedOrganization && (
            <Button color="secondary">
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
