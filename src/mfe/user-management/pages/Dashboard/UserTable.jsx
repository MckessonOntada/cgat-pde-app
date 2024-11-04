import React, { useState, useEffect } from 'react';
import { Badge } from '@mckesson/mcp-component-library';
import { USER_DATA } from '../../mockData/UsersData';
import { useTranslation } from 'react-i18next';
import './index.scss';
import Actions from './Actions';

function UserTable() {
  const { t } = useTranslation();
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

  const handleSortClick = selectedColumn => {
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
      name: t('name'),
      selector: 'Name',
      sortable: true,
      width: '20%',
      cell: props => (
        <div className="cellEllipse">
          <a href={props.name} style={{ color: '#007bff', fontWeight: '600' }}>
            {props.name}
          </a>
        </div>
      ),
    },

    {
      name: t('email'),
      selector: 'Email',
      sortable: true,
      width: '25%',
      cell: props => <div className="cellEllipse"> {props.e_mail}</div>,
    },
    {
      name: t('role'),
      selector: 'Role',
      sortable: true,
      width: '10%',
      cell: props => <div className="cellEllipse">{props.role}</div>,
    },
    {
      name: t('status'),
      selector: 'status',
      sortable: true,
      center: true,
      width: '10%',
      cell: props => (
        <div>
          {props.status === 'ACTIVE' ? (
            <Badge text="Active" type="success" />
          ) : (
            <Badge text="Inactive" type="info-default" />
          )}
        </div>
      ),
    },
    {
      name: <div>{t('date_added')}</div>,
      selector: 'date_added',
      sortable: true,
      width: '14%',
      center: true,
      cell: props => <div>{props.date_added}</div>,
    },
    {
      name: <div className="">{t('date_updated')}</div>,
      selector: 'date_updated',
      sortable: true,
      width: '14%',
      center: true,
      cell: props => <div className="">{props.date_updated}</div>,
    },
    {
      id: 'action',
      center: true,
      name: t('action'),
      cell: Actions,
      width: '7%',
    },
  ];
  return <DataTable columns={columns} rows={filteredData} handleSortClick={handleSortClick} />;
}

export default UserTable;
