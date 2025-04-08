import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useSPAccountContext } from '../../context/SPAccountContext';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import ModuleHeader from '@src/components/module-header';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { ReactComponent as UploadSVG } from '@src/assets/image/upload_bottom.svg';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import { routeConstants } from '../../routes/constants';
import { getAddress } from '@src/mfe/order-management/questionnaire/util';

function SPAccountDataTable() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { paginationConfig, SPAccountList, setPageNumber, isLoading, applySort } = useSPAccountContext();

  const columns = [
    {
      id: 'accountNumber',
      name: t('table.columns.captions.accountNumber'),
      selector: (row) => row.accountNumber || '',
      maxWidth: '350px',
      cell: (props) => (
        <Link to={`${props.id}`} className="MCP-table-link" aria-label={t('table.columns.captions.accountNumber')}>
          <EclipsesTextcss str={props.accountNumber} maxWidth={240} />
        </Link>
      ),
      sortable: true,
      sortKey: 'sap_partner'
    },
    {
      id: 'accountName',
      name: t('table.columns.captions.accountName'),
      selector: (row) => row.accountName || '',
      maxWidth: '350px',
      cell: (props) => props.accountName,
      sortable: true,
      sortKey: 'name_1'
    },
    {
      id: 'address',
      name: t('table.columns.captions.address'),
      selector: (row) => row.address || '',
      maxWidth: '450px',
      cell: (props) => <EclipsesTextcss str={getAddress(props.address)} maxWidth={450} />
    }
  ];

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const handleOnSortIconClick = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  return (
    <div>
      <div style={{ marginBottom: '24px', marginTop: '16px' }}>
        <ModuleHeader
          heading={<Heading as="h2">{t('manageSPAccount.heading.AccountListing')}</Heading>}
          controls={
            <div className="controls">
              {
                <Button
                  Icon={add_circle_bold}
                  className="button-icon"
                  variant="primary"
                  size="md"
                  onClick={() => navigate(`${routeConstants.ADD_SPACCOUNT}`)}>
                  {t('manageSPAccount.heading.addSPAccount')}
                </Button>
              }
            </div>
          }
        />
      </div>
      <CustomDataTable
        id="my-data-table"
        type="normal"
        columns={columns}
        data={SPAccountList}
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
            isLoading={isLoading}
            image={EmptyDataImage}
            heading={t('manageSPAccount.table.emptyData')}
            description={t('manageSPAccount.table.emptyDataDescription')}
          />
        }
      />
    </div>
  );
}
export default SPAccountDataTable;
