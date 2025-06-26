import { Badge, Button, CheckboxGroup, Modal } from '@mckesson/mcp-component-library';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import useSessionFeatures from '@src/hooks/useSessionFeatures';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import { useOrg } from '../../context/OrgContext';
import { PATHS } from '../../routes/constants';
import Actions from './Actions';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';
import { CustomDataTable } from '@src/components/dataTableComponent';
import useResponsiveView from '@src/hooks/useResponsiveView';
import TableHeading from '@src/components/tableHeading/TableHeading';
import usePermission from '@src/hooks/usePermissions';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';

const OrgList = ({ onActionSuccess }) => {
  const { t } = useTranslate();
  const [selectedRows, setSelectedRows] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { data, paginationConfig, isLoading, isError, refreshData, setPageNumber, applySort, fileteredData } = useOrg();
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  const showCardView = useResponsiveView();

  const handleDeActivateOrg = async (orgId) => {
    const res = await HttpResourceService.callRest(`${ApiRoutes.PUBLIC_ORGANIZATIONS}/${orgId}`, httpVerb.DELETE);

    if (![201, 200].includes(res.status)) {
      throw new Error('Failed to create user');
    }
    return res;
  };

  const { mutate } = useMutation({
    mutationFn: handleDeActivateOrg,
    onSuccess: async () => {
      setSelectedRows(null);
      await refreshData();
      const isSuccess = true;
      const message = t('orgManagement.messages.DeactivateOrgSuccess');
      onActionSuccess(isSuccess, message);
    },
    onError: (error) => {
      const isSuccess = false;
      const message = t('orgManagement.messages.DeactivateOrgFailure');
      onActionSuccess(isSuccess, message);
    }
  });

  const {
    organization: { setOrganization }
  } = useSessionFeatures();

  const handleClick = (e, org) => {
    e.preventDefault();

    const state = {};
    state.title = t('orgManagement.message.accountSelectionConfirmationTitle');
    state.body = (
      <div className="MCP-modal-body">
        <p>{t('orgManagement.message.accountSelectionConfirmationDescription')}</p>
      </div>
    );
    state.footer = (
      <div className="controls">
        <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
          {t('orgManagement.button.cancel')}
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            setOrganization(org);
            dispatch(closeModal());
            window.location.href = '/admin';
          }}>
          {t('orgManagement.button.OK')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  const columns = [
    // The DeActive organization is been made as a single de-active
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
      omit: !hasPermission(PERMISSIONS_ENUM.ORGANIZATION_MANAGEMENT.ADD_ORGANIZATION)
    },
    {
      id: 'name',
      name: t('orgManagement.table.name'),
      cell: (row) => (
        <div>
          {row.isActive ? (
            <Link variant="tertiary" className="MCP-table-link" onClick={(e) => handleClick(e, row)}>
              <EclipsesTextcss str={row.name} maxWidth={200} />
            </Link>
          ) : (
            <EclipsesTextcss str={row.name} maxWidth={200} />
          )}
        </div>
      ),
      sortable: true,
      sortKey: 'name',
      minWidth: '210px',
      wrap: true
    },
    {
      id: 'orgId',
      name: t('orgManagement.table.id'),
      selector: (row) => row.id,
      sortable: true,
      minWidth: '140px',
      sortKey: 'id',
      wrap: true
    },
    {
      id: 'location',
      name: t('orgManagement.table.location'),
      cell: (row) => (
        <div>
          <EclipsesTextcss str={row.address.state} maxWidth={240} />
        </div>
      ),
      sortable: true,
      sortKey: 'state',
      minWidth: '250px',
      wrap: true
    },
    {
      id: 'date',
      name: t('orgManagement.table.dateUpdated'),
      selector: (row) => row.updatedAt,
      sortable: true,
      sortKey: 'updated_At',
      cell: (row) =>
        row.updatedAt
          ? CommonUtils.convertDateStringFormat(row.updatedAt, 'MM/DD/YYYY')
          : row.createdAt
          ? CommonUtils.convertDateStringFormat(row.createdAt, 'MM/DD/YYYY')
          : 'N/A',
      minWidth: '100px',
      wrap: true
    },
    {
      id: 'status',
      name: t('orgManagement.table.status'),
      cell: (row) => (
        <div className="cellEllipse">
          <Badge
            text={row.isActive ? t('orgManagement.button.activate') : t('orgManagement.button.inactivate')}
            type={row.isActive ? 'success' : 'info-default'}
          />
        </div>
      ),
      minWidth: '100px',
      wrap: true,
      center: true
    },
    {
      id: 'action',
      name: t('orgManagement.table.action'),
      cell: (row) => <Actions row={row} />, // Pass row as a named prop
      minWidth: '100px',
      wrap: true,
      center: true,
      isAction: true
    }
  ];

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const handleSort = (selectedColumn, sortDirection, sortedRows) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows.map((row) => row.id));
  };

  const handleDeactivate = () => {
    setIsOpen(true);
  };

  const confirmChangeOrganization = () => {
    setIsOpen(false);
    mutate(selectedRows);
  };

  const onCancelOrganizationChange = () => {
    setIsOpen(false);
    // setSelectedOrg(null);
    setSelectedRows(null);
  };

  return (
    <div>
      {/* {isLoading && <Loader type="screen" />} */}

      <TableHeading
        heading={t('orgManagement.org_list')}
        secondaryView={!!selectedRows}
        secondaryViewHeading={`1 ${t('orgManagement.selected_items')}`}
        secondaryViewControls={
          <Button variant="secondary" onClick={handleDeactivate}>
            {t('orgManagement.button.deactivate')}
          </Button>
        }
        style={{ marginBottom: '16px' }}
      />

      <CustomDataTable
        id="my-data-table"
        type="normal"
        columns={columns}
        data={data} // Use currentData for pagination
        onSortIconClick={handleSort}
        currentPage={paginationConfig.pageNumber}
        totalPageCount={paginationConfig.totalPages}
        pagination={true}
        handleChangePage={handleChangePage}
        totalRocords={paginationConfig.totalElements} // Corrected typo here
        recordsPerPage={paginationConfig.pageSize}
        paginationTotalRecorsMessage={t('orgManagement.results')}
        paginationRecordsPerPageMessage={t('orgManagement.per_page')}
        isAdmin={true}
        showCardView={showCardView}
        defaultExpandedCardView={true}
        noDataComponent={
          <EmptyDataTable
            isLoading={isLoading}
            error={isError ? 'Something went wrong! Please try again' : null}
            image={EmptyDataImage}
            heading={!fileteredData ? t('orgManagement.add.label') : t('errors.messages.noRecordsFound')}
            description={!fileteredData && t('orgManagement.empty_table.description')}
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
              <p>{t('orgManagement.message.DeactivateOrg')}</p>
            </div>
          ),
          modalFooter: (
            <React.Fragment>
              <Button onClick={onCancelOrganizationChange} size="md" variant="secondary">
                {t('orgManagement.button.cancel')}
              </Button>
              <Button onClick={confirmChangeOrganization} size="md">
                {t('orgManagement.button.deactivate')}
              </Button>
            </React.Fragment>
          ),
          modalSize: 'xxxs'
        }}
      />
    </div>
  );
};

export default OrgList;
