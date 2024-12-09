import React, { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CustomDataTable, CheckboxGroup } from '@mckesson/mcp-component-library';
import SelectedAccounts from './SelectedAccounts';
import './styles.scss';
import { useTranslate } from '@src/translations/useTranslation';
import SelectedAccountChips from './SelectedAccountChips';
import EmptyDataTable from '../EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { useAccounts } from './AccountsContext';
import Actions from './Action';

export default function AccountsList(props) {
  const {
    selectedRows,
    setSelectedRows,
    showSelectedAccounts = false, // This is to show selected accounts in right rail
    isLoading = false,
    omitColumns = [],
    practiceId,
    userId
  } = props;
  const { data, paginationConfig, refetch } = useAccounts();
  const { t } = useTranslate();

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
        minWidth: '280px',
        maxWidth: '360px',
        cell: (row) => (
          <div>
            <EclipsesTextcss str={row.accountName} maxWidth={240} />
          </div>
        )
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
        minWidth: '280px',
        center: false
      },
      {
        id: 'address',
        name: t('account.address'),
        cell: (row) => (
          <div>
            <EclipsesTextcss str={`${row.address.houseNumber} ${row.address.street} ${row.address.street2} ${row.address.street3} ${row.address.city} ${row.address.district} ${row.address.state} ${row.address.country}  ${row.address.zipCode}`} maxWidth={320} />
          </div>
        ),
        omit: omitColumns.includes('address'),
        minWidth: '280px'
      },
      {
        id: 'cgatIdentifier',
        center: true,
        name: t('account.identifier'),
        cell: (row) => <div className="cellEllipse">{row.companyCode}</div>,
        omit: omitColumns.includes('cgatIdentifier'),
        width: '240px'
      },
      {
        id: 'action',
        center: true,
        name: t('account.action'),
        cell: (row) => <Actions row={row} userId={userId} practiceId={practiceId} refetch={refetch} />,
        width: '180px',
        omit: omitColumns.includes('action')
      }
    ];
    if (showSelectedAccounts) {
      _columns.unshift({
        id: 'checkbox',
        cell: (row) => (
          <CheckboxGroup
            id={'default'}
            caption=""
            items={[
              {
                onChange: (event) => {
                  if (event.target.checked) {
                    setSelectedRows([...selectedRows, row]);
                  } else {
                    setSelectedRows(selectedRows.filter((item) => item.id !== row.id));
                  }
                },
                value: '',
                isChecked: !!selectedRows.filter((item) => item.id === row.id).length
              }
            ]}
          />
        ),
        wrap: true,
        width: '40px'
      });
    }
    return _columns;
  }, [omitColumns]);

  const onRemoveSelectedAccount = useCallback(
    (item) => {
      setSelectedRows(selectedRows.filter((account) => account.id !== item.id));
    },
    [selectedRows]
  );
  return (
    <>
      {/* {true && <Loader type={'screen'} />} */}
      {showSelectedAccounts && (
        <div className="selected-account-chips">
          <SelectedAccountChips selectedAccounts={selectedRows} onRemoveAccount={onRemoveSelectedAccount} />
        </div>
      )}
      <div className="account-box">
        <div className="customTable-box">
          <CustomDataTable
            id="my-data-table"
            type="normal"
            columns={columns}
            data={data || []}
            currentPage={paginationConfig?.pageNumber}
            totalPageCount={paginationConfig?.totalPages}
            pagination={true}
            handleChangePage={props.handleChangePage}
            totalRocords={paginationConfig?.totalElements}
            recordsPerPage={paginationConfig?.pageSize}
            paginationTotalRecorsMessage={t('orgManagement.results')}
            paginationRecordsPerPageMessage={t('orgManagement.per_page')}
            isAdmin={true}
            onSortIconClick={props.handleSort}
            noDataComponent={<EmptyDataTable isLoading={isLoading} image={EmptyDataImage} heading={t('account.add.label')} description={t('account.empty_table.description')} />}
          />
        </div>
        {showSelectedAccounts && (
          <div className="selected-account-box">
            <SelectedAccounts selectedAccounts={selectedRows} onRemoveAccount={onRemoveSelectedAccount} />
          </div>
        )}
      </div>
    </>
  );
}
