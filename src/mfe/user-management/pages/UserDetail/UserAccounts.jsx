import React, { useMemo, useState } from 'react';
import AccountsList from '@src/components/Accounts/AccountsList';
import { useTranslate } from '@src/translations/useTranslation';
import { CheckboxGroup, InputField, Button } from '@mckesson/mcp-component-library';
import { Link, Loader, redirect } from 'react-router-dom';
import Actions from '@src/components/Accounts/Action';
import { useUserAccounts } from '../../context/UserAccountsContext';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';

export default function UserAccounts(props) {
  const { omitColumns = [], selectableRows, selectedRows, setSelectedRows, practiceId } = props;
  const { data, pagination, refetch, setSortCriteria, filters } = useUserAccounts();
  const [expandedCard, setExpandedCard] = useState(false);
  const { t } = useTranslate();
  const handleChangePage = (e, newPage) => {
    pagination.setCurrentPage(newPage);
  };

  const handleSort = (selectedColumn, sortDirection, sortedRows) => {
    if (selectedColumn.sortKey) {
      setSortCriteria({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
    }
  };

  const handleExpandCard = () => {
    setExpandedCard((prevExpandedCard) => !prevExpandedCard);
  };

  const onSearchChange = (event) => {
    filters.update.setSearchQuery(event.target.value);
  };

  const onApplyFilters = () => {
    refetch();
  };

  const columns = useMemo(() => {
    const _columns = [
      {
        id: 'id',
        name: t('account.no'),
        cell: (row) => (
          <Link to={row.url} className="account-ID">
            {row.accountNumber}
          </Link>
        ),
        wrap: true,
        width: '15%'
      },
      {
        id: 'accountName',
        name: t('account.name'),
        wrap: true,
        selector: (row) => row.accountName,
        width: '25%',
        cell: (row) => <div className="cellEllipse">{row.accountName}</div>
      },
      {
        id: 'salesOrg',
        name: t('account.sales_org'),
        selector: (row) => row.salesOrg,
        wrap: true
      },
      {
        id: 'distributionChannel',
        name: t('account.distribution'),
        selector: (row) => row.distributionChannel,
        wrap: true,
        cell: (row) => <div className="cellEllipse">{row.distributionChannel}</div>,
        omit: omitColumns.includes('distributionChannel'),
        center: false
      },
      {
        id: 'address',
        name: t('account.address'),
        cell: (row) => <div className="cellEllipse">{`${row.address.houseNumber} ${row.address.street} ${row.address.street2} ${row.address.street3} ${row.address.city} ${row.address.district} ${row.address.state} ${row.address.country}  ${row.address.zipCode}`}</div>,
        omit: omitColumns.includes('address')
      },
      {
        id: 'cgatIdentifier',
        center: true,
        name: t('account.identifier'),
        cell: (row) => <div className="cellEllipse">{row.companyCode}</div>,
        omit: omitColumns.includes('cgatIdentifier')
      },
      {
        id: 'action',
        center: true,
        name: t('account.action'),
        cell: (row) => <Actions row={row} userId={null} practiceId={practiceId} refetch={refetch} />,
        width: '10%',
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
        width: '4%'
      });
    }
    return _columns;
  }, [omitColumns, data]);

  return (
    <React.Fragment>
      <div className="filterBox line-height">
        <div className="toggle-container">
          <div className="toggle-box">
            <div onClick={handleExpandCard}>
              <img src={expandedCard ? arrow_down : arrow_right} className="icon-align" alt="toggle-icon" />
            </div>
            <div className="autoSuggestSearch-container">
              <InputField errors={{}} id="search-box" name="firstName" value={filters.searchQuery} onInputChange={onSearchChange} tooltipText={null} useRegister={false} placeholder={''} />
            </div>
          </div>
          {<Button type="button" variant="secondary" label={'Apply Filter'} className="filter-btn" onClick={onApplyFilters} size="md" />}
        </div>
      </div>
      <AccountsList {...props} data={data} columns={columns} currentPage={pagination.currentPage} recordsPerPage={pagination.recordsPerPage} handleChangePage={handleChangePage} handleSort={handleSort} />
    </React.Fragment>
  );
}
