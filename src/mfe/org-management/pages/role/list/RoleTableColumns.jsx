import React from 'react';
import { Badge } from '@mckesson/mcp-component-library';
import { RoleStatusEnum } from './Constants';


const getColorByStatus = (status) => {
    if(status)
        return null;

    const statusColors = {
        [RoleStatusEnum.ACTIVE]: 'success',
        [RoleStatusEnum.INACTIVE]: 'error',
    };
    return statusColors[status.toLowerCase()] || 'info';
};

export const createColumns = (t) => [
    {
        id: 'name',
        name: t('orgManagement.role.labelRoleName'),
        selector: (row) => row.name,
        wrap: true,
        width: '25%'
    },
    {
        id: 'createAt',
        name: t('orgManagement.role.tableHeadingCreatedOn'),
        selector: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-',
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