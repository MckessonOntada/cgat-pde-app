import React ,{ useState } from 'react'; 
import { CustomDataTable,Button,Badge, Loader } from '@mckesson/mcp-component-library';
import './index.scss';
import Actions from './Actions';
import { useTranslate } from '@src/translations/useTranslation';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useQuery, useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/common/util/ApiUtils';
import AuthUtils from '@src/common/util/AuthUtils';


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
  const [selectedRows, setSelectedRows] = useState([]);
  
  const {
    isLoading,
    isError,
    data,
    pagination: { currentPage, totalPageCount, totalRecords, recordsPerPage, 
      update: { setCurrentPage } }
  } = useUser();

  const handleRowSelected = ({ selectedRows }) => {
    // setSelectedRows(selectedRows.map((row) => row.id));
    setSelectedRows(selectedRows);
  };

  const requestParams = {
		userType: AuthUtils.isSystemAdminView() ? 'ADMIN' : 'GENERAL'
	};
  

  const { mutate } = useMutation(async (userId) => {
    const res = await HttpResourceService.callRest(
      `${ApiRoutes.USERS()}/${userId}?${serializeParams(requestParams)}`,
      httpVerb.DELETE,
      null
    );
    return res.data;
  });

  const handleDeactivate = () => {
    const ids = selectedRows.map(row => row.id);  
    Promise.all(
      ids.map((userId) =>
        mutate(userId, {
          onSuccess: (response) => {
            console.log(`User ${userId} deactivated successfully:`, response);
          },
          onError: (error) => {
            console.error(`Failed to deactivate user ${userId}:`, error);
          },
        })
      )
    ).then(() => {
      // Refetch data after all users are deactivated
      refetch();
    });
  };

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage);
  };

  const allInactive = selectedRows.every(row => !row.isActive);
  const buttonLabel = allInactive
  ? t('userManagement.button.activate')
  : t('userManagement.button.deactivate');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB').replace(/\//g, '-');
  };

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
          <Badge text={props.role?.name} type={getbgColorOnRole(props.role?.name)} />
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
      cell: (props) => formatDate(props.createdAt) 
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
      {selectedRows.length > 0 && (
        <div className="selected-item-alert">
          <p className="selected-item-text">
            {selectedRows.length} {t('userManagement.selected_items')}
          </p>
          <Button variant="secondary" onClick={handleDeactivate}>
          {buttonLabel}
          </Button>
        </div>
      )}

      <CustomDataTable
        type={'normal'}
        columns={columns}
        data={data}
        onSortIconClick={(value) => console.log(value)}
        handleChangePage={handleChangePage}
        selectableRows={selectableRows}
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
        handleRowSelected={handleRowSelected}
        selectedRowId={selectedRows[0]}
        noDataComponent={
          isError ? (
            <div>Something went wrong! Please try again</div>
          ) : (
            <EmptyDataTable
              image={EmptyDataImage}
              heading={t('orgManagement.add.label')}
              description={t('orgManagement.empty_table.description')}
            />
          )
        }
      />
    </div>
  );
}

export default UserTable;
