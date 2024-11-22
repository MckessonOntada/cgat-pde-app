import React from 'react';
import { Badge } from '@mckesson/mcp-component-library';
import { RoleStatusEnum } from './Constants';
import { Link } from 'react-router-dom';


const getColorByStatus = (status) => {
    if(!status)
        return null;

    const statusColors = {
        [RoleStatusEnum.ACTIVE]: 'success',
        [RoleStatusEnum.INACTIVE]: 'error',
    };
    return statusColors[status.toLowerCase()] || 'info';
};
const getFormattedDate = (date) => new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));

export const createColumns = (t) => [
    {
        id: 'name',
        name: t('orgManagement.role.labelRoleName'),
        selector: (row) => <Link className="MCP-table-link" to={`details/${row.id}`}>{row.name}</Link>,
        wrap: true,
        width: '25%'
    },
    {
        id: 'createAt',
        name: t('orgManagement.role.tableHeadingCreatedOn'),
        selector: (row) => row.createdAt ? getFormattedDate(row.createdAt) : '-',
        wrap: true
    },
    {
        id: 'status',
        name: t('orgManagement.table.status'),
        cell: (row) => row.status ? 
            <Badge
                text={row.status}
                type={getColorByStatus(row.status)}
            />
            :
            null
        ,
        wrap: true
    }
];