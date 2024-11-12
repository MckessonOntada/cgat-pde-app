import React, { useState, useEffect } from 'react';
import DataTable from '@src/components/dataTable/DataTable';
import { Badge } from '@mckesson/mcp-component-library';
import { USER_DATA } from '../../mockData/UsersData';
import './index.scss';
import Actions from './Actions';
import { useTranslate } from '@src/translations/useTranslation';

function UserTable() {
  const { t } = useTranslate();
  const [data] = useState(USER_DATA);
  const [filteredData, setFilteredData] = useState(USER_DATA);
  const [sortColumn, setSortColumn] = useState('date_updated');
  const [sortDirection, setSortDirection] = useState('desc');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const sortedData = [...USER_DATA].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    });
    setFilteredData(sortedData);
  }, []);

  const handleSortClick = (selectedColumn) => {
    const columnName = selectedColumn.selector;
    const newSortDirection = sortColumn === columnName && sortDirection === 'asc' ? 'desc' : 'asc';
    const sortedData = [...filteredData].sort((a, b) => {
      if (newSortDirection === 'asc') {
        return a[columnName] > b[columnName] ? 1 : -1;
      } else {
        return a[columnName] < b[columnName] ? 1 : -1;
      }
    });
    setSortColumn(columnName);
    setSortDirection(newSortDirection);
    setFilteredData(sortedData);
  };

  const columns = [
    { name: 'ID', selector: 'id', sortable: true, omit: true },
    {
      name: t('userManagement.table.name'),
      selector: row => `${row.name.firstName} ${row.name.lastName}`,
      sortable: true,
      wrap: true,
      // width:'20%',
      cell: (props) => (
        <div className="cellEllipse"> 
        <a  href={`/${props.name.firstName}-${props.name.lastName}`} style={{ color: '#007bff', fontWeight: '600' }}>
        {`${props.name.firstName} ${props.name.lastName}`}
        </a>
      </div>
      )
    },
    {
      name: t('userManagement.table.email'),
      selector:  row =>row.contact.e_mail,
      sortable: true,
      wrap: true,
      width: '20%',
      cell: (props) => <div className="cellEllipse">{props.contact.e_mail}</div>
    },
    {
      name: t('userManagement.table.role'),
      selector:  row =>row.contact.role.name,
      sortable: true, 
      wrap: true,
      cell: (props) => <div className="cellEllipse">{props.role.name}</div>
    },
    {
      name: t('userManagement.table.status'),
      selector: 'status',
      sortable: true,
      center: true,
      cell: (props) => (
        <div>
          {props.isActive ? (
            <Badge text="Active" type="success" />
          ) : (
            <Badge text="Inactive" type="info-default" />
          )}
        </div>
      )
    },
    {
      name: t('userManagement.table.dateAdded'),
      selector: 'date_added',
      sortable: true,
      center: true,
      wrap: true,
      cell: (props) => <div>{props.date_added}</div>
    },
    {
      name: t('userManagement.table.dateUpdated'),
      selector: 'date_updated',
      sortable: true,
      center: true,
      wrap: true,
      cell: (props) => <div>{props.date_updated}</div>
    },
    {
      id: 'action',
      center: true,
      name: t('userManagement.table.action'),
      cell: (row) => <Actions status={row.status} row={row} />,  
      width: '10%',
    }
  ];

  return (
    <DataTable columns={columns} rows={filteredData} handleSortClick={handleSortClick} responsive />
  );
}

export default UserTable;
