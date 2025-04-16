import { useTranslate } from '@src/translations/useTranslation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import { useLinkProvider } from '../../context/LinkProviderContext';
import CommonFilters from '@src/components/Filters';
import { getLinkProviderColumns } from './LinkProviderColumn';
import TableHeading from '@src/components/tableHeading/TableHeading';
import LinkProviderDetailsDrawer from './LinkProviderDetailsDrawer';
import style from './LinkProvider.module.scss';
import SelectedAccounts from '@src/components/Accounts/SelectedAccounts';
import { getAddress } from '@src/mfe/order-management/pages/system-configuration/manage-spaccount/util.js';
import { renderModal } from '@src/util/ModalUtil';
import { useMutation } from 'react-query';
import LinkProviderService from '@src/api/commonService/LinkProviderService';
import { useOrgAccountSelectionContext } from '@src/mfe/order-management/components/orgAccountSelection/context/OrgAccountSelectionContext';
import CommonUtils from '@src/util/CommonUtils';

function LinkProviderTable({ handleUnlinkProvider, setSelectedProviders }) {
  const { t } = useTranslate();
  const {
    paginationConfig,
    setPageNumber,
    applyFilters,
    clearFilters,
    data,
    refreshData,
    isAddLinkProvider
  } = useLinkProvider();
  const [selectedLinkProvider, setSelectedLinkProvider] = useState([]);
  const [openProviderDetails, setOpenProviderDetails] = useState(false);
  const [drawerDetails, setDrawerDetails] = useState('');
  const [tableHeight, setTableHeight] = useState('100%');
  const { selectedOrganization } = useOrgAccountSelectionContext();
  useEffect(() => {
    setTimeout(() => {
      let eleHeight = document.getElementById(
        'data-table-my-data-table'
      )?.offsetHeight;
      setTableHeight(eleHeight);
    }, 100);
  }, [data]);
  const onRemoveSelectedAccount = (item) => {
    setSelectedLinkProvider((prev) =>
      prev.filter((provider) => provider.id !== item.id)
    );
  };
  const formatProviderDetails = useCallback((data) => {
    const { name, dea, npi, phone, address } = data;
    return [
      {
        sectionHeading: 'Details',
        sectionData: [
          { label: 'Provider Name', value: CommonUtils.getFullName(name) },
          { label: 'DEA Number', value: dea },
          { label: 'NPI Number', value: npi }
        ]
      },
      {
        sectionHeading: 'Contact',
        sectionData: [
          { label: 'Contact No', value: phone },
          { label: 'Address', value: getAddress(address) }
        ]
      }
    ];
  }, []);
  const unLinkProvider = (row) => {
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
            handleUnlinkProvider(row.id);
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
      return LinkProviderService.getProviderDetailsById(
        providerId,
        selectedOrganization.id
      );
    },
    {
      onSuccess: (data) => {
        setDrawerDetails(formatProviderDetails(data));
        setOpenProviderDetails(true);
      },
      onError: () => {
        addNotification({
          type: 'error',
          description: t('manageSPAccount.error.message.failedToOpenDetails')
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
        isAddLinkProvider
      ),
    [data, paginationConfig, selectedLinkProvider, isAddLinkProvider]
  );

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
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
      {/* {selectedLinkProvider?.length > 0 && !isAddLinkProvider  && (
        <TableHeading
          heading={[]}
          secondaryView={selectedLinkProvider?.length}
          secondaryViewHeading={`${selectedLinkProvider?.length} ${t('orgManagement.selected_items')}`}
          secondaryViewControls={
            <Button variant="secondary" onClick={()=>{unLinkProvider(selectedLinkProvider)}}>
              {t('manageSPAccount.providers.column.unlink')}
            </Button>
          }
        />
      )} */}
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
            handleChangePage={handleChangePage}
            totalRocords={paginationConfig.totalElements}
            recordsPerPage={paginationConfig.pageSize}
            paginationTotalRecorsMessage={t('orgManagement.results')}
            paginationRecordsPerPageMessage={t('orgManagement.per_page')}
            noDataComponent={
              <EmptyDataTable
                image={EmptyDataImage}
                heading={t('manageSPAccount.button.providers.linkProviders')}
                description={t('manageSPAccount.table.error.providers.listing')}
              />
            }
          />
        </div>
        {isAddLinkProvider && (
          <div
            className={style.selectedAccountBox}
            style={{ height: tableHeight }}>
            <SelectedAccounts
              selectedAccounts={selectedLinkProvider}
              onRemoveAccount={onRemoveSelectedAccount}
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
