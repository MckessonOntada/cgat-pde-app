import { Badge, Button, CheckboxGroup, CustomDataTable, Modal } from '@mckesson/mcp-component-library';
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

const OrgList = () => {
  const { t } = useTranslate();
  const [selectedRows, setSelectedRows] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { data, paginationConfig, isLoading, isError, refreshData, setPageNumber, applySort } = useOrg();
  const dispatch = useDispatch();
  const location = (address) => {
    return `${address.address1 || ''}, ${address.city || ''}, ${address.state || ''}, ${address.pin || ''}`;
  };

  const handleDeActivateOrg = async (orgId) => {
    const res = await HttpResourceService.callRest(`${ApiRoutes.PUBLIC_ORGANIZATIONS}/${orgId}`, httpVerb.DELETE);

    if (![201, 200].includes(res.status)) {
      throw new Error('Failed to create user');
    }
    return res;
  };

  const { mutate } = useMutation({
    mutationFn: handleDeActivateOrg,
    onError: () => {},
    onSuccess: async () => {
      setSelectedRows(null);
      await refreshData();
    }
  });

  const {
    organization: { setOrganization }
  } = useSessionFeatures();

  const handleClick = (e, org) => {
    e.preventDefault();

    const state = {};
    state.title = t('orgManagement.message.accountSelectionConfirmationTitle');
    state.body = <h3>{t('orgManagement.message.accountSelectionConfirmationDescription')}</h3>;
    state.footer = (
      <div className="controls">
        <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
          Cancel
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            setOrganization(org);
            dispatch(closeModal());
            window.location.href = PATHS.dashboard;
          }}>
          Okay
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
      width: '40px'
    },
    {
      id: 'name',
      name: t('orgManagement.table.name'),
      cell: (row) => (
        <div>
          <Link
            variant="tertiary"
            className="MCP-table-link"
            onClick={(e) => {
              handleClick(e, row);
            }}>
            <EclipsesTextcss str={row.name} maxWidth={240} />
          </Link>
        </div>
      ),
      sortable: true,
      sortKey: 'name',
      minWidth: '280px',
      wrap: true
    },
    {
      id: 'orgId',
      name: t('orgManagement.table.id'),
      selector: (row) => row.id,
      sortable: true,
      sortKey: 'id',
      width: '180px',
      wrap: true
    },
    {
      id: 'location',
      name: t('orgManagement.table.location'),
      cell: (row) => (
        <div>
          <EclipsesTextcss str={location(row.address)} maxWidth={240} />
        </div>
      ),
      sortable: true,
      sortKey: 'id',
      minWidth: '280px',
      wrap: true
    },
    {
      id: 'date',
      name: t('orgManagement.table.dateUpdated'),
      selector: (row) => row.updatedAt,
      cell: (row) =>
        row.updatedAt
          ? CommonUtils.convertDateStringFormat(row.updatedAt, 'MM-DD-YYYY')
          : row.createdAt
          ? CommonUtils.convertDateStringFormat(row.createdAt, 'MM-DD-YYYY')
          : 'N/A',
      width: '180px',
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
      width: '200px',
      wrap: true,
      center: true
    },
    {
      id: 'action',
      name: t('orgManagement.table.action'),
      cell: (row) => <Actions row={row} />, // Pass row as a named prop
      width: '180px',
      wrap: true,
      center: true
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
    // setSelectedRows([]);
    // mutate(selectedRows);
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
      {selectedRows && (
        <div className="selected-item-alert">
          <p className="selected-item-text">
            {1} {t('orgManagement.selected_items')}
          </p>
          <Button variant="secondary" onClick={handleDeactivate}>
            {t('orgManagement.button.deactivate')}
          </Button>
        </div>
      )}

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
        noDataComponent={
          <EmptyDataTable
            isLoading={isLoading}
            error={isError ? 'Something went wrong! Please try again' : null}
            image={EmptyDataImage}
            heading={t('orgManagement.add.label')}
            description={t('orgManagement.empty_table.description')}
          />
        }
      />
      <Modal
        {...{
          id: 'xxxs-modal',
          isOpen,
          onClose: () => setIsOpen(false),
          modalTitle: 'Confirmation message',
          modalBody: <h3>Are you sure you wish to Deactivate this Organization ?</h3>,
          modalFooter: (
            <React.Fragment>
              <Button onClick={onCancelOrganizationChange} size="sm" variant="secondary">
                {t('orgManagement.button.cancel')}
              </Button>
              <Button onClick={confirmChangeOrganization} size="sm">
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
