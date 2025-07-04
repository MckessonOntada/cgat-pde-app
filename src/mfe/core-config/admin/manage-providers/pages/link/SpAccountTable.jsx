import { useTranslate } from '@src/translations/useTranslation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import SelectedAccounts from '@src/components/Accounts/SelectedAccounts';
import style from './LinkSpAccount.module.scss';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { CustomDataTable } from '@src/components/dataTableComponent';
import TableHeading from '@src/components/tableHeading/TableHeading';
import CommonFilters from '@src/components/Filters';
import { getTableColumn } from './TableColumn';
import { useLinkSpAccountContext } from '../../context/LinkSpAccountContext';
import { renderModal } from '@src/util/ModalUtil';
import LinkSPDetailsDrawer from './LinkSPDetailsDrawer';
import { useMutation } from 'react-query';
import AuthUtils from '@src/util/AuthUtils';
import AccountService from '@src/api/commonService/AccountService';
import useSessionFeatures from '@src/hooks/useSessionFeatures';
import { checkIsDataFiltered } from '@src/util/CommonUtils';

const SpAccountTable = ({ setSpAccount, handleUnlinkSpAccount }) => {
  const [tableHeight, setTableHeight] = useState('100%');
  const [selectedSpAccount, setSelectedSpAccount] = useState([]);
  const [drawerDetails, setDrawerDetails] = useState('');
  const [openSPDetails, setOpenSPDetails] = useState(false);
  const practiceId = AuthUtils.getPracticeId();
  const { t } = useTranslate();
  const {
    organization: { selectedOrganization }
  } = useSessionFeatures();

  useEffect(() => {
    setTimeout(() => {
      let eleHeight = document.getElementById('data-table-my-data-table')?.offsetHeight;
      setTableHeight(eleHeight);
    }, 500);
  }, []);

  const formatSPDetails = useCallback((data) => {
    const { accountName, accountNumber, name, address } = data;
    return [
      {
        sectionHeading: 'manageSPAccount.heading.AccountDetails',
        sectionData: [
          {
            label: 'manageSPAccount.heading.organization',
            value: selectedOrganization.label
          },
          { label: 'labels.accountName', value: accountName },
          {
            label: 'paymentInvoices.CS.table.accountnumber',
            value: accountNumber
          }
        ]
      },
      {
        sectionHeading: 'provider.contactDetails',
        sectionData: [
          {
            label: 'manageSPAccount.labels.contactPerson',
            value: name.fullName
          },
          { label: 'provider.sp.account.email', value: address.email },
          { label: 'provider.phone', value: address.telephone },
          { label: 'provider.sp.account.fax', value: address.fax }
        ]
      }
    ];
  }, []);

  const { mutate: handleProviderDetails } = useMutation(
    async (spAccountId) => {
      return AccountService.getAccountListById(spAccountId, practiceId);
    },
    {
      onSuccess: (data) => {
        setDrawerDetails(formatSPDetails(data));
        setOpenSPDetails(true);
      },
      onError: () => {
        addNotification({
          type: 'error',
          description: t('errors.default')
        });
      }
    }
  );

  const { paginationConfig, setPageNumber, applyFilters, clearFilters, filterConfig, data, applySort, isAddSpAccount } = useLinkSpAccountContext();
  const isDataFiltered = React.useMemo(() => {
    return checkIsDataFiltered(filterConfig);
  }, [filterConfig]);
  const unLinkSpAccount = (selectedProviders) => {
    renderModal({
      title: t('messages.header.confirmation'),
      bodyContent: (
        <div className="MCP-modal-body">
          <p>{t('provider.sp.account.wantToUnlink_account')}</p>
        </div>
      ),
      footerActions: {
        cancel: {
          label: t('manageSPAccount.button.cancel')
        },
        confirm: {
          label: t('manageSPAccount.button.confirm'),
          action: () => {
            handleUnlinkSpAccount(selectedProviders);
          }
        }
      }
    });
  };
  const columns = useMemo(
    () => getTableColumn(t, data, paginationConfig, selectedSpAccount, onSelectSpAccount, isAddSpAccount, unLinkSpAccount, handleProviderDetails),
    [data, paginationConfig, selectedSpAccount, isAddSpAccount]
  );
  function onSelectSpAccount(data) {
    setSelectedSpAccount(data);
    if (isAddSpAccount) setSpAccount(data);
  }
  const onRemoveSelectedAccount = useCallback(
    (item) => {
      const updatedList = selectedSpAccount.filter((account) => account.id !== item.id);
      setSelectedSpAccount(updatedList);
      if (isAddSpAccount) setSpAccount(updatedList);
    },
    [selectedSpAccount, isAddSpAccount]
  );
  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };
  const handleOnSortIconClick = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  return (
    <div className="MCP-panel-container">
      <div className="MCP-panel-container">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={[]}
          searchPlaceholder={t('provider.sp.account.searchPlaceholderLinkSp')}
          actualData={[]}
          initialData={[]}
        />
      </div>
      {selectedSpAccount?.length > 0 && !isAddSpAccount && (
        <TableHeading
          heading={''}
          secondaryView={selectedSpAccount?.length}
          secondaryViewHeading={`${selectedSpAccount?.length} ${t('orgManagement.selected_items')}`}
          secondaryViewControls={
            <Button
              variant="secondary"
              onClick={() => {
                unLinkSpAccount(selectedSpAccount);
              }}>
              {t('manageSPAccount.providers.column.unlink')}
            </Button>
          }
        />
      )}
      {isAddSpAccount && <TableHeading heading={t('provider.sp.account.spAccountListing')} />}

      <div className={style.accountBox}>
        <div className={style.customTableBox}>
          <CustomDataTable
            id="my-data-table"
            type="normal"
            columns={columns}
            data={data}
            currentPage={paginationConfig.pageNumber}
            totalPageCount={paginationConfig.totalPages}
            pagination={true}
            onSortIconClick={handleOnSortIconClick}
            handleChangePage={handleChangePage}
            totalRocords={paginationConfig.totalElements}
            recordsPerPage={paginationConfig.pageSize}
            paginationTotalRecorsMessage={t('orgManagement.results')}
            paginationRecordsPerPageMessage={t('orgManagement.per_page')}
            noDataComponent={
              <EmptyDataTable
                image={EmptyDataImage}
                heading={isDataFiltered ? t('errors.messages.noRecordsFound') : t('captions.questionnaire.account.emptyTableTitle')}
                description={!isDataFiltered && t('provider.sp.account.needToAddAccount')}
              />
            }
          />
        </div>
        {isAddSpAccount && (
          <div className={style.selectedAccountBox} style={{ height: tableHeight }}>
            <SelectedAccounts
              selectedAccounts={selectedSpAccount}
              onRemoveAccount={onRemoveSelectedAccount}
              isLinkSpAccount={true}
              header={t('manageSPAccount.providers.selectedProviders')}
            />
          </div>
        )}
        {openSPDetails && (
          <LinkSPDetailsDrawer
            open={openSPDetails}
            onClose={() => setOpenSPDetails(false)}
            details={drawerDetails}
            title={t('manageSPAccount.heading.spAccountDetails')}
          />
        )}
      </div>
    </div>
  );
};

export default SpAccountTable;
