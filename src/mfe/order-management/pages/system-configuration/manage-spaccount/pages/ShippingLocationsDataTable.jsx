import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { getAddress } from '@src/mfe/order-management/questionnaire/util';
import ModuleHeader from '@src/components/module-header';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { ReactComponent as UploadSVG } from '@src/assets/image/upload_bottom.svg';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import { routeConstants } from '../routes/constants';
import { ShippingLocationProvider, useShippingLocationContext } from '../context/ShippingLocationContext';

import CommonFilters from '@src/components/Filters';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
function ShippingLocationsDataTable() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { paginationConfig, setPageNumber, applyFilters, clearFilters } = useShippingLocationContext();

  const columns = [
    {
      id: 'shippingAddress',
      name: t('manageSPAccount.table.shippingaddress'),
      selector: (row) => row.shippingaddress || '',
      maxWidth: '350px',
      cell: (props) => <EclipsesTextcss str={props.shippingaddress} maxWidth={240} />,
      sortable: true,
      sortKey: 'shippingaddress'
    },
    {
      id: 'shippingAccountNumber',
      name: t('manageSPAccount.table.shippingAccountNumber'),
      selector: (row) => row.shippingAccountNumber || '',
      maxWidth: '350px',
      cell: (props) => props.shippingAccountNumber,
      sortable: true,
      sortKey: 'shippingAccountNumber'
    },
    {
      id: 'shippingaccountName',
      name: t('manageSPAccount.table.shippingaccountName'),
      selector: (row) => row.shippingaccountName || '',
      maxWidth: '350px',
      cell: (props) => <EclipsesTextcss str={props.shippingaccountName} maxWidth={240} />,
      sortable: true,
      sortKey: 'shippingaccountName'
    }
  ];

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
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
              <Button
                Icon={EditPencil}
                variant="secondary"
                className="button-icon"
                size="md"
                onClick={() => navigate(`../${routeConstants.EDIT_SPACCOUNT}/${spAccountId}`, { state: { isEdit: true } })}>
                {t('manageSPAccount.shippinglocation.button.addshippinglocations')}
              </Button>
            }
          />
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
              data={[]}
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
                  heading={t('manageSPAccount.table.emptyData')}
                  description={t('manageSPAccount.table.emptyDataDescription')}
                />
              }
            />
          </div>
        </div>
      </ShippingLocationProvider>
    </div>
  );
}
export default ShippingLocationsDataTable;
