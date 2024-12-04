import React, { useState } from 'react';
import { CustomDataTable, Button, Badge } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useRole } from '../../../context/RoleContext';
import { createColumns } from './RoleTableColumns';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';

const RolesDataTable = () => {
  const { t } = useTranslate();
  const [selectedRows, setSelectedRows] = useState(null);
  const columns = createColumns(t, selectedRows, setSelectedRows);
  const { applySort } = useRole();
  const { data, paginationConfig, setPageNumber, refreshData, setMessage } = useRole();

  const {mutate: deleteRole} = useMutation({
    mutationFn: async (id) => {
        const response = await HttpResourceService.callRest(`${ApiRoutes.GET_ROLES()}/${id}`, httpVerb.DELETE);
        return response.data;
      },
    onError: (error, variables, context) => {
        setMessage({
            kind: "error",
            primaryMessage: t('orgManagement.messages.deleteRoleFailed')
        });
    },
    onSuccess: (data, variables, context) => {
        setSelectedRows(null);
        setMessage({
            kind: "success",
            primaryMessage: t('orgManagement.messages.deleteRoleSuccess')
        });
        refreshData();
    },
  })

  const handleSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows.map((row) => row.id));
  };

  const handleDeactivate = () => {
    deleteRole(selectedRows)
  };

  return (
    <div>
      {selectedRows && (
        <div className="selected-item-alert">
          <p className="selected-item-text">1 Item's Selected</p>
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
        selectableRowsHeader={false}
        selectedRowId={selectedRows}
        noDataComponent={<EmptyDataTable image={EmptyDataImage} heading={t('message.emptyTableTitle')} description={t('orgManagement.messages.roleEmptyTableSubtitle')} />}
        stickyHeader
        responsive
      />
    </div>
  );
};

export default RolesDataTable;
