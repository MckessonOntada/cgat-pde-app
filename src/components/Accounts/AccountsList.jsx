import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import usePermission from '@src/hooks/usePermissions';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils, { checkIsDataFiltered } from '@src/util/CommonUtils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomDataTable } from '../dataTableComponent';
import { renderTableCheckBox } from '../dataTableComponent/assets/constants/CustomTableConstants';
import EmptyDataTable from '../EmptyTable';
import AccountDetails from './AccountDetails';
import { useAccounts } from './AccountsContext';
import Actions from './Action';
import SelectedAccountChips from './SelectedAccountChips';
import SelectedAccounts from './SelectedAccounts';
import './styles.scss';

export default function AccountsList(props) {
  const {
    selectedRows = [],
    setSelectedRows,
    showSelectedAccounts = false,
    isLoading = false,
    omitColumns = [],
    practiceId,
    userId,
    isPhysicianUser,
    practiceName
  } = props;
  const { data = [], paginationConfig, refetch, setPageNumber, filterConfig } = useAccounts();
  const { t } = useTranslate();
  const showCardView = useResponsiveView();
  const [tableHeight, setTableHeight] = useState('100%');
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const { hasAnyPermission } = usePermission();
  const isAuthorized = hasAnyPermission([
    PERMISSIONS_ENUM.USER_MANAGEMENT.ADD_USERS,
    PERMISSIONS_ENUM.USER_MANAGEMENT.EDIT_USERS,
    PERMISSIONS_ENUM.ORGANIZATION_MANAGEMENT.ADD_ORGANIZATION
  ]);
  const isDataFiltered = React.useMemo(() => {
    return checkIsDataFiltered(filterConfig);
  }, [filterConfig]);

  useEffect(() => {
    setTimeout(() => {
      let eleHeight = document.getElementById('data-table-my-data-table')?.offsetHeight;
      setTableHeight(eleHeight);
    }, 100);
  }, [data, isLoading]);

  const columns = useMemo(() => {
    const _columns = [
      {
        id: 'id',
        name: t('account.no'),
        cell: (row) => (
          <Link
            className="MCP-table-link"
            aria-label={t('table.columns.captions.accountNumber')}
            onClick={(e) => {
              e.preventDefault();
              setOpenDetails(true);
              setSelectedDetails(row);
            }}>
            {row.accountNumber}
          </Link>
        ),
        wrap: true,
        width: '100px'
      },
      {
        id: 'accountName',
        name: t('account.name'),
        wrap: true,
        selector: (row) => row.accountName,
        minWidth: '250px',
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
        minWidth: '100px',
        wrap: true,
        cell: (row) => (
          <div>
            <EclipsesTextcss str={row.salesOrg} maxWidth={90} />
          </div>
        )
      },
      {
        id: 'distributionChannel',
        name: t('account.distribution'),
        selector: (row) => row.distributionChannel,
        wrap: true,
        cell: (row) => <div>{row.distributionChannel}</div>,
        omit: omitColumns.includes('distributionChannel'),
        minWidth: '160px'
      },
      {
        id: 'address',
        name: t('account.address'),
        cell: (row) => {
          return (
            <div>
              <EclipsesTextcss str={CommonUtils.getDetailedAddress(row.address)} maxWidth={140} />
            </div>
          );
        },
        omit: omitColumns.includes('address'),
        minWidth: '150px'
      },
      {
        id: 'cgatIdentifier',
        name: t('account.identifier'),
        cell: (row) => <div className="cellEllipse">{row.cgatIdentifier}</div>,
        omit: omitColumns.includes('cgatIdentifier'),
        minWidth: '150px'
      },
      {
        id: 'action',
        center: true,
        name: t('account.action'),
        cell: (row) => <Actions row={row} userId={userId} practiceId={practiceId} refetch={refetch} />,
        width: '120px',
        omit: !isAuthorized || omitColumns.includes('action') || isPhysicianUser,
        isAction: true
      }
    ];
    if (showSelectedAccounts) {
      _columns.unshift({
        id: 'checkbox',
        name: renderTableCheckBox({ id: 'ALL_ITEMS_' + paginationConfig.pageNumber }, data, 'accountNumber', paginationConfig, selectedRows, setSelectedRows),
        cell: (row) => {
          return renderTableCheckBox(row, data, 'accountNumber', paginationConfig, selectedRows, setSelectedRows);
        },
        selector: (row) => row.accountNumber,
        width: '50px',
        showInMobileHeader: true,
        wrap: true
      });
    }
    return _columns;
  }, [omitColumns, showSelectedAccounts, data]);

  const onRemoveSelectedAccount = useCallback(
    (item) => {
      setSelectedRows(selectedRows.filter((account) => account.id !== item.id));
    },
    [selectedRows]
  );

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  return (
    <>
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
            handleChangePage={handleChangePage}
            totalRocords={paginationConfig?.totalElements}
            recordsPerPage={paginationConfig?.pageSize}
            paginationTotalRecorsMessage={t('orgManagement.results')}
            paginationRecordsPerPageMessage={t('orgManagement.per_page')}
            isAdmin={true}
            onSortIconClick={props.handleSort}
            showCardView={showCardView}
            defaultExpandedCardView={true}
            collapsibleCardView={false}
            noDataComponent={
              <EmptyDataTable
                isLoading={isLoading}
                image={EmptyDataImage}
                heading={isDataFiltered ? t('errors.messages.noRecordsFound') : t('account.add.label')}
                description={!isDataFiltered && t('account.empty_table.description')}
              />
            }
          />
        </div>
        {showSelectedAccounts && (
          <div className="selected-account-box" style={{ height: tableHeight }}>
            <SelectedAccounts selectedAccounts={selectedRows} onRemoveAccount={onRemoveSelectedAccount} />
          </div>
        )}
        <AccountDetails openDetails={openDetails} setOpenDetails={setOpenDetails} selectedDetails={selectedDetails} practiceName={practiceName} />
      </div>
    </>
  );
}
