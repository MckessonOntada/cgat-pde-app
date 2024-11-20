import React, { useEffect } from 'react';
import { CustomDataTable, Dropdown } from '@mckesson/mcp-component-library';
import { AccountsTableProvider, useAccountsTable } from '../../../../context/AccountContext';
import initialAccountsData from '../../__mock__';
import { useTranslate } from '@src/translations/useTranslation';
import { createColumns } from './Columns';

const AccountsTableComponent = () => {
    const { t } = useTranslate();
    const { filterState, pageConfig, dataState, setAccountData, setPageSize, setCurrentPage, updatePageConfig } = useAccountsTable();
    const columns = createColumns(t);

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
    );
};

const AccountsTable = ({ initialData }) => (
    <AccountsTableProvider initialData={initialData}>
        <AccountsTableComponent />
    </AccountsTableProvider>
);

export default AccountsTable;
