import React from 'react';
import { TabList, Button, Heading } from "@mckesson/mcp-component-library";
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle.svg';
import { useNavigate } from 'react-router-dom';
import { routesConfig } from './../../routes/constants';
import { useOrders } from '../../context/OrderContext';
import { pendingData, submittedData } from './__mock__';
import { useTranslate } from '@src/translations/useTranslation';
import PageHeader from '@src/components/pageHeader';
import ModuleHeader from '../../../../components/module-header';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import FilterPanel from './FilterPanel';
import { tabs, breadcrumbItems } from './constants';
import OrderDataTable from './OrderDataTable';
import CommonFilters from '@src/components/Filters';

const OrderIndex = () => {
    const [tabList, setTabList] = React.useState([...tabs]);
    const { t } = useTranslate();
    const { applyFilters, clearFilters } = useOrders();
    const navigate = useNavigate();
    const { setOrdersData } = useOrders();

    const AdditionalFiltersConfig = [];

    const getTabData = (activeTab) => activeTab === "SUBMITTED" ? submittedData : pendingData;
    const setActiveTab = (activeTab) => {
        setTabList(tabList.map(tab => ({
            ...tab,
            isActiveTab: tab.configName === activeTab
        })));
        setOrdersData(getTabData(activeTab));
    };

    const handleOnTabChange = (tab) => {
        setActiveTab(tab.configName)
    };

    const handleOnClick = () => navigate(routesConfig.createOrder);

    React.useEffect(() => {
        setActiveTab(tabs[0].configName);
    }, []);

    return (
        <div className="MCP-module-wrapper">
            <Breadcrumb items={breadcrumbItems} />
            <ModuleHeader
                heading={<PageHeader heading={t('headings.orders')} />}
                controls={
                    <Button
                        Icon={AddCircleFilled}
                        onClick={handleOnClick}
                        size="md"
                        aria-label={t('controls.createNewOrder')}
                    >
                        {t('controls.ariaLabels.createNewOrder')}
                    </Button>
                }
            />
            <div className="MCP-module-body">
                <div className="MCP-panel-container">
                    <TabList
                        options={tabList}
                        alignment="left"
                        onTabClick={handleOnTabChange}
                        showShadow={false}
                        variant={"text"}
                        useAsButton={true}
                        aria-label={t('controls.ariaLabels.orderTabList')}
                    />
                    <div className="MCP-CardContainer">
                        <CommonFilters
                            onApplyFilters={applyFilters} 
                            onClearFilters={clearFilters}
                            additionalFilters={AdditionalFiltersConfig}
                            searchPlaceholder={t('controls.placeholder.searchOrderPlaceholder')} 
                        />
                    </div>
                    <div className="MCP-table-wrapper">
                        <Heading as="h2">{t('headings.orderListing')}</Heading>
                        <OrderDataTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderIndex;
