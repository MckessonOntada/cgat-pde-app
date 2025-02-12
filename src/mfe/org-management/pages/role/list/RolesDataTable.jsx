import React, { useState } from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useRole } from '../../../context/RoleContext';
import { createColumns } from './RoleTableColumns';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import './Role.scss';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';
import TableHeading from '@src/components/tableHeading/TableHeading';

const RolesDataTable = () => {
  const { t } = useTranslate();
  const [selectedRows, setSelectedRows] = useState(null);
  const columns = createColumns(t, selectedRows, setSelectedRows);
  const { applySort } = useRole();
  const { data, paginationConfig, setPageNumber, isLoading, refreshData, setMessage } = useRole();
  const dispatch = useDispatch();
  const showCardView = useResponsiveView();

  const { mutate: deleteRole } = useMutation({
    mutationFn: async (id) => {
      const response = await HttpResourceService.callRest(`${ApiRoutes.GET_ROLES()}/${id}`, httpVerb.DELETE);
      return response.data;
    },
    onError: (error, variables, context) => {
      setMessage({
        kind: 'error',
        primaryMessage: t('orgManagement.messages.deleteRoleFailed')
      });
    },
    onSuccess: (data, variables, context) => {
      setSelectedRows(null);
      setMessage({
        kind: 'success',
        primaryMessage: t('orgManagement.messages.deleteRoleSuccess')
      });
      refreshData();
    }
  });

  const handleSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows.map((row) => row.id));
  };

  const handleOnUserConfirmation = () => {
    const state = {};
    state.title = t('userManagement.confirmationMessage');
    state.body = (
      <div className="MCP-modal-body">
        <p>{t('orgManagement.message.roleDeactivateConfirmationDescription')}</p>
      </div>
    );
    state.footer = (
      <div className="controls">
        <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
          Cancel
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            deleteRole(selectedRows);
            dispatch(closeModal());
          }}>
          Okay
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  return (
    <div>
      <TableHeading
        heading={t('orgManagement.role.labelRolesListing')}
        secondaryView={!!selectedRows}
        secondaryViewHeading={`1 ${t('orgManagement.selected_items')}`}
        secondaryViewControls={
          <Button variant="secondary" onClick={handleOnUserConfirmation}>
            {t('orgManagement.button.deactivate')}
          </Button>
        }
        style={{ marginBottom: '16px' }}
      />

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
        showCardView={showCardView}
        defaultExpandedCardView={true}
        noDataComponent={
          <EmptyDataTable
            isLoading={isLoading}
            image={EmptyDataImage}
            heading={t('message.emptyTableTitle')}
            description={t('orgManagement.messages.roleEmptyTableSubtitle')}
          />
        }
        stickyHeader
        responsive
      />
    </div>
  );
};

export default RolesDataTable;
