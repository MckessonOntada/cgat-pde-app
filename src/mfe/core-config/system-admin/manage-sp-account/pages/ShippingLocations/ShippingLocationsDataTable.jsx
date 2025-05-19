import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import ModuleHeader from '@src/components/module-header';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import { useShippingLocation } from '../../context/ShippingLocationContext';
import CommonFilters from '@src/components/Filters';
import { ReactComponent as AddIcon } from '@src/assets/svg/add-icon.svg';
import AddShippingDetails from './AddShippingDetails';
import AuthUtils from '@src/util/AuthUtils';
import { getShippingLocationColumns } from './ShippingLocationColumns';
import { useMutation } from 'react-query';
import { renderModal } from '@src/util/ModalUtil';
import ShippingLocationService from '@src/api/commonService/ShippingLocationService';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { useOrgAccountSelectionContext } from '@src/mfe/core-config/system-admin/manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';

function ShippingLocationsDataTable() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { paginationConfig, setPageNumber, applyFilters, clearFilters, data, refreshData, applySort, accountId } = useShippingLocation();
  const { selectedOrganization } = useOrgAccountSelectionContext();
  const [openShippingDrawer, setOpenShippingDrawer] = useState(false);
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const [alert, setAlert] = useState(null);
  const [selectedShippingLocation, setSelectedShippingLocation] = useState([]);
  const [spLocation, setSPLocation] = useState([]);

  const handleOnOptionSelection = (value, row) => {
    if (value == 'edit') {
      setSPLocation(row);
      setOpenShippingDrawer(true);
    } else {
      renderModelforRemove(row);
    }
  };

  const columns = getShippingLocationColumns(
    t,
    data,
    paginationConfig,
    handleOnOptionSelection,
    isCustomerCenter,
    selectedShippingLocation,
    setSelectedShippingLocation
  );

  const renderModelforRemove = (rowParam) => {
    const rows = Array.isArray(rowParam) ? rowParam : rowParam ? [rowParam] : selectedShippingLocation;
    const ids = rows.map((r) => r.id).filter(Boolean);

    renderModal({
      title: t('messages.header.confirmation'),
      bodyContent: (
        <div className="MCP-modal-body">
          <p>{t('manageSPAccount.message.removeShippingLocation')}</p>
        </div>
      ),
      footerActions: {
        cancel: {
          label: t('manageSPAccount.button.cancel')
        },
        confirm: {
          label: t('manageSPAccount.button.confirm'),
          action: () => {
            mutate({
              ids,
              selectedOrgId: selectedOrganization?.id,
              accid: accountId
            });
          }
        }
      }
    });
  };
  const handleRemoveShippingLocation = async ({ ids, selectedOrgId, accid }) => {
    return await ShippingLocationService.removeShippingLocation(ids, selectedOrgId, accid);
  };

  const { mutate } = useMutation({
    mutationFn: handleRemoveShippingLocation,
    onSuccess: (response) => {
      refreshData();
      setSelectedShippingLocation([]);
      showAlert('success', t('manageSPAccount.message.removeshippinglocation.success'));
    },
    onError: (error) => {
      showAlert('error', t('manageSPAccount.message.removeshippinglocation.error'));
    }
  });

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const handleFormSubmitResult = (type, message) => {
    showAlert(type, message);
    refreshData();
    setSelectedShippingLocation([]);
    setOpenShippingDrawer(false);
  };

  const showAlert = (type, message) => {
    setAlert({ type: type, message: message });
  };

  const handleAlertClose = () => {
    setAlert({ type: null, message: null });
  };

  const handleOnSortIconClick = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };
  return (
    <div>
      <div className="MCP-module-body">
        <ModuleHeader
          heading={
            <div className="subheader-text">
              <Heading as="h2">{t('manageSPAccount.heading.shippinglocations')}</Heading>
            </div>
          }
          controls={
            !isCustomerCenter && (
              <Button
                Icon={AddIcon}
                variant="secondary"
                className="button-icon"
                size="md"
                onClick={() => {
                  setSPLocation(null);
                  setOpenShippingDrawer(true);
                }}>
                {t('manageSPAccount.shippinglocation.button.addshippinglocations')}
              </Button>
            )
          }
        />
        {alert && alert.type && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />}
        <div className="MCP-panel-container">
          <div class="MCP-panel-container">
            <CommonFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={[]}
              searchPlaceholder={t('manageSPAccount.filters.searchPlaceholder')}
              actualData={[]}
              initialData={[]}
            />
          </div>
          {selectedShippingLocation?.length > 0 && (
            <TableHeading
              heading={[]}
              secondaryView={selectedShippingLocation?.length}
              secondaryViewHeading={`${selectedShippingLocation?.length} ${t('orgManagement.selected_items')}`}
              secondaryViewControls={
                <Button variant="secondary" onClick={() => handleOnOptionSelection('remove')}>
                  {t('manageSPAccount.button.remove')}
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
            onSortIconClick={handleOnSortIconClick}
            pagination={true}
            handleChangePage={handleChangePage}
            totalRocords={paginationConfig.totalElements}
            recordsPerPage={paginationConfig.pageSize}
            paginationTotalRecorsMessage={t('orgManagement.results')}
            paginationRecordsPerPageMessage={t('orgManagement.per_page')}
            noDataComponent={
              <EmptyDataTable
                image={EmptyDataImage}
                heading={t('manageSPAccount.table.shippinglocations.emptyData')}
                description={t('manageSPAccount.tables.shippinglocations.emptyDataDescription')}
              />
            }
          />
        </div>
      </div>

      {openShippingDrawer && (
        <AddShippingDetails open={openShippingDrawer} onClose={() => setOpenShippingDrawer(false)} row={spLocation} onFormSubmit={handleFormSubmitResult} />
      )}
    </div>
  );
}
export default ShippingLocationsDataTable;
