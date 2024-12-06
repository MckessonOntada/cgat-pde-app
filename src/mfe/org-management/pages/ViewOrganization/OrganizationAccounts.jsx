import React, { useMemo } from 'react';
import { OrgAccountsProvider, useOrgAccounts } from '../../context/OrgAccountsContext';
import AccountFilters from './AccountFilters';
import AccountsList from '@src/components/Accounts/AccountsList';
import { useTranslate } from '@src/translations/useTranslation';
import { CustomDataTable, CheckboxGroup } from '@mckesson/mcp-component-library';
import { Link, Loader, redirect } from 'react-router-dom';
import Actions from '@src/components/Accounts/Action';

export default function OrganizationAccounts(props) {
  const { omitColumns = [], selectableRows, selectedRows, setSelectedRows, practiceId } = props;
  const { data, pagination, refetch, setSortCriteria, isLoading } = useOrgAccounts();
  const { t } = useTranslate();

  const handleChangePage = (e, newPage) => {
    pagination.setCurrentPage(newPage);
  };

  const handleSort = (selectedColumn, sortDirection, sortedRows) => {
    if (selectedColumn.sortKey) {
      setSortCriteria({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
    }
  };

  const columns = useMemo(() => {
    const _columns = [
      {
        id: 'id',
        name: t('account.no'),
        cell: (row) => (
          <Link to={row.url} className="MCP-table-link">
            {row.accountNumber}
          </Link>
        ),
        wrap: true,
        width: '180px'
      },
      {
        id: 'accountName',
        name: t('account.name'),
        wrap: true,
        selector: (row) => row.accountName,
        width: '280px',
        cell: (row) => <div className="cellEllipse">{row.accountName}</div>
      },
      {
        id: 'salesOrg',
        name: t('account.sales_org'),
        selector: (row) => row.salesOrg,
        width: '160px',
        wrap: true
      },
      {
        id: 'distributionChannel',
        name: t('account.distribution'),
        selector: (row) => row.distributionChannel,
        wrap: true,
        cell: (row) => <div className="cellEllipse">{row.distributionChannel}</div>,
        omit: omitColumns.includes('distributionChannel'),
        width: '220px',
        center: false
      },
      {
        id: 'address',
        name: t('account.address'),
        cell: (row) => <div className="cellEllipse">{`${row.address.houseNumber} ${row.address.street} ${row.address.street2} ${row.address.street3} ${row.address.city} ${row.address.district} ${row.address.state} ${row.address.country}  ${row.address.zipCode}`}</div>,
        omit: omitColumns.includes('address'),
        width: '280px',
      },
      {
        id: 'cgatIdentifier',
        center: true,
        name: t('account.identifier'),
        cell: (row) => <div className="cellEllipse">{row.companyCode}</div>,
        omit: omitColumns.includes('cgatIdentifier'),
        width: '240px',
      },
      {
        id: 'action',
        center: true,
        name: t('account.action'),
        cell: (row) => <Actions row={row} userId={null} practiceId={practiceId} refetch={refetch} />,
        width: '180px',
        omit: omitColumns.includes('action')
      }
    ];
    if (selectableRows && data?.content?.length > 0) {
      _columns.unshift({
        id: 'checkbox',
        name: data.content.length > 0 && (
          <CheckboxGroup
            id={'default'}
            caption=""
            items={[
              {
                onChange: (event) => {
                  if (event.target.checked) {
                    setSelectedRows(data.content);
                  } else {
                    setSelectedRows([]);
                  }
                },
                value: '',
                isChecked: data?.content?.length == selectedRows?.length
              }
            ]}
          />
        ),
        cell: (row) => (
          <CheckboxGroup
            id={'default'}
            caption=""
            items={[
              {
                onChange: (event) => {
                  let _selected;
                  if (event.target.checked) {
                    _selected = [...selectedRows];
                    _selected.push(row);
                  } else {
                    _selected = selectedRows?.filter((item) => item.id !== row.id);
                  }
                  setSelectedRows(_selected);
                },
                value: row.id,
                isChecked: selectedRows?.find((item) => item.id == row.id) ? true : false
              }
            ]}
          />
        ),
        wrap: true,
        width: '40px'
      });
    }
    return _columns;
  }, [omitColumns, data]);

  return (
    <React.Fragment>
      <div className="accounts-wrapper">
        <div className="MCP-module-body">
          <div className="MCP-panel-container">
            <div className="MCP-CardContainer">
              <AccountFilters />
            </div>
            <div className="MCP-table-wrapper">
              <AccountsList {...props} isLoading={isLoading} data={data} columns={columns} currentPage={pagination.currentPage} recordsPerPage={pagination.recordsPerPage} handleChangePage={handleChangePage} handleSort={handleSort} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
