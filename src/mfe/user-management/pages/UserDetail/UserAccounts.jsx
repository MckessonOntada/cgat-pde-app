import React, { useMemo, useState } from 'react';
import AccountsList from '@src/components/Accounts/AccountsList';
import { useTranslate } from '@src/translations/useTranslation';
import { CheckboxGroup, InputField, Button, Divider, AutoSuggestDropdown } from '@mckesson/mcp-component-library';
import { Link, Loader, redirect } from 'react-router-dom';
import Actions from '@src/components/Accounts/Action';
import { useUserAccounts } from '../../context/UserAccountsContext';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import CommonUtils from '@src/util/CommonUtils';

const salesOrgOptions = [
  { label: 'so36', value: 'so36' },
  { label: 'so37', value: 'so37' },
  { label: 'so38', value: 'so38' }
];
const distributionChannelOptions = [{ label: 'dc', value: 'dc' }];
const INITIAL_FILTER_STATE = {
  searchQuery: '',
  salesOrg: '',
  distributionChannel: '',
  pagination: {
    currentPage: 0,
    totalRecords: 0,
    totalPageCount: 0,
    recordsPerPage: 0
  }
};

export default function UserAccounts(props) {
  const { omitColumns = [], selectableRows, selectedRows, setSelectedRows, practiceId } = props;
  const { data, pagination, refetch, setSortCriteria, isLoading, setFilterState, clearFilters } = useUserAccounts();
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [filters, setFilters] = React.useState(INITIAL_FILTER_STATE);
  const [appliedFilters, setAppliedFilters] = React.useState(INITIAL_FILTER_STATE);
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
    setIsCardExpanded((prevExpandedCard) => !prevExpandedCard);
  };

  const onSearchChange = (event) => {
    filters.update.setSearchQuery(event.target.value);
  };

  const handleChangeAutoSuggest = (name, value) => {
    // filters.update.updateQuery(name, event.value);
    setFilters((prevState) => ({
      ...prevState,
      [name]: value
    }));
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

  const handleOnApplyFilter = (event) => {
    event.preventDefault();
    const updatedFilter = { ...filters };
    setAppliedFilters({ ...updatedFilter });
    setFilterState(updatedFilter);
  };
  const handleClearFilters = () => {
    setAppliedFilters(INITIAL_FILTER_STATE);
    setFilters(INITIAL_FILTER_STATE);
    clearFilters();
  };

  const areFiltersEqual = CommonUtils.deepEqual(appliedFilters, filters);
  const anyFilterIsApplied = Object.values(appliedFilters).some((filter) => filter && filter.length > 0);

  const controlButtons =
    anyFilterIsApplied || !areFiltersEqual ? (
      <div className="filter-control-buttons">
        {anyFilterIsApplied && <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />}
        {!areFiltersEqual && <Button type="submit" size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" />}
      </div>
    ) : null;

  return (
    <React.Fragment>
      <div className="MCP-module-body">
        <div className="MCP-panel-container">
          <div className="MCP-CardContainer">
            <form onSubmit={handleOnApplyFilter}>
              <div className="MCP-filter-panel">
                <div className="filter-header">
                  <div className="search-box">
                    <button type="button" onClick={handleExpandCard}>
                      <img src={isCardExpanded ? arrow_down : arrow_right} alt="toggle-icon" />
                    </button>
                    <div className={'ctrl-search-box'}>
                      <InputField errors={{}} id="search-box" name="searchQuery" value={filters.searchQuery} onInputChange={(e) => handleChangeAutoSuggest('searchQuery', e.target.value)} tooltipText={null} useRegister={false} placeholder={t('account.no')} />
                    </div>
                  </div>
                  {controlButtons}
                </div>
                <ToggleUI in={isCardExpanded} timeout={400}>
                  <div className="additional-filters">
                    <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                      <AutoSuggestDropdown eregVariant getselectedValue={(e) => handleChangeAutoSuggest('salesOrg', e.value)} onChangeInput={() => {}} label={'Sales Org'} selectedVal={filters.salesOrg} key={'salesOrg'} suggestionList={salesOrgOptions} />
                      <AutoSuggestDropdown eregVariant getselectedValue={(e) => handleChangeAutoSuggest('distributionChannel', e.value)} onChangeInput={() => {}} label={'Distribution Channel'} selectedVal={''} key={'dc_Filter'} suggestionList={distributionChannelOptions} />
                      {/* {isCardExpanded && controlButtons ? <div className="expanded">{controlButtons}</div> : null} */}
                    </div>
                  </div>
                </ToggleUI>
              </div>
            </form>
          </div>
          <div className="MCP-table-wrapper">
            {/* <AccountsList {...props} isLoading={isLoading} data={data} columns={columns} currentPage={pagination.currentPage} recordsPerPage={pagination.recordsPerPage} handleChangePage={handleChangePage} handleSort={handleSort} /> */}
            <AccountsList {...props} isLoading={isLoading} data={data} columns={columns} currentPage={pagination.currentPage} recordsPerPage={pagination.recordsPerPage} handleChangePage={handleChangePage} handleSort={handleSort} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
