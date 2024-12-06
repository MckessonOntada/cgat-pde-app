import React, { useState } from 'react';
import { CustomDataTable, Button, Loader, Modal, Heading } from '@mckesson/mcp-component-library';
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

const RolesDataTable = () => {
  const { t } = useTranslate();
  const [selectedRows, setSelectedRows] = useState(null);
  const columns = createColumns(t, selectedRows, setSelectedRows);
  const { applySort } = useRole();
  const { data, paginationConfig, setPageNumber, isLoading, refreshData, setMessage } = useRole();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
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

  const handleDeactivate = () => {
    setIsModalOpen(true);
  };

  const handleOnUserConfirmation = () => {
    deleteRole(selectedRows);
    setIsModalOpen(false);
  }

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

      {isLoading ? (
        <div className="dashboard-loader">
          <Loader variant="circular" />
        </div>
      ) : (
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
      )}

          <Modal
            id="discard-role-deactivate-modal"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            modalTitle="Deactivate role?"
            modalBody={
                <Heading as="h3">
                    Do you want to deactivate this role?
                </Heading>
            }
            modalFooter={
                <div className="controls">
                    <Button size="md" variant="secondary" onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button size="md" variant="primary" onClick={handleOnUserConfirmation}>
                        Okay
                    </Button>
                </div>
            }
            modalSize="md"
        />
    </div>
  );
};

export default RolesDataTable;
