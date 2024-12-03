import { Badge, Button, CheckboxGroup, CustomDataTable, Loader, Modal } from '@mckesson/mcp-component-library';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import useSessionFeatures from '@src/hooks/useSessionFeatures';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useOrg } from '../../context/OrgContext';
import { PATHS } from '../../routes/constants';
import Actions from './Actions';

const OrgList = () => {
  const { t } = useTranslate();
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { data, paginationConfig, isLoading, isError, refreshData, setPageNumber, applySort } = useOrg();

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

  const handleClick = (org) => {
    setOrganization(org);
    window.location.href = PATHS.dashboard;
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
              isChecked: selectedRows === row.id
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
        <div className="cellEllipse">
          <Link
            variant="tertiary"
            className="MCP-table-link"
            onClick={() => {
              handleClick(row);
            }}>
            {row.name}
          </Link>
        </div>
      ),
      sortable: true,
      sortKey: 'name',
      wrap: true
    },
    {
      id: 'orgId',
      name: t('orgManagement.table.id'),
      selector: (row) => row.id,
      sortable: true,
      sortKey: 'id',
      wrap: true
    },
    {
      id: 'location',
      name: t('orgManagement.table.location'),
      cell: (row) => <div className="cellEllipse">{location(row.address)}</div>,
      sortable: true,
      sortKey: 'id',
      wrap: true
    },
    {
      id: 'date',
      name: t('orgManagement.table.dateUpdated'),
      selector: (row) => row.updatedAt,
      cell: (row) => (row.updatedAt ? CommonUtils.convertDateStringFormat(row.updatedAt, 'MM-DD-YYYY') : row.createdAt ? CommonUtils.convertDateStringFormat(row.createdAt, 'MM-DD-YYYY') : 'N/A'),
      wrap: true
    },
    {
      id: 'status',
      name: t('orgManagement.table.status'),
      cell: (row) => (
        <div className="cellEllipse">
          <Badge text={row.status === 'ACTIVE' ? t('orgManagement.button.activate') : t('orgManagement.button.inactivate')} type={row.status === 'ACTIVE' ? 'success' : 'info-default'} />
        </div>
      ),
      wrap: true,
      center: true
    },
    {
      id: 'action',
      name: t('orgManagement.table.action'),
      cell: (row) => <Actions row={row} />, // Pass row as a named prop
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
      {isLoading && <Loader type="screen" />}
      {selectedRows && selectedRows.length === 1 && (
        <div className="selected-item-alert">
          <p className="selected-item-text">
            {selectedRows.length} {t('orgManagement.selected_items')}
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
        // selectableRows
        noDataComponent={isError ? <div>Something went wrong! Please try again</div> : <EmptyDataTable image={EmptyDataImage} heading={t('orgManagement.add.label')} description={t('orgManagement.empty_table.description')} />}
        // handleRowSelected={handleRowSelected}
        // selectedRowId={selectedRows[0]}
      />
      <Modal
        {...{
          id: 'xxxs-modal',
          isOpen,
          onClose: () => setIsOpen(false),
          modalTitle: 'Confirmation message',
          modalBody: <div>Are you sure you wish to Deactivate this Organization ?</div>,
          modalFooter: (
            <React.Fragment>
              <Button onClick={onCancelOrganizationChange}>Cancel</Button>
              <Button onClick={confirmChangeOrganization}>Deactivate</Button>
            </React.Fragment>
          ),
          modalSize: 'xxxs'
        }}
      />
    </div>
  );
};

export default OrgList;
