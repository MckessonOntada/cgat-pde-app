import React, { useState } from 'react';
import { TabList } from "@mckesson/mcp-component-library";
import OrderDataTable from './OrderDataTable';
import { useTranslate } from '@src/translations/useTranslation';
import { Button, Badge } from "@mckesson/mcp-component-library";
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle.svg';
import { Link, useNavigate } from 'react-router-dom';
import { routesConfig } from './../../routes/constants';
import FilterPanel from './FilterPanel';
import { pendingData, submittedData } from './__mock__';
import { useOrders } from '../../context';
import PageHeader from '@src/components/pageHeader';
import ModuleHeader from '../../../../components/module-header';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
function OrderIndex() {
    const breadcrumbItems = [
        { label: 'Dashboard', url: '/'},
        { label: 'Manage Orders' }
    ]
    const [activeTab, setActiveTab] = useState("PENDING SUBMISSION");
    const { t } = useTranslate();
    const tableTitle = 'Order Listing';
    const navigate = useNavigate();
    const { setOrdersData } = useOrders();
    const tabs = [
        {
            id: 1,
            configName: "PENDING SUBMISSION",
            isActive: true,
            isActiveTab: activeTab === "PENDING SUBMISSION",
            sequence: 1,
            lableForMobile: "PENDING SUBMISSION",
        },
        {
            id: 2,
            configName: "SUBMITTED",
            isActiveTab: activeTab === "SUBMITTED",
            isActive: true,
            sequence: 2,
            lableForMobile: "SUBMITTED",
        },
    ];

    const handleOnClick = () => {
        navigate(routesConfig.createNew);
    }

    const handleOnTabChange = (tab) => {
        setActiveTab(tab.configName);
    }

    React.useEffect(() => {
        if (activeTab === "SUBMITTED") {
            setOrdersData(submittedData);
        } else {
            setOrdersData(pendingData);
        }
    }, [activeTab])

    return (
        <div className="MCP-module-wrapper">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />

            {/* module header */}
            <ModuleHeader
                heading={<PageHeader heading={"Orders"} />}
                controls={
                    <Button Icon={AddCircleFilled} onClick={handleOnClick} size="md" >
                        Create New Order
                    </Button>
                }
            />

            {/* module body */}
            <div className='MCP-module-body'>
                <div className="MCP-panel-container">
                    <TabList
                        options={tabs}
                        alignment="left"
                        onTabClick={handleOnTabChange}
                        showShadow={false}
                        variant={"text"}
                        useAsButton={true}
                    />
                    <div className='MCP-CardContainer'>
                        <FilterPanel />
                    </div>
                    <div className='MCP-table-wrapper'>
                        {/* <ModuleHeader
                            variant={"l2"}
                            heading={"Order Listing"}
                        /> */}
                        <p className='secondaryHeading'>Order Listing</p>
                        <OrderDataTable />
                    </div>
                </div>
            </div>


            {/* module footer */}
            <div className="controls">
                <Button size="md" variant="secondary">Cancel</Button>
                <Button size="md">Next</Button>
            </div>

        </div>
    );
}


export default OrderIndex;
