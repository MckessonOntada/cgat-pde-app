import React, { useState } from 'react';
import { CustomDataTable, Button, Badge, Loader } from '@mckesson/mcp-component-library';
import { useOrg } from '../../context/PageContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Link } from 'react-router-dom';
import Actions from './Actions';
import { PATHS } from '../../routes/constants';
import { useOrganizationQuery } from '../../slices/Organization';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTAble';

const OrgList = () => {
  const { isLoading, orgData, error } = useOrganizationQuery();

  const { t } = useTranslate();
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      id: 'name',
      name: t('orgManagement.table.name'),
      cell: (row) => (
        <Link to={PATHS.viewOrg.replace(':orgId', row.id)} className="org-name">
          {row.name}
        </Link>
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
        <Badge
          text={row.status === 'ACTIVE' ? 'Active' : 'Inactive'}
          type={row.status === 'ACTIVE' ? 'success' : 'info-default'}
        />
      ),
      wrap: true
    },
    {
      id: 'action',
      name: t('orgManagement.table.action'),
      cell: (row) => <Actions row={row} />, // Pass row as a named prop
      wrap: true
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
  console.log('Data:', data);
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

  const NoDataInfo = {
    heading: 'Add Organization',
    description: 'You need to add Organization to see data in this table.'
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
          <p className="selected-item-text">{selectedRows.length} Item's Selected</p>
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
        paginationTotalRecorsMessage={'results'}
        paginationRecordsPerPageMessage={`per page`}
        isAdmin={true}
        selectableRows
        noDataComponent={
          <EmptyDataTable
            image={EmptyDataImage}
            heading={'Add Organization'}
            description={'You need to add Organization to see data in this table.'}
          />
        }
        handleRowSelected={handleRowSelected}
        selectedRowId={selectedRows[0]}
      />
    </div>
  );
};

export default OrgList;
