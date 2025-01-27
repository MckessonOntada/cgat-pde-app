import React, { useState, useEffect, useMemo } from 'react';
import { CustomDataTable, Button, Badge, CheckboxGroup, Modal } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import AuthUtils from '@src/util/AuthUtils';
import CommonUtils from '@src/util/CommonUtils';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { useApprover } from '../../context/ApproverContext';
import Actions from './Actions';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';
import { CustomDataTable } from '@src/components/dataTableComponent';
import useResponsiveView from '@src/hooks/useResponsiveView';
import TableHeading from '@src/components/tableHeading/TableHeading';

function ApproverList({ onActionSuccess }) {
  const { t } = useTranslate();
  const [selectedRows, setSelectedRows] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { data, paginationConfig, applySort, setPageNumber, refreshData } = useApprover();
  const userPermissions = AuthUtils.getUserPermissions();
  const { hasPermission } = usePermission();

  const handleActivateDeactivateApproverGroup = async ({ grpId, actionName }) => {
    if (actionName === t('approvergroup.button.activate')) {
      const resActivate = await HttpResourceService.callRest(`${ApiRoutes.APPROVER_GROUP()}/${grpId}/activate`, httpVerb.PATCH, null);
      return resActivate.data;
    } else {
      const resDeactivate = await HttpResourceService.callRest(`${ApiRoutes.APPROVER_GROUP()}/${grpId}`, httpVerb.DELETE, null);
      return resDeactivate.data;
    }
  };

  const { mutate } = useMutation({
    mutationFn: handleActivateDeactivateApproverGroup,
    onSuccess: (response, variables) => {
      const { actionName } = variables;
      refreshData();
      setSelectedRows(null);
      const isSuccess = true;
      const message =
        actionName === t('approvergroup.button.deactivate')
          ? t('approvergroup.messages.approvergroup_deactivate_success')
          : t('approvergroup.messages.approvergroup_activate_success');
      onActionSuccess(isSuccess, message);
    },
    onError: (error, variables) => {
      const { actionName } = variables;
      console.error(`Failed to deactivate user:`, error);
      const isSuccess = false;
      const message =
        actionName === t('approvergroup.button.deactivate')
          ? t('approvergroup.messages.approvergroup_deactivate_failure')
          : t('approvergroup.messages.approvergroup_activate_failure');
      onActionSuccess(isSuccess, message);
    }
  });

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const handleOnSortIconClick = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const handleActivateDeactivate = () => {
    setIsOpen(true);
  };

  const handleConfirm = (actionName) => {
    setIsOpen(false);
    mutate({ grpId: selectedRows?.id, actionName });
  };

  const handleConfirmCancel = () => {
    setIsOpen(false);
    setSelectedRows(null);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const columns = useMemo(() => {
    return [
      {
        id: 'checkbox',
        name: '',
        cell: (row) => (
          <CheckboxGroup
            id={'default'}
            caption=""
            items={[
              {
                onChange: (event) => setSelectedRows(event.target.checked ? row : null),
                value: row.id,
                isChecked: selectedRows?.id === row.id
              }
            ]}
          />
        ),
        wrap: true,
        width: '40px'
      },
      { name: 'ID', selector: (row) => row.ID, sortable: true, omit: true },
      {
        id: 'name',
        name: t('approvergroup.table.groupname'),
        selector: (row) => `${row.name}`,
        sortable: true,
        sortKey: 'name',
        wrap: true,
        minWidth: '150px',
        cell: (props) => <EclipsesTextcss str={props.name} maxWidth={140} />
      },
      {
        id: 'createdBy',
        name: t('approvergroup.table.createdby'),
        selector: (row) => row.createdBy.name,
        sortable: true,
        sortKey: 'createdBy',
        wrap: true,
        minWidth: '150px',
        cell: (props) => <EclipsesTextcss str={props.createdBy.name} maxWidth={140} />
      },
      {
        id: 'createdAt',
        name: t('approvergroup.table.createdon'),
        selector: (row) => row.createdAt,
        sortable: true,
        sortKey: 'createdAt',
        wrap: true,
        minWidth: '100px',
        cell: (props) => CommonUtils.convertDateStringFormat(props.createdAt, 'MM-DD-YYYY')
      },
      {
        id: 'status',
        name: t('approvergroup.table.status'),
        selector: (row) => row.status,
        center: true,
        minWidth: '100px',
        cell: (props) => <div>{props.active ? <Badge text="Active" type="success" /> : <Badge text="Inactive" type="info-default" />}</div>
      },
      {
        id: 'action',
        center: true,
        name: t('approvergroup.table.action'),
        cell: (row) => <Actions row={row} />,
        omit: !hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.VIEW_APPROVER_GROUP)
      }
    ];
  }, [data, userPermissions]);

  return (
    <div>
      <TableHeading
        heading={t('approvergroup.table.listing.label')}
        secondaryView={!!selectedRows}
        secondaryViewHeading={`1 ${t('approvergroup.selected_items')}`}
        secondaryViewControls={
          <Button
            variant="secondary"
            onClick={handleActivateDeactivate}
            disabled={!hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_APPROVER_GROUP)}>
            {selectedRows?.active ? t('approvergroup.button.deactivate') : t('approvergroup.button.activate')}
          </Button>
        }
        style={{ marginBottom: '24px' }}
      />

      <CustomDataTable
        type={'normal'}
        columns={columns}
        data={data}
        onSortIconClick={handleOnSortIconClick}
        handleChangePage={handleChangePage}
        selectableRowsHeader={false}
        currentPage={paginationConfig.pageNumber}
        totalPageCount={paginationConfig.totalPages}
        totalRocords={paginationConfig.totalElements}
        recordsPerPage={paginationConfig.pageSize}
        paginationTotalRecorsMessage={t('approvergroup.results')}
        paginationRecordsPerPageMessage={t('approvergroup.per_page')}
        stickyHeader
        responsive
        pagination={true}
        noDataComponent={
          <EmptyDataTable
            image={EmptyDataImage}
            heading={t('message.emptyTableTitle')}
            description={t('approvergroup.empty_table.description')}
          />
        }
      />
      <Modal
        {...{
          id: 'xxxs-modal',
          isOpen,
          onClose: () => setIsOpen(false),
          modalTitle: t('approvergroup.confirmationmessage'),
          modalBody: (
            <h3>
              {selectedRows?.active
                ? t('approvergroup.confirmationmessage.message')
                : t('approvergroup.confirmationmessage.activatemessage')}
            </h3>
          ),
          modalFooter: (
            <React.Fragment>
              <Button onClick={handleConfirmCancel} variant="secondary" size="sm">
                {t('approvergroup.button.cancel')}
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  handleConfirm(selectedRows?.active ? t('approvergroup.button.deactivate') : t('approvergroup.button.activate'))
                }>
                {selectedRows?.active ? t('approvergroup.button.deactivate') : t('approvergroup.button.activate')}
              </Button>
            </React.Fragment>
          ),
          modalSize: 'xxxs'
        }}
      />
    </div>
  );
}

export default ApproverList;
