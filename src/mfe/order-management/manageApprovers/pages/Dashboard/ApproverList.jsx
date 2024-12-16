import React, { useState, useEffect, useMemo } from 'react';
import { CustomDataTable, Button, Badge, CheckboxGroup, Modal } from '@mckesson/mcp-component-library';

import { useTranslate } from '@src/translations/useTranslation';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import CommonUtils from '@src/util/CommonUtils';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { useApprover } from '../../context/ApproverContext';
import Actions from './Actions';
import { PERMISSIONS_ENUM } from '../../../../user-management/pages/UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';

function ApproverList({ onActionSuccess }) {
  const { t } = useTranslate();
  const [selectedRows, setSelectedRows] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { data, paginationConfig, applySort, setPageNumber, refreshData } = useApprover();
  const userPermissions = AuthUtils.getUserPermissions();
  const { hasPermission } = usePermission();

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const handleDeactivateApproverGroup = async (grpId) => {
    const res = await HttpResourceService.callRest(`${ApiRoutes.APPROVER_GROUP()}/${grpId}`, httpVerb.DELETE, null);
    return res.data;
  };

  const { mutate } = useMutation({
    mutationFn: handleDeactivateApproverGroup,
    onSuccess: (response) => {
      refreshData();
      setSelectedRows(null);
      const isSuccess = true;
      const message = t('approvergroup.messages.approvergroup_deactivate_success');
      onActionSuccess(isSuccess, message); // callback
    },
    onError: (error) => {
      console.error(`Failed to deactivate user:`, error);
      const isSuccess = false;
      const message = t('approvergroup.messages.approvergroup_deactivate_failure');
      onActionSuccess(isSuccess, message);
    }
  });

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const handleOnSortIconClick = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const handleDeactivate = () => {
    setIsOpen(true);
  };

  const handleConfirmDeactivate = () => {
    setIsOpen(false);
    mutate(selectedRows);
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
                onChange: (event) => setSelectedRows(event.target.checked ? row.id : null),
                value: row.id,
                isChecked: selectedRows === row.id,
                isDisabled: !row.active
              }
            ]}
          />
        ),
        wrap: true,
        width: '40px'
      },
      { name: 'ID', selector: 'id', sortable: true, omit: true },
      {
        id: 'name',
        name: t('approvergroup.table.groupname'),
        selector: (row) => `${row.name}`,
        sortable: true,
        sortKey: 'name',
        wrap: true,
        minWidth: '340px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.name} maxWidth={300} />
          </div>
        )
      },
      {
        id: 'createdBy',
        name: t('approvergroup.table.createdby'),
        selector: 'createdBy',
        wrap: true,
        minWidth: '160px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.createdBy} maxWidth={300} />
          </div>
        )
      },
      {
        id: 'createdAt',
        name: t('approvergroup.table.createdon'),
        selector: 'createdAt',
        wrap: true,
        minWidth: '160px',
        cell: (props) => CommonUtils.convertDateStringFormat(props.createdAt, 'MM-DD-YYYY')
      },
      {
        id: 'status',
        name: t('approvergroup.table.status'),
        selector: 'status',
        center: true,
        minWidth: '80px',
        cell: (props) => <div>{props.active ? <Badge text="Active" type="success" /> : <Badge text="Inactive" type="info-default" />}</div>
      },
      {
        id: 'action',
        center: true,
        name: t('approvergroup.table.action'),
        cell: (row) => <Actions row={row} />,
        width: '120px',
        omit: !hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.MANAGE_ORDERS)
      }
    ];
  }, [data, userPermissions]);

  return (
    <div>
      {selectedRows && (
        <div className="selected-item-alert">
          <p className="selected-item-text">
            {1} {t('approvergroup.selected_items')}
          </p>
          <Button variant="secondary" onClick={handleDeactivate}>
            {t('approvergroup.button.deactivate')}
          </Button>
        </div>
      )}

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
          modalBody: <h3>Are you sure you wish to Deactivate this Approver Group ?</h3>,
          modalFooter: (
            <React.Fragment>
              <Button onClick={handleConfirmCancel} variant="secondary">
                {t('approvergroup.button.cancel')}
              </Button>
              <Button onClick={handleConfirmDeactivate}>{t('approvergroup.button.deactivate')}</Button>
            </React.Fragment>
          ),
          modalSize: 'xxxs'
        }}
      />
    </div>
  );
}

export default ApproverList;
