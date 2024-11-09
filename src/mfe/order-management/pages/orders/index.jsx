import React, { useState } from 'react';
import Panel from '../../components/panel';
import { TabList } from "@mckesson/mcp-component-library";
import OrderDataTable from './OrderDataTable';
import styles from './Orders.module.scss';
import { useTranslate } from '../../../../translations/useTranslation';
import { Button, Badge } from "@mckesson/mcp-component-library";
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle.svg';
import { Link, useNavigate } from 'react-router-dom';
import { routesConfig } from './../../routes/constants';
import FilterPanel from './FilterPanel';
import { pendingData, submittedData } from './__mock__';
import { useOrders } from '../../context';

function OrderIndex() {
    const [activeTab, setActiveTab] = useState("PENDING SUBMISSION");
    const { t } = useTranslate();
    const tableTitle = 'Order Listing';
    const navigate = useNavigate();
    const {setOrdersData} = useOrders();

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
        if(activeTab === "SUBMITTED"){
            setOrdersData(submittedData);
        }else{
            setOrdersData(pendingData);
        }
    }, [activeTab])

    return (
        <div className={styles.moduleWrapper}>
            <div className={styles.moduleControls}>
                <p className={styles.moduleTitle}>{t('orderManagement.headings.orders')}</p>
                <Button Icon={AddCircleFilled} onClick={handleOnClick} >
                    {t("orderManagement.captions.createNewUser")}
                </Button>
            </div>
            <Panel>
                <TabList
                    options={tabs}
                    alignment="left"
                    onTabClick={handleOnTabChange}
                    showShadow={false}
                    variant={"text"}
                    useAsButton={true}
                />
                <Panel>
                    <FilterPanel />
                </Panel>
                <OrderDataTable
                    title={tableTitle}
                />
            </Panel>
        </div>
    );
}

export default OrderIndex;
