import React, { useState } from 'react';
import { CustomDataTable, Button, Badge } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useRole } from '../../../context/RoleContext';
import { createColumns } from './Columns';

function getColorByStatus(status) {
    switch (status) {
        case 'Active':
            return 'success';
        case 'Inactive':
            return 'error';
        default:
            return 'info';
    }
}

const RolesDataTable = () => {
    const { t } = useTranslate();
    const [selectedRows, setSelectedRows] = useState([]);

    const columns = createColumns(t)

    const {
        data,
        pagination: {
            currentPage,
            totalPageCount,
            totalRecords,
            recordsPerPage,
            update: { setCurrentPage }
        }
    } = useRole();

    const handleChangePage = (e, newPage) => {
        setCurrentPage(newPage);
    };

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
                data={data} // Use currentData for pagination
                onSortIconClick={handleSort}
                currentPage={currentPage}
                totalPageCount={totalPageCount}
                pagination={true}
                handleChangePage={handleChangePage}
                totalRocords={totalRecords} // Corrected typo here
                recordsPerPage={recordsPerPage}
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
