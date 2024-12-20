import React, { useEffect, useState } from 'react';
import PageHeader from '@src/components/pageHeader';
import './index.scss';
import RecordDetails from './components/RecordDetails';
import BalanceDetails from './components/BalanceDetails';
import Routes from './routes/Routes';
import { TabList, Alert } from '@mckesson/mcp-component-library';
import { PATHS, tabListData } from './routes/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import ModuleHeader from '../../components/module-header';
import { PaymentsInvoiceProvider } from './context/PaymentsInvoicesContext';
import { AccountProvider } from './context/AccountContext';
import { BalanceProvider } from './context/BalanceContext';


const PaymentsInvoices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState();

  useEffect(() => {
    if (Array.isArray(tabListData) && tabListData.length > 0) {
      const updatedTabs = tabListData.map((item) => {
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
      <AccountProvider>
        <PaymentsInvoiceProvider>
          <div className="MCP-module-wrapper">
            <ModuleHeader heading={<PageHeader heading={'Payment Invoices'} />} />
            <RecordDetails />
            <BalanceProvider>
              <BalanceDetails />
            </BalanceProvider>
            <div className="MCP-module-body">
              <div id="tablist-container" className="MCP-panel-container">
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
                <Routes />
              </div>
            </div>
          </div>
        </PaymentsInvoiceProvider>
      </AccountProvider>
  );
};

export default PaymentsInvoices;
