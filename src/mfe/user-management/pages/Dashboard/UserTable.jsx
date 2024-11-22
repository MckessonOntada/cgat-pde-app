import React from 'react';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import { Badge, Loader } from '@mckesson/mcp-component-library';
import './index.scss';
import Actions from './Actions';
import { useTranslate } from '@src/translations/useTranslation';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

function getbgColorOnRole(Role) {
  switch (Role) {
    case 'ORGANIZATION ADMIN':
      return 'success';
    case 'ORGANIZATION USER':
      return 'primary';
    default:
      return 'info';
  }
}

function UserTable({ isPendingRequest = false, selectableRows = false, omitColumns = [] }) {
  // Move pagination to context
  const { t } = useTranslate();

  const {
    isLoading,
    isError,
    data,
    pagination: { currentPage, totalPageCount, totalRecords, recordsPerPage, onPageChange }
  } = useUser();

  const columns = [
    { name: 'ID', selector: 'id', sortable: true, omit: true },
    {
      id: 'name',
      name: t('userManagement.table.name'),
      selector: (row) => `${row.name.firstName} ${row.name.lastName}`,
      sortable: true,
      wrap: true,
      cell: (props) => (
        <div className="cellEllipse">
          {isPendingRequest ? (
            `${props.name.lastName}, ${props.name.firstName} ${props.name.middleName}`
          ) : (
            <Link
              to={`${props.id}`} // dynamically constructs the URL with userId
              style={{ color: '#007bff', fontWeight: '600' }}>
              {`${props.name.lastName}, ${props.name.firstName} ${props.name.middleName}`}
            </Link>
          )}
        </div>
      )
    },
    {
      id: 'email',
      name: t('userManagement.table.email'),
      selector: (row) => row.contact.email,
      sortable: true,
      wrap: true,
      width: '20%',
      cell: (props) => <div className="cellEllipse">{props.contact.email}</div>
    },
    {
      id: 'role',
      name: t('userManagement.table.role'),
      selector: (row) => row.contact.role.name || '',
      sortable: true,
      center: true,
      wrap: true,
      cell: (props) => (
        <span>
          <Badge text={props.role.name} type={getbgColorOnRole(props.role.name)} />
        </span>
      ),
      omit: omitColumns.includes('role')
    },
    {
      id: 'status',
      name: t('userManagement.table.status'),
      selector: 'status',
      sortable: true,
      center: true,
      cell: (props) => (
        <div>
          {isPendingRequest ? (
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
      selector: 'date_added',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{props.updatedAt || props.createdAt}</div>
    },
    {
      id: 'action',
      center: true,
      name: t('userManagement.table.action'),
      cell: (row) =>
        isPendingRequest ? (
          <Actions row={row} showEditButton={true} />
        ) : (
          <Actions row={row} showViewButton={true} />
        )
    }
  ];

  return (
    <div>
      {isLoading && <Loader type={'screen'} />}

      <CustomDataTable
        type={'normal'}
        columns={columns}
        data={data}
        onSortIconClick={(value) => console.log(value)}
        handleChangePage={(e, newPage) => onPageChange(newPage)}
        selectableRows={selectableRows}
        currentPage={currentPage}
        totalPageCount={totalPageCount}
        totalRocords={totalRecords}
        recordsPerPage={recordsPerPage}
        paginationRecordsPerPageMessage={t('userManagement.results')}
        paginationTotalRecordsMessage={'userManagement.results'}
        stickyHeader
        responsive
        pagination
      />
    </div>
  );
}

export default UserTable;
