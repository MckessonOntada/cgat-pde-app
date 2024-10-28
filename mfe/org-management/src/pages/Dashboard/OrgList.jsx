import React from 'react';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import { useOrg } from '../../context/PageContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Actions from './Actions';
import { Badge } from '@mckesson/mcp-component-library';

const OrgList = () => {
  const { t } = useTranslation();

  const onEditClick = () => {
    // TODO: On edit
  };

  const columns = [
    {
      id: 'name',
      name: t('organization_name'),
      cell: row => <Link to={row.url}>{row.name}</Link>,
      width: '25%',
    },
    {
      id: 'location',
      name: t('location'),
      selector: row => row.location,
      width: '15%',
    },
    {
      id: 'orgId',
      name: t('organization_id'),
      selector: row => row.orgId,
      width: '15%',
    },
    {
      id: 'status',
      name: t('status'),
      cell: row => (
        <Badge
          text={row.status === 'ACTIVE' ? 'Active' : 'Inactive'}
          type={row.status === 'ACTIVE' ? 'success' : 'info-default'}
        />
      ),
      width: '15%',
    },
    {
      id: 'date',
      name: t('date_added_update'),
      selector: row => row.date,
      format: row => new Date(row.date).toLocaleDateString(),
    },
    {
      id: 'action',
      name: t('action'),
      cell: props => <Actions {...props} onEditClick={onEditClick} />,
      width: '15%',
    },
  ];

  const {
    data,
    pagination: {
      currentPage,
      totalPageCount,
      totalRecords,
      recordsPerPage,
      update: { setCurrentPage },
    },
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

  return (
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
      totalRocords={totalRecords}
      recordsPerPage={recordsPerPage}
      paginationTotalRecorsMessage={`Total records: ${totalRecords}`}
      paginationRecordsPerPageMessage={`Records per page: ${recordsPerPage}`}
      isAdmin={true}
    />
  );
};

export default OrgList;
