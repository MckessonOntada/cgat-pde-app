import React, { useEffect, useState } from 'react';
import { Badge, Button, CustomDataTable, Loader } from '@mckesson/mcp-component-library';
import { Link, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as PDFicon } from '../../../../assets/svg/office-file-pdf.svg';
import { usePaymentCredits } from '../../context/PaymentsCreditsContext';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { FormattedNumber } from 'react-intl';
import dayjs from 'dayjs';
// import { PATHS } from '../../routes';
import CommonUtils from '@src/util/CommonUtils';

function CreditsSelected(props) {
  const { t } = useTranslate();
  const [data, setData] = useState([]);
  const location = useLocation();
  const { state } = location;
  //   const { isFetching, paginationConfig, setPageNumber, applySort, isError } = usePaymentCredits();

  useEffect(() => {
    if (state.creditsSelected?.length > 0) {
      setData(state.creditsSelected);
    }
  }, [state]);

  const columns = [
    {
      id: 'billNumber',
      name: t('paymentInvoices.history.table.billNumber'),
      selector: (row) => `${row.billNumber}`,
      sortable: true,
      wrap: true,
      minWidth: '112px',
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}
            // to={`/record/${PATHS.credits}/${props?.billNumber}/details`}
          >
            {`${props?.billNumber}`}
          </Link>
        </div>
      )
    },
    {
      id: 'soldToSite',
      name: t('paymentInvoices.history.table.SoldToSite'),
      selector: () => {},
      minWidth: '160px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{props?.soldToSite || '-'}</div>
    },
    {
      id: 'description',
      name: t('paymentInvoices.credits.table.description'),
      selector: (row) => row.description,
      minWidth: '320px',
      sortable: true,
      wrap: true,
      cell: (props) => (
        <div>
          <EclipsesTextcss str={props?.description || ''} maxWidth={280} />
        </div>
      )
    },
    {
      id: 'dueDate',
      name: t('paymentInvoices.credits.table.validfrom'),
      selector: (row) => row.dueDate,
      sortable: true,
      wrap: true,
      minWidth: '160px',
      cell: (props) => (
        <EclipsesTextcss className="cellEllipse" str={dayjs(props?.dueDate, 'DD/MM/YYYY')?.format('MM/DD/YYYY') || '-'} maxWidth={240} />
      )
    },
    {
      id: 'billAmount',
      name: t('paymentInvoices.credits.table.amount'),
      selector: (row) => row.billAmount,
      minWidth: '144px',
      sortable: true,
      wrap: true,
      cell: (props) => (
        <div className="status-container align-items-right">
          <FormattedNumber value={props?.billAmount} style="currency" currency="USD" />
        </div>
      ),
      right: true
    }
  ];
  const handleSort = (selectedColumn, sortDirection) => {
    // if (selectedColumn.id) applySort({ sortBy: selectedColumn.id, sortOrder: sortDirection });
  };

  return (
    <React.Fragment>
      <CustomDataTable
        id="my-data-table"
        type="normal"
        columns={columns}
        data={data || []}
        onSortIconClick={handleSort}
        // currentPage={paginationConfig.pageNumber}
        // totalPageCount={paginationConfig.totalPages}
        // pagination={true}
        // totalRocords={paginationConfig.totalElements}
        // handleChangePage={handleChangePage}
        // recordsPerPage={paginationConfig.pageSize}
        // paginationTotalRecorsMessage={t('orgManagement.results')}
        // paginationRecordsPerPageMessage={t('orgManagement.per_page')}
        // progressPending={isFetching}
        noDataComponent={
          <EmptyDataTable
            // isLoading={isFetching}
            // error={isError ? 'Something went wrong! Please try again' : null}
            image={EmptyDataImage}
            heading={t('paymentInvoices.credits.table.emptyData')}
            description={t('paymentInvoices.history.table.emptyDataDescription')}
          />
        }
        progressComponent={
          <div
            style={{
              alignItems: 'center',
              border: '1px solid #ccc',
              display: 'flex',
              height: '350px',
              justifyContent: 'center'
            }}>
            <Loader variant="circular" />
          </div>
        }
      />
    </React.Fragment>
  );
}
export default CreditsSelected;
