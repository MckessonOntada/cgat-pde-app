import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import ModuleHeader from '@src/components/module-header';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import { ShippingLocationProvider, useShippingLocation } from '../../context/ShippingLocationContext';
import CommonFilters from '@src/components/Filters';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import AddShippingDetails from './AddShippingDetails';
import AuthUtils from '@src/util/AuthUtils';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';
import { getShippingLocationColumns } from './ShippingLocationColumns';
import { useMutation } from 'react-query';
import { renderModal } from '@src/util/ModalUtil';
import ShippingLocationService from '@src/api/commonService/ShippingLocationService';

function ShippingLocationsDataTable() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { paginationConfig, setPageNumber, applyFilters, clearFilters, data } = useShippingLocation();
  const [openShippingDrawer, setOpenShippingDrawer] = useState(false);
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const [alert, setAlert] = useState(null);

  const handleOnOptionSelection = (value, row) => {
    if (value == 'edit') {
      setOpenShippingDrawer(true);
    } else {
      renderModelforRemove(row);
    }
  };
  const columns = getShippingLocationColumns(t, handleOnOptionSelection, isCustomerCenter);
  const renderModelforRemove = (row) => {
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
            handleRemoveShippingLocation(row);
          }
        }
      }
    });
  };
  const handleRemoveShippingLocation = async (row) => {
    ShippingLocationService.removeShippingLocation(row);
    showAlert('success', t('manageSPAccount.message.addshippinglocation.success'));
  };

  const { mutate } = useMutation({
    mutationFn: handleRemoveShippingLocation,
    onSuccess: (response) => {
      refreshData();
      showAlert('success', t('manageSPAccount.message.addshippinglocation.success'));
    },
    onError: (error) => {
      showAlert('error', t('manageSPAccount.message.addshippinglocation.error'));
    }
  });

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
      <ShippingLocationProvider>
        <div className="MCP-module-body">
          <ModuleHeader
            heading={
              <div className="subheader-text">
                <Heading as="h2">{t('manageSPAccount.heading.shippinglocations')}</Heading>
              </div>
            }
            controls={
              <Button Icon={EditPencil} variant="secondary" className="button-icon" size="md" onClick={() => setOpenShippingDrawer(true)}>
                {t('manageSPAccount.shippinglocation.button.addshippinglocations')}
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
                searchPlaceholder={t('manageSPAccount.filters.searchPlaceholder')}
                actualData={[]}
                initialData={[]}
              />
            </div>
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
                  heading={t('manageSPAccount.table.shippinglocations.emptyData')}
                  description={t('manageSPAccount.tables.shippinglocations.emptyDataDescription')}
                />
              }
            />
          </div>
        </div>

        {openShippingDrawer && <AddShippingDetails open={openShippingDrawer} onClose={() => setOpenShippingDrawer(false)} />}
      </ShippingLocationProvider>
    </div>
  );
}
export default ShippingLocationsDataTable;
