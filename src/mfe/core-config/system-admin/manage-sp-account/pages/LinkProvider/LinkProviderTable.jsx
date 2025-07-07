import { useTranslate } from '@src/translations/useTranslation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CustomDataTable } from '@src/components/dataTableComponent';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { Button } from '@mckesson/mcp-component-library';
import { useLinkProvider } from '../../context/LinkProviderContext';
import CommonFilters from '@src/components/Filters';
import { getLinkProviderColumns } from './LinkProviderColumn';
import TableHeading from '@src/components/tableHeading/TableHeading';
import LinkProviderDetailsDrawer from './LinkProviderDetailsDrawer';
import style from './LinkProvider.module.scss';
import SelectedAccounts from '@src/components/Accounts/SelectedAccounts';
import { getAddress } from '@src/mfe/core-config/system-admin/manage-sp-account/util.js';
import { renderModal } from '@src/util/ModalUtil';
import { useMutation } from 'react-query';
import LinkProviderService from '@src/api/commonService/LinkProviderService';
import CommonUtils, { checkIsDataFiltered } from '@src/util/CommonUtils';
import AuthUtils from '@src/util/AuthUtils';
import { useSearchParams } from 'react-router-dom';

function LinkProviderTable({ handleUnlinkProvider, setSelectedProviders }) {
  const { t } = useTranslate();
  const { paginationConfig, setPageNumber, applyFilters, clearFilters, data, isAddLinkProvider, applySort, filterConfig } = useLinkProvider();
  const [selectedLinkProvider, setSelectedLinkProvider] = useState([]);
  const [openProviderDetails, setOpenProviderDetails] = useState(false);
  const [drawerDetails, setDrawerDetails] = useState('');
  const [tableHeight, setTableHeight] = useState('100%');
  const [searchParams] = useSearchParams();
  const selectedOrganization = searchParams.get('orgId');
  const isCustomerCenter = AuthUtils.isCustomerCenter();

  useEffect(() => {
    setTimeout(() => {
      let eleHeight = document.getElementById('data-table-my-data-table')?.offsetHeight;
      setTableHeight(eleHeight);
    }, 100);
  }, [data]);
  const isDataFiltered = React.useMemo(() => {
    return checkIsDataFiltered(filterConfig);
  }, [filterConfig]);

  const onRemoveSelectedAccount = useCallback(
    (item) => {
      const updatedList = selectedLinkProvider.filter((provider) => provider.id !== item.id);
      setSelectedLinkProvider(updatedList);
      if (isAddLinkProvider) setSelectedProviders(updatedList);
    },
    [selectedLinkProvider, isAddLinkProvider, setSelectedProviders]
  );

  const formatProviderDetails = useCallback((data) => {
    const { name, dea, npi, phone, address } = data;
    return [
      {
        sectionHeading: 'manageSPMaterial.drawer.Details',
        sectionData: [
          { label: 'provider.name', value: CommonUtils.getFullName(name) },
          { label: 'manageSPAccount.table.DEANumber', value: dea },
          { label: 'manageSPAccount.table.NPINumber', value: npi }
        ]
      },
      {
        sectionHeading: 'provider.contactDetails',
        sectionData: [
          { label: 'provider.phone', value: phone },
          { label: 'account.address', value: getAddress(address) }
        ]
      }
    ];
  }, []);
  const unLinkProvider = (selectedProviders) => {
    renderModal({
      title: t('messages.header.confirmation'),
      bodyContent: (
        <div className="MCP-modal-body">
          <p>{t('manageSPAccount.message.remove.linkprovider')}</p>
        </div>
      ),
      footerActions: {
        cancel: {
          label: t('manageSPAccount.button.cancel')
        },
        confirm: {
          label: t('manageSPAccount.button.confirm'),
          action: () => {
            handleUnlinkProvider(selectedProviders);
          }
        }
      }
    });
  };
  function onSelectProvider(data) {
    setSelectedLinkProvider(data);
    if (isAddLinkProvider) setSelectedProviders(data);
  }
  const { mutate: handleProviderDetails } = useMutation(
    async (providerId) => {
      return LinkProviderService.getProviderDetailsById(providerId, selectedOrganization);
    },
    {
      onSuccess: (data) => {
        setDrawerDetails(formatProviderDetails(data));
        setOpenProviderDetails(true);
      },
      onError: () => {
        addNotification({
          type: 'error',
          description: t('errors.default')
        });
      }
    }
  );

  const columns = useMemo(
    () =>
      getLinkProviderColumns(
        t,
        data,
        paginationConfig,
        unLinkProvider,
        selectedLinkProvider,
        onSelectProvider,
        handleProviderDetails,
        isAddLinkProvider,
        isCustomerCenter
      ),
    [data, paginationConfig, selectedLinkProvider, isAddLinkProvider]
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
          searchPlaceholder={t('manageSPAccount.providers.search.placeholder')}
          actualData={[]}
          initialData={[]}
        />
      </div>
      {selectedLinkProvider?.length > 0 && !isAddLinkProvider && (
        <TableHeading
          heading={[]}
          secondaryView={selectedLinkProvider?.length}
          secondaryViewHeading={`${selectedLinkProvider?.length} ${t('orgManagement.selected_items')}`}
          secondaryViewControls={
            <Button
              variant="secondary"
              onClick={() => {
                unLinkProvider(selectedLinkProvider);
              }}>
              {t('manageSPAccount.providers.column.unlink')}
            </Button>
          }
        />
      )}
      {isAddLinkProvider && <TableHeading heading={t('label.providerListing')} />}
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
                heading={isDataFiltered ? t('errors.messages.noRecordsFound') : t('manageSPAccount.providers.noData')}
                description={!isDataFiltered && t('manageSPAccount.table.error.providers.listing')}
              />
            }
          />
        </div>
        {isAddLinkProvider && (
          <div className={style.selectedAccountBox} style={{ height: tableHeight }}>
            <SelectedAccounts
              selectedAccounts={selectedLinkProvider}
              onRemoveAccount={onRemoveSelectedAccount}
              header={t('manageSPAccount.providers.selectedProviders')}
            />
          </div>
        )}
      </div>
      {openProviderDetails && (
        <LinkProviderDetailsDrawer
          open={openProviderDetails}
          onClose={() => setOpenProviderDetails(false)}
          details={drawerDetails}
          title={t('manageSPAccount.providers.details')}
        />
      )}
    </div>
  );
}
export default LinkProviderTable;
