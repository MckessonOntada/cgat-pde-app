import { useTranslate } from '@src/translations/useTranslation';
import React, { useEffect, useState } from 'react';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import { useLinkProvider } from '../../context/LinkProviderContext';
import CommonFilters from '@src/components/Filters';
import { getLinkProviderColumns } from './LinkProviderColumn';
import TableHeading from '@src/components/tableHeading/TableHeading';
import LinkProviderDetailsDrawer from './LinkProviderDetailsDrawer';
import './LinkProvider.module.scss';
import SelectedAccounts from '@src/components/Accounts/SelectedAccounts';

function LinkProviderTable({unLinkProvider, isAddLinkProvider}) {
  const { t } = useTranslate();
  const { paginationConfig, setPageNumber, applyFilters, clearFilters, data, refreshData } = useLinkProvider();
  const [selectedLinkProvider, setSelectedLinkProvider] = useState([]);
  const [openProviderDetails, setOpenProviderDetails] = useState(false);
  const [drawerDetails, setDrawerDetails] = useState('')  
  const [tableHeight, setTableHeight] = useState('100%');
  useEffect(() => {
    setTimeout(() => {
      let eleHeight = document.getElementById('data-table-my-data-table')?.offsetHeight;
      setTableHeight(eleHeight);
    }, 100);
  }, [data]);
  const selectedRows = [];
  const onRemoveSelectedAccount = () =>{};
  const formatProviderDetails = (data) => {
    const {
      id,
      providerName,
      deaNumber,
      npiNumber,
      contactNo,
      address
    } = data;
  
    const fullAddress = `${address.address1}${address.address2 ? ', ' + address.address2 : ''}, ${address.city}, ${address.state} ${address.zip}`;
  
    return [
      {
        sectionHeading: 'Details',
        sectionData: [
          { label: 'ID', value: id },
          { label: 'Provider Name', value: providerName },
          { label: 'DEA Number', value: deaNumber },
          { label: 'NPI Number', value: npiNumber }
        ]
      },
      {
        sectionHeading: 'Contact',
        sectionData: [
          { label: 'Contact No', value: contactNo },
          { label: 'Address', value: fullAddress },
        ]
      }
    ];
  };
  const columns = getLinkProviderColumns(
    t,
    data,
    paginationConfig,
    unLinkProvider,
    selectedLinkProvider,
    setSelectedLinkProvider,
    setOpenProviderDetails,
    setDrawerDetails,
    formatProviderDetails,
    isAddLinkProvider
  );

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  return (
    <div className="MCP-panel-container">
      <div class="MCP-panel-container">
        <CommonFilters
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        additionalFilters={[]}
        searchPlaceholder={t('manageSPAccount.providers.search.placeholder')}
        actualData={[]}
        initialData={[]}
        />
      </div>
      {selectedLinkProvider?.length > 0 && !isAddLinkProvider  && (
        <TableHeading
          heading={[]}
          secondaryView={selectedLinkProvider?.length}
          secondaryViewHeading={`${selectedLinkProvider?.length} ${t('orgManagement.selected_items')}`}
          secondaryViewControls={
            <Button variant="secondary" onClick={() => {}}>
            {t('manageSPAccount.providers.column.unlink')}
            </Button>
          }
        />
      )}
        <div className="account-box">
          <div className="customTable-box">
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
                  heading={t('manageSPAccount.table.linkproviders.emptyData')}
                  description={t('manageSPAccount.tables.linkproviders.emptyDataDescription')}
              />
              }
            />
          </div>
          {isAddLinkProvider && (
            <div className="selected-account-box"  style={{ height: tableHeight }}>
              <SelectedAccounts selectedAccounts={selectedRows} onRemoveAccount={onRemoveSelectedAccount} />
            </div>
          )}
        </div>
        {openProviderDetails &&
          <LinkProviderDetailsDrawer
            open={openProviderDetails}
            onClose={() => setOpenProviderDetails(false)}
            details={drawerDetails}
            title={t('manageSPAccount.providers.details')}
          />        
        }
    </div>
  );
}
export default LinkProviderTable;
