import React from 'react';
import { Badge, Tooltip } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import CommonUtils from '@src/util/CommonUtils';

const getBadgeType = (isActive) => {
  if (isActive === undefined || isActive === null) return null; // Handle null or undefined
  return isActive ? 'success' : 'error'; // 'success' for green, 'error' for red
};

export const createColumns = (t) => [
  {
    id: 'name',
    name: t('orgManagement.role.labelRoleName'),
    selector: (row) => (
      <Link className="MCP-table-link" to={`${row.id}`} state={row}>
        {row.name}
      </Link>
    ),
    wrap: true,
    sortable: true,
    sortKey: 'name',
    width: '34%'
  },
  {
    id: 'createAt',
    name: t('orgManagement.role.tableHeadingCreatedOn'),
    selector: (row) => CommonUtils.convertDateStringFormat(row.createdAt ? row.createdAt : row.updatedA, 'MM-DD-YYYY'),
    wrap: true,
    width: '34%'
  },
  {
    id: 'status',
    name: t('orgManagement.table.status'),
    cell: (row) => (row.isActive !== undefined && row.isActive !== null ? <Badge text={row.isActive ? 'Active' : 'Inactive'} type={getBadgeType(row.isActive)} /> : null),
    wrap: true,
    center: true,
    width: '22%'
  }
];
