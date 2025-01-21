import React, { useState, useEffect, useMemo } from 'react';
import { Button, Badge, CheckboxGroup, Modal, Tooltip } from '@mckesson/mcp-component-library';
import './index.scss';
import Actions from './Actions';
import { useTranslate } from '@src/translations/useTranslation';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import CommonUtils from '@src/util/CommonUtils';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { PERMISSIONS_ENUM } from '../UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';

function getBackgroundColorByRole(Role) {
  switch (Role) {
    case 'ORGANIZATION ADMIN':
      return 'success';
    case 'ORGANIZATION USER':
      return 'primary';
    default:
      return 'info';
  }
}

function UserTable({ onActionSuccess }) {
  const { t } = useTranslate();
  const [selectedRows, setSelectedRows] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { isLoading, isError, error, data, activeTab, paginationConfig, applySort, refreshData, setPageNumber } = useUser();
  const userPermissions = AuthUtils.getUserPermissions();
  const { hasPermission } = usePermission();
  const showCardView = useResponsiveView();

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const handleDeactivateUser = async (userId) => {
    const res = await HttpResourceService.callRest(
      `${ApiRoutes.USERS()}/${userId}?${serializeParams(requestParams)}`,
      httpVerb.DELETE,
      null
    );
    return res.data;
  };

  const { mutate } = useMutation({
    mutationFn: handleDeactivateUser,
    onSuccess: (response) => {
      refreshData();
      setSelectedRows(null);
      const isSuccess = true;
      const message = t('messages.user_deactivate_success');
      onActionSuccess(isSuccess, message); // callback
    },
    onError: (error) => {
      console.error(`Failed to deactivate user:`, error);
      const isSuccess = false;
      const message = t('messages.user_deactivate_failure');
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
        showInMobileHeader: true,
        cell: (row) => (
          <CheckboxGroup
            id={'default'}
            caption=""
            items={[
              {
                onChange: (event) => setSelectedRows(event.target.checked ? row.id : null),
                value: row.id,
                isChecked: selectedRows === row.id,
                isDisabled: !row.isActive
              }
            ]}
          />
        ),
        wrap: true,
        width: '40px',
        omit: activeTab === 2
      },
      // { name: 'ID', selector: 'id', sortable: true, omit: true },
      {
        id: 'name',
        name: t('userManagement.table.name'),
        selector: (row) => `${row.name.firstName} ${row.name.lastName}`,
        sortable: true,
        sortKey: 'last_name',
        wrap: true,
        minWidth: '150px',
        cell: (props) => (
          <div>
            {activeTab === 2 ? (
              <EclipsesTextcss str={`${props.name.lastName}, ${props.name.firstName} ${props.name.middleName || ''}`} maxWidth={300} />
            ) : (
              <React.Fragment>
                {hasPermission(PERMISSIONS_ENUM.USER_MANAGEMENT.VIEW_USERS) ? (
                  <Link
                    to={`${props.id}`} // dynamically constructs the URL with userId
                    className="MCP-table-link">
                    <EclipsesTextcss
                      str={`${props.name.lastName}, ${props.name.firstName} ${props.name.middleName || ''}`}
                      maxWidth={140}
                    />
                  </Link>
                ) : (
                  <EclipsesTextcss str={`${props.name.lastName}, ${props.name.firstName} ${props.name.middleName || ''}`} maxWidth={300} />
                )}
              </React.Fragment>
            )}
          </div>
        )
      },

      {
        id: 'email',
        name: t('userManagement.table.email'),
        selector: (row) => row.contact.email,
        sortable: true,
        sortKey: 'email',
        wrap: true,
        minWidth: '200px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.contact.email} maxWidth={190} />
          </div>
        )
      },
      {
        id: 'role',
        name: t('userManagement.table.role'),
        selector: (row) => row.contact.role.name || '',
        center: true,
        wrap: true,
        minWidth: '120px',
        maxWidth: '180px',
        cell: (props) =>
          props.role?.name ? (
            <Tooltip body={props.role?.name}>
              <span className="cellEllipse">
                <Badge text={props.role?.name} type={getBackgroundColorByRole(props.role?.name)} />
              </span>
            </Tooltip>
          ) : (
            '-'
          ),
        omit: isSystemAdminView || activeTab === 2
      },
      {
        id: 'status',
        name: t('userManagement.table.status'),
        selector: () => {},
        center: true,
        minWidth: '80px',
        cell: (props) => (
          <div>
            {activeTab === 2 ? (
              <Badge text="Pending" type="info-default" />
            ) : props.isActive ? (
              <Badge text="Active" type="success" />
            ) : (
              <Badge text="Inactive" type="info-default" />
            )}
          </div>
        )
      },
      {
        id: 'dataAdded',
        name: t('userManagement.table.dateAdded'),
        selector: () => {},
        wrap: true,
        minWidth: '100px',
        cell: (props) => CommonUtils.convertDateStringFormat(props.updatedAt || props.createdAt, 'MM-DD-YYYY')
      },
      {
        id: 'action',
        center: true,
        name: t('userManagement.table.action'),
        cell: (row) => (
          <Actions
            row={row}
            showEditButton={activeTab === 2 && hasPermission(PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_USERS)}
            showViewButton={activeTab !== 2 && hasPermission(PERMISSIONS_ENUM.USER_MANAGEMENT.VIEW_USERS)}
          />
        ),
        omit: isSystemAdminView,
        isAction: true
      }
    ];
  }, [data, userPermissions]);

  return (
    <div>
      {selectedRows && (
        <div className="selected-item-alert">
          <p className="selected-item-text">
            {1} {t('userManagement.selected_items')}
          </p>
          <Button variant="secondary" onClick={handleDeactivate}>
            {t('userManagement.button.deactivate')}
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
        paginationTotalRecorsMessage={t('userManagement.results')}
        paginationRecordsPerPageMessage={t('userManagement.per_page')}
        stickyHeader
        responsive
        pagination={true}
        showCardView={showCardView}
        noDataComponent={
          <EmptyDataTable
            error={(isError && error.message) || 'Something went wrong, Please try again later.'}
            isLoading={isLoading}
            image={EmptyDataImage}
            heading={t('message.userEmptyTableTitle')}
            description={t('userManagement.messages.userEmptyTableSubtitle')}
          />
        }
      />
      <Modal
        {...{
          id: 'xxxs-modal',
          isOpen,
          onClose: () => setIsOpen(false),
          modalTitle: t('userManagement.confirmationmessage'),
          modalBody: <h3>{t('userManagement.message.DeactivateUser')}</h3>,
          modalFooter: (
            <React.Fragment>
              <Button onClick={handleConfirmCancel} variant="secondary" size="sm">
                {t('userManagement.label.cancel')}
              </Button>
              <Button size="sm" onClick={handleConfirmDeactivate}>
                {t('userManagement.button.deactivate')}
              </Button>
            </React.Fragment>
          ),
          modalSize: 'xxxs'
        }}
      />
    </div>
  );
}

export default UserTable;
