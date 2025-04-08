import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import LinkProviderDetailsDrawer from './LinkProviderDetailsDrawer';
import { renderModal } from '@src/util/ModalUtil';
import { routeConstants } from '../../routes/constants';

function LinkProviderDataTable() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { spAccountId } = useParams();
  const { paginationConfig, setPageNumber, applyFilters, clearFilters, data, refreshData } = useLinkProvider();
  const [alert, setAlert] = useState(null);
  const [selectedLinkProvider, setSelectedLinkProvider] = useState([]);
  const [openProviderDetails, setOpenProviderDetails] = useState(false);
  const [drawerDetails, setDrawerDetails] = useState('')  
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
  const handleOnOptionSelection = (row) => {
    renderModelforRemove(row)
  };
  const columns = getLinkProviderColumns(
    t,
    data,
    paginationConfig,
    handleOnOptionSelection,
    selectedLinkProvider,
    setSelectedLinkProvider,
    setOpenProviderDetails,
    setDrawerDetails,
    formatProviderDetails
  );
  const renderModelforRemove = (row) => {
    renderModal({
      title: t('messages.header.confirmation'),
      bodyContent: (
        <div className="MCP-modal-body">
          <p>{t('manageSPAccount.message.remove.linkprovider')}</p>
        </div>
      ),
      footerActions: {
        cancel: {
          label: t('manageSPAccount.button.cancel'),
        },
        confirm: {
          label: t('manageSPAccount.button.confirm'),
          action: () => {
            handleRemoveLinkProvider(row);
          }
        }
      }
    });
  };

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
                <Heading as="h2">{t('manageSPAccount.heading.providers')}</Heading>
              </div>
            }
            controls={
              <Button
                Icon={EditPencil}
                variant="secondary"
                className="button-icon"
                size="md"
                onClick={() => navigate(`../${routeConstants.ADD_LINK_PROVIDER}/${spAccountId}`)}
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
        {openProviderDetails &&
          <LinkProviderDetailsDrawer
            open={openProviderDetails}
            onClose={() => setOpenProviderDetails(false)}
            details={drawerDetails}
            title={t('manageSPAccount.providers.details')}
          />        
        }
      </LinkProviderProvider>
    </div>
  );
}
export default LinkProviderDataTable;
