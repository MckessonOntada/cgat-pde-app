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

function getColorByStatus(status) {
    switch (status) {
        case 'In Draft':
            return 'info'; 
        case 'Approval Pending':
            return 'info';
        case 'Submitted':
            return 'success'; 
        case 'Cancelled':
            return 'error'; 
        default:
            return 'info'; 
    }
}

function getLinkByStatus({status, id}) {
    switch (status) {
        case 'In Draft':
            return <Link to={`create-order/${id}`}>Resume Order</Link>;
        case 'Approval Pending':
            return <Link to={`review-order/${id}`}>Review Order</Link>;
        case 'Submitted':
            return <Link to={`summary/${id}`}>View Details</Link>;
        default:
            return <Link to="#">No Action</Link>;
    }
}


function OrderIndex() {
    const [activeTab, setActiveTab] = useState("SUBMITTED");
    const [data, setData] = React.useState([]);
    const { t } = useTranslate();
    const tableTitle = 'Order Listing';
    const navigate = useNavigate();

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

    const columns = [
        {
            id: 'patient',
            name: 'Patient',
            selector: () => { },
            sortable: true,
            cell: props => (
                <span className={styles.cellWrapper}>{props.patient}</span>
            ),
        },
        {
            id: 'therapy',
            name: 'Therapy',
            selector: () => { },
            sortable: false,
            cell: props => <span className={styles.cellWrapper}> {props.therapy}</span>,
        },
        {
            id: 'author',
            name: 'Author',
            selector: () => { },
            sortable: false,
            cell: props => <span className={styles.cellWrapper}> {props.author}</span>,
        },
        {
            id: 'createdOn',
            name: 'Created On',
            selector: () => { },
            sortable: false,
            cell: props => <span className={styles.cellWrapper}> {props.createdOn}</span>,
        },
        {
            id: 'status',
            name: 'Status',
            selector: () => { },
            sortable: false,
            cell: props => <span className={styles.cellWrapper}> <Badge text={props.status} type={getColorByStatus(props.status)} /></span>,
        },
        {
            id: 'price',
            name: 'Price',
            selector: () => { },
            sortable: false,
            cell: props => <span className={styles.cellWrapper}> {props.price}</span>,
        },
        {
            id: 'actions',
            name: 'Actions',
            selector: () => { },
            sortable: false,
            cell: props => (
                <span className={styles.cellWrapper}>
                    <Link>{getLinkByStatus(props)}</Link>
                </span>
            ),
        }
    ]

    const handleOnClick = () => {
        navigate(routesConfig.createNew);
    }

    const handleOnTabChange = (tab) => {
        setActiveTab(tab.configName);
    }

    React.useEffect(() => {
        if(activeTab === "SUBMITTED"){
            setData(submittedData);
        }else{
            setData(pendingData);
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
                    columns={columns}
                    data={data}
                />
            </Panel>
        </div>
    );
}

export default OrderIndex;
