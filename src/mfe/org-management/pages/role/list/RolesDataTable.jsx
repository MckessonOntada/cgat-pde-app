import React, { useState } from 'react';
import { CustomDataTable, Button, Badge } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useRole } from '../../../context/RoleContext';
import { createColumns } from './RoleTableColumns';

const RolesDataTable = () => {
    const { t } = useTranslate();
    const [selectedRows, setSelectedRows] = useState([]);
    const columns = createColumns(t)

    const {
        currentPageData,
        paginationConfig
    } = useRole();

    const handleSort = (selectedColumn, sortDirection, sortedRows) => {
        // TODO
        console.log('Column sorted:', selectedColumn);
        console.log('Sort direction:', sortDirection);
        console.log('Sorted rows:', sortedRows);
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
                data={currentPageData}
                onSortIconClick={handleSort}
                currentPage={paginationConfig.pageNumber}
                totalPageCount={paginationConfig.totalPages}
                pagination={true}
                handleChangePage={(_event, newPageIndex) => paginationConfig.setCurrentPage(newPageIndex)}
                totalRocords={paginationConfig.totalElements} // Corrected typo here
                recordsPerPage={paginationConfig.pageSize}
                paginationTotalRecorsMessage={'results'}
                paginationRecordsPerPageMessage={`per page`}
                isAdmin={true}
                selectableRows
                handleRowSelected={handleRowSelected}
                selectedRowId={selectedRows[0]}
            />
        </div>
    );
};

export default RolesDataTable;
