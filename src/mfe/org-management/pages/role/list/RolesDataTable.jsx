import React, { useState } from 'react';
import { CustomDataTable, Button, Badge } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useRole } from '../../../context/RoleContext';
import { createColumns } from './RoleTableColumns';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';

const RolesDataTable = () => {
    const { t } = useTranslate();
    const [selectedRows, setSelectedRows] = useState([]);
    const columns = createColumns(t);
    const { applySort } = useRole();
    const {
        data,
        paginationConfig,
        setPageNumber
    } = useRole();


    const handleSort = (selectedColumn, sortDirection) => {
        if(selectedColumn.sortKey)
            applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection })
    };

    const handleRowSelected = ({ selectedRows }) => {
        setSelectedRows(selectedRows.map((row) => row.id));
    };

    const handleDeactivate = () => {
        setSelectedRows([]);
    };

    return (
        <div>
            {selectedRows.length > 0 && (
                <div className="selected-item-alert">
                    <p className="selected-item-text">{selectedRows.length} Item's Selected</p>
                    <Button variant="secondary" onClick={handleDeactivate}>
                        Deactivate
                    </Button>
                </div>
            )}

            <CustomDataTable
                id="my-data-table"
                type="normal"
                columns={columns}
                data={data}
                onSortIconClick={handleSort}
                currentPage={paginationConfig.pageNumber}
                totalPageCount={paginationConfig.totalPages}
                pagination={true}
                handleChangePage={(_event, newPageIndex) => setPageNumber(newPageIndex)}
                totalRocords={paginationConfig.totalElements} // Corrected typo here
                recordsPerPage={paginationConfig.pageSize}
                paginationTotalRecorsMessage={'results'}
                paginationRecordsPerPageMessage={`per page`}
                isAdmin={true}
                selectableRows
                handleRowSelected={handleRowSelected}
                selectedRowId={selectedRows?.[0]}
                noDataComponent={
                    <EmptyDataTable
                        image={EmptyDataImage}
                        heading={t('message.emptyTableTitle')}
                        description={t('orgManagement.messages.roleEmptyTableSubtitle')}
                    />
                }
            />
        </div>
    );
};

export default RolesDataTable;
