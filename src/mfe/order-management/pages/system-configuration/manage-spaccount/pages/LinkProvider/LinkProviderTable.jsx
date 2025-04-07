import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import ModuleHeader from '@src/components/module-header';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import { LinkProviderProvider, useLinkProvider } from '../../context/LinkProviderContext';
import CommonFilters from '@src/components/Filters';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { getLinkProviderColumns } from './LinkProviderColumn';
import LinkProviderService from '@src/api/commonService/LinkProviderService';
import TableHeading from '@src/components/tableHeading/TableHeading';

function LinkProviderDataTable() {
  const { t } = useTranslate();
  const { paginationConfig, setPageNumber, applyFilters, clearFilters, data, refreshData } = useLinkProvider();
  const [alert, setAlert] = useState(null);
  const [selectedLinkProvider, setSelectedLinkProvider] = useState([]);

  const handleOnOptionSelection = (row) => {
    handleRemoveLinkProvider(row);
  };

  const columns = getLinkProviderColumns(
    t,
    data,
    paginationConfig,
    handleOnOptionSelection,
    selectedLinkProvider,
    setSelectedLinkProvider
  );
  const handleRemoveLinkProvider = async (row) => {
    LinkProviderService.removeLinkProvider(row);
    showAlert('success', t('manageSPAccount.message.removelinkprovider.success'));
  };

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const showAlert = (type, message) => {
    setAlert({ type: type, message: message });
  };

  const handleAlertClose = () => {
    setAlert({ type: null, message: null });
  };

  return (
    <div>
      <LinkProviderProvider>
        <div className="MCP-module-body">
          <ModuleHeader
            heading={
              <div className="subheader-text">
                <Heading as="h2">{t('manageSPAccount.heading.linkproviders')}</Heading>
              </div>
            }
            controls={
              <Button
                Icon={EditPencil}
                variant="secondary"
                className="button-icon"
                size="md"
              >
                {t('manageSPAccount.button.providers.linkProviders')}
              </Button>
            }
          />
          {alert && alert.type && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />}
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
            {selectedLinkProvider?.length > 0 && (
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
        </div>
      </LinkProviderProvider>
    </div>
  );
}
export default LinkProviderDataTable;
