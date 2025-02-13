import React from 'react';
import { TabList, Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { routesConfig } from './../../routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '../../../../components/module-header';
import { getTabs } from './constants';
import OrderDataTable from './OrderDataTable';
import CommonFilters from '@src/components/Filters';
import { useOrders } from '../../context/OrderContext';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import PermittedComponent from '@src/components/permitted-component';
import usePermission from '@src/hooks/usePermissions';

const OrderIndex = () => {
  const { t } = useTranslate();
  const { hasPermission } = usePermission();
  const isPendingTab = hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.VIEW_PENDING_ORDERS);
  const isSubmittedTab = hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.VIEW_ORDERS);
  const { applyFilters, clearFilters, changeTab, tabVariant, setTabVariant } = useOrders();
  const [tabList, setTabList] = React.useState(() => {
    const allTabs = getTabs(t);
    return allTabs.filter((tab) => {
      if (tab.id === 1 && isPendingTab) {
        setTabVariant(1);
        return true;
      }
      if (tab.id === 2 && isSubmittedTab) {
        setTabVariant(2);
        return true;
      }
      return false;
    });
  });

  const navigate = useNavigate();
  const location = useLocation();
  const activeTabFromState = location.state?.activeTab;
  const activeTab = tabList.find((tab) => tab.id === tabVariant);
  const [tabKey, setTabKey] = React.useState(activeTabFromState || activeTab?.id);

  const alertContainerId = 'summary-alert-container';
  const additionalFiltersConfig = React.useMemo(() => {
    if (activeTab?.id === 2) return [];

    return [
      {
        type: 'dropdown',
        name: 'status',
        label: t('userManagement.table.status'),
        options: [
          { label: 'ALL', value: 'ALL' },
          { label: 'IN DRAFT', value: 'IN_DRAFT' },
          { label: 'APPROVAL PENDING', value: 'APPROVAL_PENDING' }
        ]
      }
    ];
  }, [activeTab]);

  const setActiveTab = (activeTab) => {
    setTabList(
      tabList.map((tab) => ({
        ...tab,
        isActiveTab: tab.id === activeTab
      }))
    );
  };

  const handleOnTabChange = (tab) => {
    setActiveTab(tab.id);
    setTabKey(tab.id);
    changeTab(tab.id);
  };

  const handleOnClick = () => {
    navigate(routesConfig.createOrder);
  };

  React.useEffect(() => {
    if (activeTabFromState) {
      setActiveTab(activeTabFromState);
      setTabVariant(2); // Set the tab from state
    } else {
      if (isPendingTab || (isPendingTab && isSubmittedTab)) {
        setActiveTab(1);
        setTabVariant(1);
      } else if (isSubmittedTab) {
        setActiveTab(2);
        setTabVariant(2);
      }
    }
  }, [activeTabFromState]);

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('headings.orders')}</Heading>}
          controls={
            <div className="controls">
              <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.ADD_ORDERS}>
                <Button
                  Icon={AddCircleFilled}
                  className="button-icon"
                  onClick={handleOnClick}
                  size="lg"
                  aria-label={t('controls.createNewOrder')}>
                  {t('controls.ariaLabels.createNewOrder')}
                </Button>
              </PermittedComponent>
            </div>
          }
        />
        <div id={alertContainerId} />
        {/* add alert here */}

        <div className="MCP-module-body">
          <div className="MCP-panel-container">
            <div className="customTab">
              <TabList
                options={tabList}
                alignment="left"
                onTabClick={handleOnTabChange}
                showShadow={false}
                variant={'text'}
                useAsButton={true}
                aria-label={t('controls.ariaLabels.orderTabList')}
              />
            </div>
            <div className="MCP-CardContainer" key={tabKey}>
              <CommonFilters
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
                additionalFilters={additionalFiltersConfig}
                searchPlaceholder={t('controls.placeholder.searchOrderPlaceholder')}
              />
            </div>
            <div className="MCP-table-wrapper">
              <OrderDataTable tab={activeTab && activeTab.id} alertContainerId={alertContainerId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderIndex;
