import React, { useEffect, useMemo, useState } from 'react';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import { Link, Loader, redirect } from 'react-router-dom';
import SelectedAccounts from './SelectedAccounts';
import './styles.scss';
import Actions from './Action';
import { useTranslate } from '@src/translations/useTranslation';
import SelectedAccountChips from './SelectedAccountChips';
import EmptyDataTable from '../EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';

const RECORDS_PER_PAGE = 8;

// TODO: Create filter context
export default function AccountsList({
  selectedRows,
  setSelectedRows,
  onRemoveAccount,
  showSelectedAccounts = false, // This is to show selected accounts in right rail
  selectableRows = true, // To enable or disable row selection
  omitColumns = [], // Pass column ids which you don't want to show in table.
  practiceId,
  userId,
  addNewAccounts
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslate();

  const apiUrl = useMemo(() => {
    let params = {
      pageNo: currentPage - 1,
      pageSize: RECORDS_PER_PAGE,
      sortBy: practiceId ? 'name_1' : 'name_1', // handle based on column
      sortOrder: 'asc',
      practiceId,
      partnerFunction: 'SOLD_TO'
    };

    if (userId && !addNewAccounts) {
      return `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/users/${userId}/accounts?${serializeParams(params)}`;
    } else if ((practiceId && !addNewAccounts) || (userId && addNewAccounts)) {
      return `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/accounts?${serializeParams(params)}`;
    } else if (practiceId && addNewAccounts) {
      return `${ApiRoutes.PUBLIC_ACCOUNTS}?${serializeParams(params)}`;
    }
  }, [currentPage, practiceId, userId, addNewAccounts]);

  const { isLoading, data, isError, refetch } = useQuery({
    queryKey: ['accounts', practiceId],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(`${apiUrl}`, httpVerb.GET, {});
      return res.data;
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true
  });

  useEffect(() => {
    if (typeof setSelectedRows === 'function') {
      setSelectedRows(data?.content);
      refetch();
    }
  }, [addNewAccounts, userId, currentPage]);

  const columns = useMemo(
    () => [
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
        cell: (row) => <Actions row={row} />,
        width: '10%',
        omit: omitColumns.includes('action')
      }
    ],
    [omitColumns]
  );

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  return (
    <>
      {/* {isLoading && <Loader type={'screen'} />} */}
      {showSelectedAccounts && (
        <div className="selected-account-chips">
          <SelectedAccountChips selectedAccounts={selectedRows} onRemoveAccount={onRemoveAccount} />
        </div>
      )}
      <div className="account-box">
        <div className="customTable-box">
          <CustomDataTable
            id="my-data-table"
            type="normal"
            columns={columns}
            data={data?.content || []} // Use the sliced data for the current page
            currentPage={currentPage}
            totalPageCount={data?.totalPages}
            pagination={true}
            handleChangePage={handleChangePage}
            totalRocords={data?.totalElements}
            recordsPerPage={RECORDS_PER_PAGE}
            paginationTotalRecorsMessage={t('orgManagement.results')}
            paginationRecordsPerPageMessage={t('orgManagement.per_page')}
            isAdmin={true}
            selectableRows={selectableRows}
            handleRowSelected={handleRowSelected}
            selectedRowId={selectedRows}
            noDataComponent={<EmptyDataTable image={EmptyDataImage} heading={t('account.add.label')} description={t('account.empty_table.description')} />}
          />
        </div>
        {showSelectedAccounts && (
          <div className="selected-account-box">
            <SelectedAccounts selectedAccounts={selectedRows} onRemoveAccount={onRemoveAccount} />
          </div>
        )}
      </div>
    </>
  );
}
