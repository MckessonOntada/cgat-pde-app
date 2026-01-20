import React, { useState, useEffect, useMemo } from 'react';
import { Button, Badge, CheckboxGroup, Modal, Tooltip, MenuList } from '@mckesson/mcp-component-library';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import CommonUtils, { checkIsDataFiltered } from '@src/util/CommonUtils';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { PERMISSIONS_ENUM } from '../UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';
import { PATHS } from '../../routes';
import { RoutePaths } from '@src/routes/constants';
import { CUSTOMER_CENTRE, CUSTOMER_SERVICE } from '@src/api/commonService/CommonService';
import { USER_TABS } from './constants';
import ProviderService from '@src/api/commonService/ProviderService';

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

function UserTable({ onActionSuccess, showAlert }) {
  const { t } = useTranslate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');
  const [selectedRows, setSelectedRows] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const { isLoading, isError, error, data, paginationConfig, applySort, refreshData, setPageNumber, filterConfig } = useUser();
  const { isBack = false } = location.state || {};
  const userPermissions = AuthUtils.getUserPermissions();
  const currentUserId = AuthUtils.getUserId();
  const { hasPermission, hasAnyPermission } = usePermission();
  const showCardView = useResponsiveView();
  const navigate = useNavigate();
  const [selectedUserInfo, setSelectedUserInfo] = useState({
    userId: null,
    isActive: false
  });

  const isDataFiltered = React.useMemo(() => {
    return checkIsDataFiltered(filterConfig);
  }, [filterConfig]);

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const handleActivateDeactivateUser = async ({ userId, isActive }) => {
    let res;
    if (isActive) {
      res = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${userId}?${serializeParams(requestParams)}`, httpVerb.DELETE, null);
    } else {
      res = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${userId}/activate?${serializeParams(requestParams)}`, httpVerb.PATCH, null);
    }
    return res.data;
  };

  const { mutate } = useMutation({
    mutationFn: handleActivateDeactivateUser,
    onSuccess: (response) => {
      refreshData();
      setSelectedRows(null);
      const isSuccess = true;
      const message = t(selectedUserInfo?.isActive ? 'messages.user_deactivate_success' : 'messages.user_activate_success');
      onActionSuccess(isSuccess, message);
    },
    onError: (error) => {
      console.error(`Failed to deactivate user:`, error);
      const isSuccess = false;
      const message = t(selectedUserInfo?.isActive ? 'messages.user_deactivate_failure' : 'messages.user_activate_failure');
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

  const handleConfirmActivateDeactivate = () => {
    setIsOpen(false);
    mutate(selectedUserInfo);
  };

  const handleConfirmCancel = () => {
    setIsOpen(false);
    setSelectedRows(null);
  };

  useEffect(() => {
    if (isBack) {
      refreshData();
      setPageNumber(1);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const {
    mutate: rejectUser,
    isLoading: isLoadingReject,
    isError: isRejectError,
    data: rejectData
  } = useMutation(async ({ userId }) => {
    const reqParams = {
      status: 'REJECTED'
    };
    const rejectResponse = await HttpResourceService.callRest(
      `${ApiRoutes.USERS_PROVISIONING()}/${userId}/status?${serializeParams(reqParams)}`,
      httpVerb.PATCH,
      {}
    );
    return rejectResponse.data;
  });
  const { mutate: resendVerifyLink } = useMutation(
    async (email) => {
      await ProviderService.resendVerifyLink(email);
    },
    {
      onSuccess: () => {
        showAlert('success', t('userManagement.message.resendLinkSuccess'));
      },
      onError: (error) => {
        const errorResponse = error.response.data;
        let errorMessage = 'errors.default';
        if (
          errorResponse.status === 409 &&
          errorResponse.errorCodes &&
          Array.isArray(errorResponse.errorCodes) &&
          errorResponse.errorCodes.includes('user.already.active.conflict')
        ) {
          errorMessage = 'error.userActive';
        }

        showAlert('error', t(errorMessage));
      }
    }
  );

  const handleOnOptionSelection = (value, row) => {
    if (value == 'review') {
      navigate(row.status == 'PENDING' ? `../${row.id}/${PATHS.EDIT}` : `../${row.id}/${PATHS.REVIEW_USER}`, {
        state: { isPending: true }
      });
    } else if (value === 'resendLink') {
      resendVerifyLink(row.contact.email);
    } else if (value === 'edit') {
      navigate(`${row.id}`);
    } else if (value === 'reject') {
      rejectUser(
        { userId: row.id },
        {
          onSuccess: (response) => {
            navigate(RoutePaths.pathUserManagement, {
              state: { isReject: true, isSuccess: true },
              replace: true
            });
          },
          onError: (error) => {
            console.log('error: ', error);
          }
        }
      );
    }
  };

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
                onChange: (event) => {
                  setSelectedUserInfo({
                    userId: row?.id,
                    isActive: row?.isActive
                  });
                  setSelectedRows(event.target.checked ? row.id : null);
                },
                value: row.id,
                isChecked: selectedRows === row.id,
                isDisabled: (!isSystemAdmin && !row?.isActive) || AuthUtils.isPhysician(row?.role?.name, row?.role?.id)
              }
            ]}
          />
        ),
        wrap: true,
        width: '40px',
        omit:
          tab === USER_TABS.PENDING_REQUESTS ||
          !hasAnyPermission([PERMISSIONS_ENUM.USER_MANAGEMENT.ADD_USERS, PERMISSIONS_ENUM.ADMIN_MANAGEMENT.ADD_SYSTEM_ADMINISTRATOR])
      },
      {
        id: 'name',
        name: t('userManagement.table.name'),
        selector: (row) => `${row.name.firstName} ${row.name.lastName}`,
        sortable: true,
        sortKey: 'last_name',
        wrap: true,
        minWidth: '150px',
        cell: (props) => (
          <div className="entity-name">
            {tab === USER_TABS.PENDING_REQUESTS ? (
              <EclipsesTextcss str={CommonUtils.getFullName(props?.name)} maxWidth={140} />
            ) : (
              <React.Fragment>
                {hasPermission(PERMISSIONS_ENUM.USER_MANAGEMENT.VIEW_USERS) ? (
                  <Link
                    to={`${props.id}`} // dynamically constructs the URL with userId
                    className="MCP-table-link">
                    <EclipsesTextcss str={CommonUtils.getFullName(props?.name)} maxWidth={140} />
                  </Link>
                ) : (
                  <EclipsesTextcss str={CommonUtils.getFullName(props?.name)} maxWidth={300} />
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
        sortable: isSystemAdminView,
        sortKey: 'role_id',
        minWidth: '120px',
        maxWidth: '185px',
        cell: (props) =>
          props.role?.name ? (
            <Tooltip body={props.role?.name === CUSTOMER_CENTRE ? CUSTOMER_SERVICE : props.role?.name}>
              <span className="ellipsis-center">
                <Badge text={props.role?.name === CUSTOMER_CENTRE ? CUSTOMER_SERVICE : props.role?.name} type={getBackgroundColorByRole(props.role?.name)} />
              </span>
            </Tooltip>
          ) : (
            '-'
          )
      },
      {
        id: 'status',
        name: <span className="statusCenter">{t('userManagement.table.status')}</span>,
        selector: () => {},
        sortable: true,
        sortKey: 'is_active',
        center: true,
        minWidth: '80px',
        cell: (props) => (
          <div>
            {tab === USER_TABS.PENDING_REQUESTS ? (
              props.status == 'PENDING' ? (
                <Badge text="PENDING" type="info-default" />
              ) : (
                <Badge text="REJECTED" type="error" />
              )
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
        name: isSystemAdminView ? t('userManagement.table.dateAdded') : t('userManagement.table.dateAddedUpdated'),
        selector: (row) => (isSystemAdminView ? row.updated_At : row.updated_At || row.created_At),
        wrap: true,
        sortable: true,
        sortKey: isSystemAdminView ? 'created_At' : 'updated_At',
        minWidth: '100px',
        cell: (props) => CommonUtils.convertDateStringFormat(isSystemAdminView ? props.createdAt : props.updatedAt || props.createdAt, 'MM/DD/YYYY')
      },
      {
        id: 'dataUpdated',
        name: t('userManagement.table.dateUpdated'),
        selector: (row) => row.updated_At,
        wrap: true,
        sortable: true,
        sortKey: 'updated_At',
        minWidth: '100px',
        cell: (props) => CommonUtils.convertDateStringFormat(props.updatedAt, 'MM/DD/YYYY'),
        omit: !isSystemAdminView
      },
      {
        id: 'action',
        center: true,
        name: t('userManagement.table.action'),
        cell: (row) => (
          <MenuList
            menuIcon={<IconEllipsis key={'menu-list-users-table'} />}
            handleSelect={(value) => handleOnOptionSelection(value, row)}
            options={
              !isSystemAdminView
                ? tab === USER_TABS.PENDING_REQUESTS
                  ? [
                      {
                        label: t('userManagement.table.action.review'),
                        value: 'review'
                      },
                      ...(row.status !== 'REJECTED'
                        ? [
                            {
                              label: t('userManagement.button.rejectrequest'),
                              value: 'reject'
                            }
                          ]
                        : [])
                    ]
                  : [
                      {
                        label: t('userManagement.button.resendLink'),
                        value: 'resendLink'
                      },
                      {
                        label: t('userManagement.viewUser'),
                        value: 'edit'
                      }
                    ]
                : [
                    {
                      label: t('userManagement.button.resendLink'),
                      value: 'resendLink'
                    },
                    {
                      label: t('userManagement.viewUser'),
                      value: 'edit'
                    }
                  ]
            }
            aria-label="Order options"
            size="md"
          />
        ),
        isAction: true
      }
    ];
  }, [data, userPermissions]);

  return (
    <div>
      <TableHeading
        heading={isSystemAdminView ? t('userManagement.table.systemadminlisting.label') : t('userManagement.table.userlisting.label')}
        secondaryView={!!selectedRows}
        secondaryViewHeading={`1 ${t('userManagement.selected_items')}`}
        secondaryViewControls={
          <Button variant="secondary" onClick={handleActivateDeactivate} disabled={selectedRows == currentUserId ? true : false}>
            {t(selectedUserInfo?.isActive ? 'userManagement.button.deactivate' : 'userManagement.button.activate')}
          </Button>
        }
        style={{ marginBottom: '16px' }}
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
        paginationTotalRecorsMessage={t('userManagement.results')}
        paginationRecordsPerPageMessage={t('userManagement.per_page')}
        stickyHeader
        responsive
        pagination={true}
        showCardView={showCardView}
        defaultExpandedCardView={true}
        noDataComponent={
          <EmptyDataTable
            error={isError && error}
            isLoading={isLoading}
            image={EmptyDataImage}
            heading={
              isDataFiltered
                ? t('errors.messages.noRecordsFound')
                : isSystemAdminView
                ? t('userManagement.message.sysadminEmptyTableTitle')
                : t('userManagement.message.userEmptyTableTitle')
            }
            description={
              !isDataFiltered
                ? isSystemAdminView
                  ? t('userManagement.messages.sysadminEmptyTableSubtitle')
                  : t('userManagement.messages.userEmptyTableSubtitle')
                : ''
            }
          />
        }
      />
      <Modal
        {...{
          id: 'xxxs-modal',
          isOpen,
          onClose: () => setIsOpen(false),
          modalTitle: t('userManagement.confirmationMessage'),
          modalBody: (
            <div className="MCP-modal-body">
              <p>{t(selectedUserInfo?.isActive ? 'popup.userDeactivation.question' : 'popup.userActivation.question')}</p>
            </div>
          ),
          modalFooter: (
            <React.Fragment>
              <Button onClick={handleConfirmCancel} variant="secondary" size="md">
                {t('userManagement.label.cancel')}
              </Button>
              <Button size="md" onClick={handleConfirmActivateDeactivate}>
                {t(selectedUserInfo?.isActive ? 'userManagement.button.deactivate' : 'userManagement.button.activate')}
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
