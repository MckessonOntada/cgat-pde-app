import React from 'react';
import { MenuList } from '@mckesson/mcp-component-library';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import CommonUtils from '@src/util/CommonUtils';

export const createColumns = (t, handleOnOptionSelection) => [
  {
    id: 'fullName',
    name: 'Name',
    selector: () => {},
    sortable: true,
    sortKey: 'fullName',
    minWidth: '300px',
    maxWidth: '386px',
    cell: (row) => <EclipsesTextcss str={CommonUtils.getFullName(row) || '-'} maxWidth={354} className="MCP-table-cell" />
  },
  {
    id: 'email',
    name: 'Email',
    selector: () => {},
    sortable: false,
    minWidth: '350px',
    maxWidth: '486px',
    cell: (row) => <EclipsesTextcss str={row.email || '-'} maxWidth={454} className="MCP-table-cell" />
  },
  {
    id: 'lastUpdatedDate',
    name: 'Updated Date',
    selector: () => {},
    sortable: true,
    sortKey: 'lastUpdatedDate',
    width: '233px',
    cell: (props) => (
      <div>
        <EclipsesTextcss str={CommonUtils.convertDateStringFormat(props.lastUpdatedDate)} maxWidth={201} />
      </div>
    )
  },
  {
    id: 'action',
    name: 'Action(s)',
    center: true,
    width: '159px',
    isAction: true,
    cell: (row) => {
      const options = [
        {
          label: 'Edit',
          value: 'edit'
        },
        {
          label: 'Delete',
          value: 'delete'
        }
      ];

      return (
        <MenuList
          menuIcon={<IconEllipsis key={`menu-list-${row.id}`} />}
          handleSelect={(value) => handleOnOptionSelection(value, row)}
          options={options}
          aria-label="Action options"
          size="md"
        />
      );
    }
  }
];
