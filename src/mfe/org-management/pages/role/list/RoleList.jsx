import React, { useState } from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
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
import usePermission from '@src/hooks/usePermissions';
import { useFilters, usePagination, useSort, useTable } from '@src/context/TableContext';

const RoleList = ({ onAlert }) => {
  const { t } = useTranslate();
  const [selection, setSelection] = React.useState(null);
  const { hasPermission } = usePermission();
  const columns = createColumns(t, selection, setSelection, hasPermission);
  const { applySort } = useSort();
  const { isError, error } = {};
  const dispatch = useDispatch();
  const { pagination, changePage } = usePagination();
  const { data, loading, refreshData } = useTable();
  const { filters } = useFilters();
  const showCardView = useResponsiveView();
  const isDataFiltered = Object.values(filters).some((v) => v !== null && v !== undefined && v !== '');

  const { mutate: deleteRole } = useMutation({
    mutationFn: async (id) => {
      const response = await HttpResourceService.callRest(`${ApiRoutes.GET_ROLES()}/${id}`, httpVerb.DELETE);
      return response.data;
    },
    onError: (error, variables, context) => {
      onAlert({
        type: 'error',
        description: t('errors.default')
      });
    },
    onSuccess: (data, variables, context) => {
      setSelection(null);
      onAlert({
        type: 'success',
        description: t('orgManagement.messages.deleteRoleSuccess')
      });
      refreshData();
    }
  });

  const handleSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort(selectedColumn.sortKey, sortDirection);
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
            deleteRole(selection[0]);
            dispatch(closeModal());
          }}>
          {t('orgManagement.button.OK')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  return (
    <div>
      <TableHeading
        heading={t('orgManagement.role.labelRolesListing')}
        secondaryView={selection}
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
        currentPage={pagination.pageNumber}
        totalPageCount={pagination.totalPages}
        pagination={true}
        handleChangePage={(_event, newPageIndex) => changePage(newPageIndex)}
        totalRocords={pagination.totalElements}
        recordsPerPage={pagination.pageSize}
        paginationTotalRecorsMessage={'results'}
        paginationRecordsPerPageMessage={`per page`}
        selectableRowsHeader={false}
        selectedRowId={selection}
        showCardView={showCardView}
        defaultExpandedCardView={true}
        noDataComponent={
          <EmptyDataTable
            error={isError && error}
            isLoading={loading}
            image={EmptyDataImage}
            heading={isDataFiltered ? t('errors.messages.noRecordsFound') : t('message.emptyTableTitle')}
            description={!isDataFiltered && t('orgManagement.messages.roleEmptyTableSubtitle')}
          />
        }
        stickyHeader
        responsive
      />
    </div>
  );
};

export default RoleList;
