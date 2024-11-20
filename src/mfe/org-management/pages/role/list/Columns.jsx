import React from 'react';
import { Badge } from '@mckesson/mcp-component-library';
import { RoleStatusEnum } from './Constants';


const getColorByStatus = (status) => {
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
        selector: (row) => row.roleName,
        wrap: true,
        width: '25%'
    },
    {
        id: 'createOn',
        name: t('orgManagement.role.tableHeadingCreatedOn'),
        selector: (row) => row.createdOn,
        wrap: true
    },
    {
        id: 'status',
        name: t('orgManagement.table.status'),
        cell: (row) => (
            <Badge
                text={row.status}
                type={getColorByStatus(row.status)}
            />
        ),
        wrap: true
    }
];