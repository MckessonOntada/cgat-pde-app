import React, { useEffect } from 'react';
import { CustomDataTable, Dropdown, RadioGroup } from '@mckesson/mcp-component-library';
import styles from './../CreateOrder.module.scss';
import { AccountsTableProvider, useAccountsTable } from '../../../context/AccountContext';
import initialAccountsData from '../__mock__';

const columns = [
    {
        id: 'acountId',
        name: '',
        selector: () => { },
        sortable: false,
        width: '5%',
        cell: props => <span className={styles.cellWrapper}>
            {
                <RadioGroup
                    caption=""
                    direction="column"
                    id="radioGroup + 0.4533187688543612 + 0.44797331210626545"
                    items={[
                        {
                            isDisabled: false,
                            label: ' ',
                            value: props.id
                        }]}
                    onChangeValue={() => { }}
                    onOtherTextChange={() => { }}
                    onSubRadioFieldChange={() => { }}
                    radioBtnWidth="auto"
                    value="option1"
                />
            }
        </span>,
    }, {
        id: 'accountName',
        name: 'Account Name',
        selector: () => { },
        sortable: false,
        width: '35%',
        cell: props => <span className={styles.cellWrapper}> {props.accountName}</span>,
    }, {
        id: 'accountNumber',
        name: 'Account Number',
        selector: () => { },
        sortable: false,
        width: '15%',
        cell: props => <span className={styles.cellWrapper}> {props.accountNumber}</span>,
    }, {
        id: 'address',
        name: 'Address',
        selector: () => { },
        sortable: false,
        width: '45%',
        cell: props => <span className={styles.cellWrapper}> {props.address}</span>,
    },
]

const AccountsTableComponent = () => {
    const { filterState, pageConfig, dataState, setAccountData, setPageSize, setCurrentPage, updatePageConfig } = useAccountsTable();

    React.useEffect(() => {
        setAccountData(initialAccountsData);
    }, [])

    useEffect(() => {
    }, [filterState]);

    const { currentPage, pageSize } = pageConfig;
    const batchEnd = currentPage * pageSize;
    const batchStart = batchEnd - pageSize;
    const batch = dataState.slice(batchStart, batchEnd);

    return (
        <div className={styles.dataTableWrapper}>
            <CustomDataTable
                columns={columns}
                data={batch}
                handleChangePage={(_, pageIndex) => setCurrentPage(pageIndex)}
                pagination
                currentPage={currentPage}
                totalPageCount={pageConfig.pages}
                totalRecords={pageConfig.total}
                recordsPerPage={pageConfig.pageSize}
                paginationRecordsPerPageMessage={
                    <Dropdown
                        label="Page Size"
                        onChange={(value) => setPageSize(value)}
                        options={[10, 20, 30, 50].map((s) => ({ label: s.toString(), value: s }))}
                        value={pageConfig.pageSize}
                    />
                }
                paginationTotalRecordsMessage={`${pageConfig.total} results`}
            />
        </div>
    );
};

const AccountsTable = ({ initialData }) => (
    <AccountsTableProvider initialData={initialData}>
        <AccountsTableComponent />
    </AccountsTableProvider>
);

export default AccountsTable;
