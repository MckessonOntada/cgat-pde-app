import React from 'react';
import { MenuList } from '@mckesson/mcp-component-library';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import CommonUtils from '@src/util/CommonUtils';
import { RECIPIENT_ACTION_OPTIONS } from '../constants';

export const createColumns = (t, handleOnOptionSelection, isActionsDisabled = false) => [
  {
    id: 'fullName',
    name: t('manageMaterial.notificationSettings.table.column.name'),
    selector: () => {},
    sortable: true,
    sortKey: 'fullName',
    minWidth: '300px',
    maxWidth: '386px',
    cell: (row) => <EclipsesTextcss str={CommonUtils.getFullName(row) || '-'} maxWidth={354} className="MCP-table-cell" />
  },
  {
    id: 'email',
    name: t('manageMaterial.notificationSettings.table.column.email'),
    selector: () => {},
    sortable: false,
    minWidth: '350px',
    maxWidth: '486px',
    cell: (row) => <EclipsesTextcss str={row.email || '-'} maxWidth={454} className="MCP-table-cell" />
  },
  {
    id: 'lastUpdatedDate',
    name: t('manageMaterial.notificationSettings.table.column.updatedDate'),
    selector: () => {},
    sortable: true,
    sortKey: 'lastUpdatedDate',
    minWidth: '200px',
    cell: (props) => (
      <div>
        <EclipsesTextcss str={CommonUtils.convertDateStringFormat(props.lastUpdatedDate)} maxWidth={201} />
      </div>
    )
  },
  {
    id: 'action',
    name: t('manageMaterial.notificationSettings.table.column.actions'),
    width: '150px',
    isAction: true,
    cell: (row) => {
      return (
        <MenuList
          menuIcon={
            <IconEllipsis
              key={`menu-list-${row.id}`}
              style={{
                opacity: isActionsDisabled ? 0.4 : 1,
                pointerEvents: isActionsDisabled ? 'none' : 'auto'
              }}
            />
          }
          handleSelect={(value) => handleOnOptionSelection(value, row)}
          options={RECIPIENT_ACTION_OPTIONS}
          aria-label="Action options"
          size="md"
          isDisabled={isActionsDisabled}
        />
      );
    }
  }
];
