import React from 'react';
import { Badge, CheckboxGroup } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import CommonUtils from '@src/util/CommonUtils';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';

const getBadgeType = (isActive) => {
  if (isActive === undefined || isActive === null) return null; // Handle null or undefined
  return isActive ? 'success' : 'error'; // 'success' for green, 'error' for red
};

export const createColumns = (t, selectedRows, setSelectedRows) => [
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
    width: '40px'
  },
  {
    id: 'name',
    name: t('orgManagement.role.labelRoleName'),
    selector: (row) => (
      <Link className="MCP-table-link" to={`${row.id}`} state={row}>
        <EclipsesTextcss str={row.name} maxWidth={420} />
      </Link>
    ),
    wrap: true,
    sortable: true,
    sortKey: 'name',
    width: '460px'
  },
  {
    id: 'createAt',
    name: t('orgManagement.role.tableHeadingCreatedOn'),
    selector: (row) => CommonUtils.convertDateStringFormat(row.createdAt ? row.createdAt : row.updatedAt, 'MM-DD-YYYY'),
    wrap: true,
    width: '460px'
  },
  {
    id: 'status',
    name: t('orgManagement.table.status'),
    cell: (row) => (row.isActive !== undefined && row.isActive !== null ? <Badge text={row.isActive ? 'Active' : 'Inactive'} type={getBadgeType(row.isActive)} /> : null),
    wrap: true,
    center: true,
    width: '280xp'
  }
];
