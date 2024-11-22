import React, { useState } from 'react';
import { CustomDataTable, Button, Badge, Loader } from '@mckesson/mcp-component-library';
import { useOrg } from '../../context/PageContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Link, useNavigate } from 'react-router-dom';
import Actions from './Actions';
import { PATHS } from '../../routes/constants';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import useSessionFeatures from '@src/common/hooks/useSessionFeatures';

const OrgList = () => {
  const { isLoading } = useOrg();
  const { t } = useTranslate();
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  const {
    organization: { setOrganization }
  } = useSessionFeatures();

  const handleClick = (org) => {
    setOrganization(org);
    navigate(PATHS.dashboard);
  };

  const columns = [
    {
      id: 'name',
      name: t('orgManagement.table.name'),
      cell: (row) => (
        <Button variant='tertiary' onClick={handleClick}>{row.name}</Button>
      ),
      wrap: true,
      width: '25%'
    },
    {
      id: 'orgId',
      name: t('orgManagement.table.id'),
      selector: (row) => row.orgId,
      wrap: true
    },
    {
      id: 'location',
      name: t('orgManagement.table.location'),
      selector: (row) => row.location,
      wrap: true
    },
    {
      id: 'date',
      name: t('orgManagement.table.dateUpdated'),
      selector: (row) => row.date,
      format: (row) => new Date(row.date).toLocaleDateString(),
      wrap: true
    },
    {
      id: 'status',
      name: t('orgManagement.table.status'),
      cell: (row) => (
        <div className="cellEllipse">
          <Badge
            text={
              row.status === 'ACTIVE'
                ? t('orgManagement.button.activate')
                : t('orgManagement.button.inactivate')
            }
            type={row.status === 'ACTIVE' ? 'success' : 'info-default'}
          />
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

  const {
    data,
    pagination: {
      currentPage,
      totalPageCount,
      totalRecords,
      recordsPerPage,
      update: { setCurrentPage }
    }
  } = useOrg();

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSort = (selectedColumn, sortDirection, sortedRows) => {
    // TODO
    console.log('Column sorted:', selectedColumn);
    console.log('Sort direction:', sortDirection);
    console.log('Sorted rows:', sortedRows);
  };

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows.map((row) => row.id));
  };

  const handleDeactivate = () => {
    setSelectedRows([]);
  };

  if (isLoading) {
    return <Loader type="screen" />;
  }

  // if (error) {
  //   return <div className="error-message">{t('orgManagement.error')}</div>;
  // }

  return (
    <div>
      {selectedRows.length > 0 && (
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
        currentPage={currentPage}
        totalPageCount={totalPageCount}
        pagination={true}
        handleChangePage={handleChangePage}
        totalRocords={totalRecords} // Corrected typo here
        recordsPerPage={recordsPerPage}
        paginationTotalRecorsMessage={t('orgManagement.results')}
        paginationRecordsPerPageMessage={t('orgManagement.per_page')}
        isAdmin={true}
        selectableRows
        noDataComponent={
          <EmptyDataTable
            image={EmptyDataImage}
            heading={t('orgManagement.add.label')}
            description={t('orgManagement.empty_table.description')}
          />
        }
        handleRowSelected={handleRowSelected}
        selectedRowId={selectedRows[0]}
      />
    </div>
  );
};

export default OrgList;
