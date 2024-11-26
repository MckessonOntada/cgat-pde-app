import React from 'react';
import { Badge } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';

const getBadgeType = (isActive) => {
    if (isActive === undefined || isActive === null) return null; // Handle null or undefined
    return isActive ? 'success' : 'error'; // 'success' for green, 'error' for red
};

const getFormattedDate = (date) => new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
}).format(new Date(date));

export const createColumns = (t) => [
    {
        id: 'name',
        name: t('orgManagement.role.labelRoleName'),
        selector: (row) => (
            <Link className="MCP-table-link" to={`${row.id}/edit-role`} state={{row}}>
                {row.name}
            </Link>
        ),
        wrap: true,
        width: '34%',
    },
    {
        id: 'createAt',
        name: t('orgManagement.role.tableHeadingCreatedOn'),
        selector: (row) => (row.createdAt ? getFormattedDate(row.createdAt) : '-'),
        wrap: true,
        width: "34%",
    },
    {
        id: 'status',
        name: t('orgManagement.table.status'),
        cell: (row) => (
            row.isActive !== undefined && row.isActive !== null ? (
                <Badge
                    text={row.isActive ? 'Active' : 'Inactive'}
                    type={getBadgeType(row.isActive)}
                />
            ) : null
        ),
        wrap: true,
        center: true,
        width: "27%"
    },
];
