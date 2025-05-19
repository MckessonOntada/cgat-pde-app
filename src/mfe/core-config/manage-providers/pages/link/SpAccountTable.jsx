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

const SpAccountTable = ({ setSpAccount, handleUnlinkSpAccount }) => {
  const [tableHeight, setTableHeight] = useState('100%');
  const [selectedSpAccount, setSelectedSpAccount] = useState([]);
  const [drawerDetails, setDrawerDetails] = useState('');
  const [openSPDetails, setOpenSPDetails] = useState(false);
  const practiceId = AuthUtils.getPracticeId();
  const { t } = useTranslate();
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      let eleHeight = document.getElementById(
        'data-table-my-data-table'
      )?.offsetHeight;
      setTableHeight(eleHeight);
    }, 100);
  }, []);

  const formatSPDetails = useCallback((data) => {
    console.log(data, '====');

    const { accountName, accountNumber, name, phone, address } = data;
    return [
      {
        sectionHeading: 'manageSPMaterial.drawer.Details',
        sectionData: [
          { label: 'Organization', value: '' },
          { label: 'Account Name', value: accountName },
          { label: 'Account Number', value: accountNumber }
        ]
      },
      {
        sectionHeading: 'provider.contactDetails',
        sectionData: [
          { label: 'Contact Person Name', value: name.fullName },
          { label: 'Email-ID', value: address.email },
          { label: 'Phone Number', value: address.telephone },
          { label: 'Fax Number', value: address.fax }
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
          description: t('manageSPAccount.error.message.failedToOpenDetails')
        });
      }
    }
  );

  const {
    paginationConfig,
    setPageNumber,
    applyFilters,
    clearFilters,
    data,
    applySort,
    isAddSpAccount
  } = useLinkSpAccountContext();

  const unLinkSpAccount = (selectedProviders) => {
    renderModal({
      title: t('messages.header.confirmation'),
      bodyContent: (
        <div className="MCP-modal-body">
          <p>{t('Are you sure you want to unlink this SP Account(s)?')}</p>
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
    () =>
      getTableColumn(
        t,
        data,
        paginationConfig,
        selectedSpAccount,
        onSelectSpAccount,
        isAddSpAccount,
        unLinkSpAccount,
        handleProviderDetails
      ),
    [data, paginationConfig, selectedSpAccount]
  );
  function onSelectSpAccount(data) {
    setSelectedSpAccount(data);
    if (isAddSpAccount) setSpAccount(data);
  }
  const onRemoveSelectedAccount = useCallback(
    (item) => {
      const updatedList = selectedSpAccount.filter(
        (account) => account.id !== item.id
      );
      setSelectedSpAccount(updatedList);
      if (isAddSpAccount) setSpAccount(updatedList);
    },
    [selectedSpAccount, isAddSpAccount]
  );
  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };
  const handleOnSortIconClick = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey)
      applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  return (
    <div className="MCP-panel-container">
      <div className="MCP-panel-container">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={[]}
          searchPlaceholder={t('Search by Account Name, Number,...')}
          actualData={[]}
          initialData={[]}
        />
      </div>
      {selectedSpAccount?.length > 0 && !isAddSpAccount && (
        <TableHeading
          heading={''}
          secondaryView={selectedSpAccount?.length}
          secondaryViewHeading={`${selectedSpAccount?.length} ${t(
            'orgManagement.selected_items'
          )}`}
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
      {isAddSpAccount && <TableHeading heading={'SP Account Listing'} />}

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
                heading={t('No Accounts found')}
                description={t(
                  'You need to add account to see data in this table'
                )}
              />
            }
          />
        </div>
        {isAddSpAccount && (
          <div
            className={style.selectedAccountBox}
            style={{ height: tableHeight }}>
            <SelectedAccounts
              selectedAccounts={selectedSpAccount}
              onRemoveAccount={onRemoveSelectedAccount}
              header={t('manageSPAccount.providers.selectedProviders')}
            />
          </div>
        )}
        {openSPDetails && (
          <LinkSPDetailsDrawer
            open={openSPDetails}
            onClose={() => setOpenSPDetails(false)}
            details={drawerDetails}
            title={t('manageSPAccount.providers.details')}
          />
        )}
      </div>
    </div>
  );
};

export default SpAccountTable;
