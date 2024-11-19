import React from 'react';
import styles from './OrderDataTable.module.scss';
import { CustomDataTable, Dropdown, Badge } from '@mckesson/mcp-component-library';
import { useOrders } from '../../context';
import { Link } from 'react-router-dom';

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

function getLinkByStatus({ status, id }) {
    switch (status) {
        case 'In Draft':
            return <Link to={`create-new/${id}`}>Resume Order</Link>;
        case 'Approval Pending':
            return <Link to={`review-order/${id}`}>Review Order</Link>;
        case 'Submitted':
            return <Link to={`summary/${id}`}>View Details</Link>;
        default:
            return <Link to="#">No Action</Link>;
    }
}


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
        cell: props => <Badge text={props.status} type={getColorByStatus(props.status)} />
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

const OrderDataTable = ({ title, type = 'normal', pagination = true }) => {
    const { filterState, dataState: data, pageConfig, setPageConfig, setCurrentPage } = useOrders();
    
    React.useEffect(() => {
        if (data && Array.isArray(data)) {
            setPageConfig({
                total: data.length,
                pageSize: 8,
                pages: Math.ceil(data.length / pageConfig.pageSize),
                currentPage: 1,
            })
        }
    }, [data]);

    const handleOnPageSizeChange = (value) => {
        setPageSize(value);
    }
    
    const handleOnPageChange = (_event, pageIndex) => {
        setCurrentPage(pageIndex)
    }

    const { currentPage, pageSize } = pageConfig;
    const batchEnd = currentPage * pageSize;
    const batchStart = batchEnd - pageSize;
    const batch = data.slice(batchStart, batchEnd);

    return (
        <div
            className={styles.dataTableWrapper}
        >
            <CustomDataTable
                type={type}
                columns={columns}
                data={batch}
                // onSortIconClick={handleSortClick}
                handleChangePage={handleOnPageChange}
                // selectableRows={selectableRows}
                pagination={pagination}
                currentPage={pageConfig.currentPage}
                totalPageCount={pageConfig.pages}
                totalRocords={pageConfig.total}
                recordsPerPage={pageConfig.pageSize}
            />
        </div>
    )
}

export default OrderDataTable;