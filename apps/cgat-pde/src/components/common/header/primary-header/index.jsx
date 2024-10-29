import { useState } from 'react';
import { Link } from '@mfe/ui-components';
// import { Link } from 'react-router-dom';
import { Dropdown, Button, DropdownMenu, Divider } from '@mckesson/mcp-component-library';
import './assets/style.scss';
import { accountOptions, treatmentCenters } from './__mock__';
import { RxHamburgerMenu } from 'react-icons/rx';
import { BiSolidHelpCircle } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { ReactComponent as AppLogo } from './../../../../assets/images/logo.svg';

export default function PrimaryHeader() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const quickLinks = [
    <Link to={'my-account'} aria-label={t('aria.myAccount')}>
      {t('link.myAccount')}
    </Link>,
    <DropdownMenu anchorEl={t('button.sally')} handleSelect={() => { }} options={accountOptions} />,
    <Link
      to={'help'}
      aria-label={t('aria.help')}
      icon={<BiSolidHelpCircle color="#627386" size={'18'} />}
      iconPosition="right"
    >
      {t('link.help')}
    </Link>,
    <Button label={t('button.logout')} aria-label={t('aria.logout')} iconPosition={'right'}>
      {t('button.logout')}
    </Button>,
  ];

  return (
    <header className="header-wrapper" role="banner">
      <div className="header primary">
        <div className="user-display">
          <div className="branding">
            <div className="logo" aria-label={t('aria.companyLogo')}>
              <AppLogo />
            </div>
            <div className="center-selector">
              <Dropdown
                id="treatment-center-dropdown"
                name="treatment-center"
                aria-label={t('aria.selectTreatmentCenter')}
                onChange={() => { }}
                options={treatmentCenters}
                className="no-border"
              />
            </div>
          </div>
        </div>

        <div className="controls">
          <div className="burger-menu" onClick={handleMenuToggle} aria-label={t('aria.burgerMenu')}>
            <RxHamburgerMenu size={24} />
          </div>

          <ul className={`quick-links ${menuOpen ? 'active' : ''}`} role="navigation" aria-label={t('aria.quickLinks')}>
            {quickLinks.map((item, index) => {
              return <li key={`quick-links-item-${index}`}>{item}</li>;
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}
