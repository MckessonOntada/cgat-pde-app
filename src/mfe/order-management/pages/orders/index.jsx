import React from 'react';
import { TabList, Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle.svg';
import { useNavigate } from 'react-router-dom';
import { routesConfig } from './../../routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '../../../../components/module-header';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import { getTabs, breadcrumbItems } from './constants';
import OrderDataTable from './OrderDataTable';
import CommonFilters from '@src/components/Filters';
import { useOrders } from '../../context/OrderContext';
import { useManageOrder } from '../../context/ManageOrderContext';

const OrderIndex = () => {
  const { t } = useTranslate();
  const [tabList, setTabList] = React.useState(getTabs(t));
  const { applyFilters, clearFilters, changeTab } = useOrders();
  const { resetActiveRecord } = useManageOrder();
  const navigate = useNavigate();
  const activeTab = tabList.find((tab) => tab.isActiveTab);

  const additionalFiltersConfig = React.useMemo(() => {
    if (activeTab?.configName === 'Submitted') return [];

    return [
      {
        type: 'dropdown',
        name: 'status',
        label: t('userManagement.table.status'),
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'Approval Pending', value: 'approval pending' }
        ]
      }
    ];
  }, [activeTab]);

  const setActiveTab = (activeTab) => {
    setTabList(
      tabList.map((tab) => ({
        ...tab,
        isActiveTab: tab.configName === activeTab
      }))
    );
  };

  const handleOnTabChange = (tab) => {
    setActiveTab(tab.configName);
    changeTab(tab.configName);
  };

  const handleOnClick = () => {
    resetActiveRecord();
    navigate(routesConfig.createOrder);
  };

  React.useEffect(() => {
    setActiveTab(tabList?.[0].configName);
  }, []);

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumb items={breadcrumbItems} />
      <ModuleHeader
        heading={<Heading as="h1">{t('headings.orders')}</Heading>}
        controls={
          <div className="controls">
            <Button Icon={AddCircleFilled} onClick={handleOnClick} size="md" aria-label={t('controls.createNewOrder')}>
              {t('controls.ariaLabels.createNewOrder')}
            </Button>
          </div>
        }
      />

      {/* add alert here */}

      <div className="MCP-module-body">
        <div className="MCP-panel-container">
          <TabList
            options={tabList}
            alignment="left"
            onTabClick={handleOnTabChange}
            showShadow={false}
            variant={'text'}
            useAsButton={true}
            aria-label={t('controls.ariaLabels.orderTabList')}
          />
          <div className="MCP-CardContainer">
            <CommonFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={additionalFiltersConfig}
              searchPlaceholder={t('controls.placeholder.searchOrderPlaceholder')}
            />
          </div>
          <div className="MCP-table-wrapper">
            <Heading as="h2">{t('headings.orderListing')}</Heading>
            <OrderDataTable tab={activeTab && activeTab.configName.toLocaleLowerCase()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderIndex;
