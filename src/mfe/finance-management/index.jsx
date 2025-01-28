import React, { useEffect, useState } from 'react';
import PageHeader from '@src/components/pageHeader';
import './index.scss';
import RecordDetails from './components/RecordDetails';
import BalanceDetails from './components/BalanceDetails';
import Routes from './routes/Routes';
import { TabList, Alert, Heading } from '@mckesson/mcp-component-library';
import { PATHS, tabListData } from './routes/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import ModuleHeader from '../../components/module-header';
import { PaymentsInvoiceProvider } from './context/PaymentsInvoicesContext';
import { useAccountContext } from './context/AccountContext';
import { BalanceProvider } from './context/BalanceContext';
import CommonUtils from '@src/util/CommonUtils';
import EmptyDataContainer from '@src/components/EmptyData';
import { useTranslate } from '@src/translations/useTranslation';

const PaymentsInvoices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState();
  const { selectedAccount } = useAccountContext();
  const { t } = useTranslate();

  useEffect(() => {
    if (!Array.isArray(tabListData) || tabListData.length === 0) {
      console.error('Tab list data is not available');
      return;
    }

    const updatedTabs = tabListData.map((item) => {
      return {
        ...item,
        isActiveTab: location.pathname.includes(item.path),
        ariaSelected: location.pathname.includes(item.path) ? 'true' : 'false',
        configName: t('paymentInvoices.tabs.' + item.configName)
      };
    });

    setTabs(updatedTabs);
  }, [location.pathname]);

  return (
    <div className="MCP-module-wrapper">
      {CommonUtils.isNonEmptyObject(selectedAccount) ? (
        <React.Fragment>
          <ModuleHeader heading={<Heading as="h1">{t('paymentInvoices.header.managePayments')}</Heading>} />
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
        </React.Fragment>
      ) : (
        <EmptyDataContainer
          image={''}
          heading={t('paymentInvoices.EmptyData.heading')}
          description={t('paymentInvoices.EmptyData.description')}
        />
      )}
    </div>
  );
};

export default PaymentsInvoices;
