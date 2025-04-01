import React, { useEffect, useState } from 'react';
import PageHeader from '@src/components/pageHeader';
import './index.scss';
import RecordDetails from './components/RecordDetails';
import BalanceDetails from './components/BalanceDetails';
import Routes from './routes/Routes';
import { TabList, Heading } from '@mckesson/mcp-component-library';
import { PATHS, tabListData } from './routes/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import ModuleHeader from '../../components/module-header';
import { PaymentsInvoiceProvider } from './context/PaymentsInvoicesContext';
import { useAccountContext } from './context/AccountContext';
import { BalanceProvider } from './context/BalanceContext';
import CommonUtils from '@src/util/CommonUtils';
import EmptyDataContainer from '@src/components/EmptyData';
import { useTranslate } from '@src/translations/useTranslation';
import EmptyUI from './EmptyUI';

const PaymentsInvoices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState();
  const { selectedAccount, isLoading } = useAccountContext();
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
  }, []);

  const handleTabSwitch = (e)=>{
    const updatedTabs = tabListData.map((item) => {
      return {
        ...item,
        isActiveTab: e.path.includes(item.path),
        ariaSelected: e.path.includes(item.path) ? 'true' : 'false',
        configName: t('paymentInvoices.tabs.' + item.configName)
      };
    });
    navigate(e.path);
    setTabs(updatedTabs);
  }

  if (isLoading || !CommonUtils.isNonEmptyObject(selectedAccount)) {
    return <EmptyUI isLoading={isLoading} isEmpty={!CommonUtils.isNonEmptyObject(selectedAccount)} />;
  }

  return (
    <div className="MCP-module-wrapper">
      <ModuleHeader heading={<Heading as="h1">{t('paymentInvoices.header.managePayments')}</Heading>} />
      <RecordDetails />

      <BalanceProvider>
        <BalanceDetails />
      </BalanceProvider>

      <div className="MCP-module-body">
        <div id="tablist-container" className="MCP-panel-container">
          <div className="customTab">
            <TabList
              options={tabs}
              alignment="left"
              onTabClick={(e) => handleTabSwitch(e)}
              showShadow={false}
              variant={'text'}
              useAsButton={true}
              aria-label={'record-tab-list'}
            />
          </div>
          <Routes />
        </div>
      </div>
    </div>
  );
};

export default PaymentsInvoices;
