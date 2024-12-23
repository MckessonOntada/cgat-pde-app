import React, { useEffect, useState } from 'react';
import './index.scss';
import Routes from './routes/Routes';
import { TabList, Button } from '@mckesson/mcp-component-library';
import { PATHS, tabListData } from './routes/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { PaymentMethodsProvider } from '../../context/PaymentMethodsContext';
import { ReactComponent as AddCircle } from '@src/assets/svg/add-circle.svg';
import { useTranslate } from '@src/translations/useTranslation';

const PaymentMethods = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState();
  const { t } = useTranslate();

  React.useEffect(() => {
    if (Array.isArray(tabListData) && tabListData.length > 0) {
      const updatedTabs = tabListData.map((item) => {
        const isDashboard = item.configName === 'bankAccounts' && location.pathname === '/';
        const isMatchingPath = item.path !== PATHS.invoices && location.pathname.includes(item.path);
        return {
          ...item,
          isActiveTab: location.pathname.includes(item.path),
          ariaSelected: location.pathname.includes(item.path) ? 'true' : 'false'
        };
      });
      setTabs(updatedTabs);
    }
  }, [location.pathname]);

  return (
    <React.Fragment>
      <div className="MCP-module-body">
        <div id="tablist-container" className="tablist-container">
          <TabList
            options={tabs}
            alignment="left"
            onTabClick={(e) => {
              navigate(e.path);
            }}
            showShadow={false}
            variant={'text'}
            useAsButton={true}
            aria-label={'record-tab-list'}
          />
          <Button Icon={AddCircle} size="md" onClick={() => {}} disabled={true}>
            {t('paymentInvoices.paymentMethods.table.bankAccount.addnewcard')}
          </Button>
        </div>
        <Routes />
      </div>
    </React.Fragment>
  );
};

export default PaymentMethods;
