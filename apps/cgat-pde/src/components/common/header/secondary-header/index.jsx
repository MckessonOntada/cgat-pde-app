import { Button, TabList } from '@mckesson/mcp-component-library';
import './assets/style.scss';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SecondaryHeader({ navLinks }) {
  const [tabs, setTabs] = React.useState([]);
  const { t } = useTranslation();
  const location = useLocation();

  React.useEffect(() => {
    if (Array.isArray(navLinks) && navLinks.length > 0) {
      const updatedTabs = navLinks.map(item => ({
        ...item,
        isActiveTab: location.pathname.includes(item.path),
        ariaSelected: location.pathname.includes(item.path) ? 'true' : 'false',
      }));
      setTabs(updatedTabs);
    }
  }, [navLinks, location.pathname]);

  return (
    <header className="header-wrapper" role="banner">
      <nav className="header secondary" aria-label="Secondary Navigation">
        <div className="secondary-nav">
          <TabList
            type="link"
            options={tabs}
            showShadow={false}
            alignment={'left'}
            useAsButton={false}
            className={'compact-tablist'}
            role="tablist"
          />
        </div>
        <div className="nav-options">
          <Button color="secondary">{t('button.systemAdminView')}</Button>
        </div>
      </nav>
    </header>
  );
}
