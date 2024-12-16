// import React, { useMemo } from 'react';
// import Filters from './Filters';
// import PaymentMethodsTable from './PaymentMethodsTable';
// import './index.scss';
// import { Button } from '@mckesson/mcp-component-library';
// import CommonFilters from '@src/components/Filters';
// import { usePaymentMethods } from '../../context/PaymentMethodsContext';
// import { useTranslate } from '@src/translations/useTranslation';

// const paymentStatus = [
//   {
//     isDisabled: false,
//     value: 'IN PROCESS',
//     label: 'IN PROCESS'
//   },
//   {
//     isDisabled: false,
//     value: 'COMPLETED',
//     label: 'COMPLETED'
//   }
// ];

// const paymentMethodOptions = [
//   {
//     isDisabled: false,
//     value: '4600-FIRST CITIZEN',
//     label: '4600-FIRST CITIZEN'
//   },
//   {
//     isDisabled: false,
//     value: '4600-FIRST CITIZEN CARD',
//     label: '4600-FIRST CITIZEN CARD'
//   }
// ];

// export default function PaymentMethods(params) {
//   const { t } = useTranslate();
//   const { applyFilters, filterConfig, sortConfig, clearFilters } = usePaymentMethods();

//   const AdditionalFiltersConfig = useMemo(() => {
//     return [
//       {
//         type: 'multiSelectDropdown',
//         name: 'paymentStatus',
//         label: t('paymentInvoices.history.filters.status'),
//         options: paymentStatus
//       },
//       {
//         type: 'multiSelectDropdown',
//         name: 'paymentMethod',
//         label: t('paymentInvoices.history.filters.method'),
//         options: paymentMethodOptions
//       },
//       {
//         type: 'dateRangePicker',
//         name: 'dateRange'
//       }
//     ];
//   }, []);

//   return (
//     <React.Fragment>
//       <div className="MCP-panel-container">
//         <CommonFilters onApplyFilters={applyFilters} onClearFilters={clearFilters} additionalFilters={AdditionalFiltersConfig} searchPlaceholder={t('paymentInvoices.history.filters.autoSearch')} />
//       </div>
//       <div className="table-header">
//         <h1> Payment Listing</h1>
//         <Button variant="secondary" onClick={() => {}} size="sm">
//           Export Excel
//         </Button>
//       </div>
//       <PaymentMethodsTable />
//     </React.Fragment>
//   );
// }

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
      <PaymentMethodsProvider>
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
            <Button Icon={AddCircle} size="md" onClick={() => {}}>
              {t('paymentInvoices.history.table.addnewcard')}
            </Button>
          </div>
          <Routes />
        </div>
      </PaymentMethodsProvider>
    </React.Fragment>
  );
};

export default PaymentMethods;
