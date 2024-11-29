import React, { useState } from 'react';
import { CustomDataTable, Button, Badge, Loader, CheckboxGroup } from '@mckesson/mcp-component-library';
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

function UserTable({ selectableRows = false }) {
  // Move pagination to context
  const { t } = useTranslate();
  const [selectedRows, setSelectedRows] = useState(null);

  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const {
    isLoading,
    isError,
    data,
    activeTab,
    pagination: {
      currentPage,
      totalPageCount,
      totalRecords,
      recordsPerPage,
      update: { setCurrentPage }
    },
    refetchUsersData
  } = useUser();

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const { mutate } = useMutation(async (userId) => {
    const res = await HttpResourceService.callRest(`${ApiRoutes.USERS()}/${userId}?${serializeParams(requestParams)}`, httpVerb.DELETE, null);
    return res.data;
  });

  const handleDeactivate = () => {
    mutate(selectedRows, {
      onSuccess: (response) => {
        console.log(`User ${selectedRows} deactivated successfully:`, response);
        refetchUsersData();
        setSelectedRows(null);
      },
      onError: (error) => {
        console.error(`Failed to deactivate user ${selectedRows}:`, error);
      }
    });
  };

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage);
  };

  const columns = [
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
      width: '3%',
      omit: activeTab === 'PENDING REQUESTS'
    },
    { name: 'ID', selector: 'id', sortable: true, omit: true },
    {
      id: 'name',
      name: t('userManagement.table.name'),
      selector: (row) => `${row.name.firstName} ${row.name.lastName}`,
      sortable: true,
      wrap: true,
      cell: (props) => (
        <div className="cellEllipses">
          {activeTab === 'PENDING REQUESTS' ? (
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
      cell: (props) => <div className="cellEllipses">{props.contact.email}</div>
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
          <Badge text={props.role?.name} type={getbgColorOnRole(props.role?.name)} />
        </span>
      ),
      omit: isSystemAdminView || activeTab === 'PENDING REQUESTS'
    },
    {
      id: 'status',
      name: t('userManagement.table.status'),
      selector: 'status',
      sortable: true,
      center: true,
      cell: (props) => <div>{activeTab === 'PENDING REQUESTS' ? <Badge text="Pending" type="info-default" /> : props.isActive ? <Badge text="Active" type="success" /> : <Badge text="Inactive" type="info-default" />}</div>
    },
    {
      id: 'dataAdded',
      name: t('userManagement.table.dateAdded'),
      selector: 'date_added',
      sortable: true,
      wrap: true,
      cell: (props) => (props.updatedAt ? CommonUtils.convertDateStringFormat(data.updatedAt, 'MM-DD-YYYY') : props.createdAt ? CommonUtils.convertDateStringFormat(data.createdAt, 'MM-DD-YYYY') : 'N/A')
    },
    {
      id: 'action',
      center: true,
      name: t('userManagement.table.action'),
      cell: (row) => <Actions row={row} showEditButton={activeTab === 'PENDING REQUESTS'} showViewButton={activeTab !== 'PENDING REQUESTS'} />,
      omit: isSystemAdminView
    }
  ];

  return (
    <div>
      {isLoading && <Loader type={'screen'} />}
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
        onSortIconClick={(value) => console.log(value)}
        handleChangePage={handleChangePage}
        selectableRowsHeader={false}
        currentPage={currentPage}
        totalPageCount={totalPageCount}
        totalRocords={totalRecords}
        recordsPerPage={recordsPerPage}
        paginationTotalRecorsMessage={t('userManagement.results')}
        paginationRecordsPerPageMessage={t('userManagement.per_page')}
        stickyHeader
        responsive
        pagination={true}
        noDataComponent={isError ? <div>Something went wrong! Please try again</div> : <EmptyDataTable image={EmptyDataImage} heading={t('userManagement.add.label')} description={t('userManagement.empty_table.description')} />}
      />
    </div>
  );
}

export default UserTable;
