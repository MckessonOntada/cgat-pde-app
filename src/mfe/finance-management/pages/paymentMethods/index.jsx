import React, { useEffect, useState } from 'react';
import './index.scss';
import Routes from './routes/Routes';
import { TabList, Button } from '@mckesson/mcp-component-library';
import { PATHS, tabListData } from './routes/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { PaymentMethodsProvider } from '../../context/PaymentMethodsContext';
import { ReactComponent as AddCircle } from '@src/assets/svg/add-circle.svg';
import { useTranslate } from '@src/translations/useTranslation';
import useWindowSize from '@src/hooks/UseWindowSize';
import { Alert } from '@mckesson/mcp-component-library';

const TABLET_BREAKPOINT = 768;

const PaymentMethods = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const windowSize = useWindowSize();
  const isMobileView = windowSize.width < TABLET_BREAKPOINT;
  const buttonSize = isMobileView ? 'md' : 'lg';
  const [tabs, setTabs] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslate();

  const isBankTabActive = location.pathname.includes(PATHS.bankAccounts);

  useEffect(() => {
    if (Array.isArray(tabListData) && tabListData.length > 0) {
      const updatedTabs = tabListData.map((item) => {
        return {
          ...item,
          isActiveTab: location.pathname.includes(item.path),
          ariaSelected: location.pathname.includes(item.path) ? 'true' : 'false',
          configName: t(`paymentInvoices.paymentMethods.tabs.${item.translationKey}`)
        };
      });
      setTabs(updatedTabs);
    }
  }, [location.pathname]);

  const handleDownloadACHForm = () => {
    setShowAlert(true);
    window.open('/achForm.pdf', '_blank');
  };

  return (
    <React.Fragment>
      <div className="MCP-module-body paymentMethodSection">
        {showAlert && (
          <Alert
            description={t('paymentInvoices.paymentMethods.achForm.description')}
            onClose={() => setShowAlert(false)}
            type="info"
            duration={10000}
          />
        )}
        <div id="tablist-container" className="tablist-container">
          <div className="customTab">
            {/* <TabList
              options={tabs}
              alignment="left"
              onTabClick={(e) => {
                navigate(e.path);
              }}
              showShadow={false}
              variant={'text'}
              useAsButton={true}
              aria-label={'record-tab-list'}
            /> */}
          </div>
          {isBankTabActive && (
            <Button Icon={AddCircle} size={buttonSize} onClick={handleDownloadACHForm}>
              {t('paymentInvoices.paymentMethods.table.bankAccount.addBank')}
            </Button>
          )}
        </div>
        <Routes />
      </div>
    </React.Fragment>
  );
};

export default PaymentMethods;
