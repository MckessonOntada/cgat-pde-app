import React, { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAccountContext } from '../../context/AccountContext';
import { Heading, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import CommonUtils from '@src/util/CommonUtils';
import { GeographicUtils } from '@src/util/GeographicUtil';
import DetailsFlexGrid from '../../components/detailsList/DetailsFlexGrid';
import './viewDetails.scss';
import { Badge, DropdownMenu, CustomDataTable, Loader } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import DetailMetrics from '../../components/detailMetrics/DetailMetrics';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { PATHS } from '../../routes';

// Dummy data will be removed after API integration
const invoiceDetails = {
  Bill: 339829172,
  Reference: 339829172,
  'PO#': 'LYNX_CART_231207115913',
  'Payment Term': '1-15,N25TH/16-EOM,N10TH PROX'
};

const billDates = {
  'Amount Due': '$2318.23',
  'Due Date': 'Dec 25, 2024',
  'Bill Date': 'Dec 07, 2024'
};
const data = [
  {
    billItemNumber: '2355',
    mckItemNumber: 'Mk876565',
    refDoc: 'TYYgfgh',
    quantity: 56,
    salesUnit: 'XYZ',
    netValue: 456,
    grossValue: 560
  }
];

function Details(props) {
  const { billNumber } = useParams();
  const { type } = props;
  const { selectedAccount } = useAccountContext();
  const { t } = useTranslate();
  const INVOICES_SCREEN = type === PATHS.invoices;

  const navigate = useNavigate();
  const onBackToPaymentsInvoices = () => {
    navigate(-1);
  };

  const columns = useMemo(
    () => [
      {
        name: 'Item',
        id: 'billItemNumber',
        selector: (row) => `${row.billItemNumber}`,
        sortable: true,
        wrap: true,
        minWidth: '112px',
        cell: (props) => <div className="cellEllipse">{props.billItemNumber}</div>
      },
      {
        name: 'Therapy Id',
        id: '',
        selector: (row) => {
          row.mckItemNumber;
        },
        sortable: true,
        wrap: true,
        minWidth: '112px',
        cell: (props) => (
          <div className="cellEllipse">
            {' '}
            <Link style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}>{`${props?.mckItemNumber || ''}`}</Link>
          </div>
        )
      },
      {
        name: 'Description',
        id: '',
        selector: (row) => {},
        sortable: true,
        wrap: true,
        // minWidth: '112px',
        cell: (props) => <div className="cellEllipse">-</div>
      },
      {
        name: 'Reference Document',
        id: 'refDoc',
        selector: (row) => {
          row.refDoc;
        },
        sortable: true,
        wrap: true,
        minWidth: '112px',
        cell: (props) => <div className="cellEllipse">{props.refDoc}</div>
      },
      {
        name: 'Quantity',
        id: 'quantity',
        selector: (row) => {
          row.quantity;
        },
        sortable: true,
        wrap: true,
        minWidth: '112px',
        cell: (props) => <div className="cellEllipse">{props.quantity}</div>
      },
      {
        name: 'Unit',
        id: 'salesUnit',
        selector: (row) => {
          row.salesUnit;
        },
        sortable: true,
        wrap: true,
        minWidth: '112px',
        cell: (props) => <div className="cellEllipse">{props.salesUnit}</div>
      },
      {
        name: 'Net Value',
        id: 'netValue',
        selector: (row) => {
          row.netValue;
        },
        sortable: true,
        wrap: true,
        minWidth: '112px',
        cell: (props) => <div className="cellEllipse">{props.netValue}</div>
      },
      {
        name: 'Gross Value',
        id: '',
        selector: (row) => {
          row.grossValue;
        },
        sortable: true,
        wrap: true,
        minWidth: '112px',
        cell: (props) => <div className="cellEllipse">{props.grossValue}</div>
      }
    ],
    []
  );

  return (
    <div className="view-details-container">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={onBackToPaymentsInvoices}
          size="md">
          {INVOICES_SCREEN ? t('paymentInvoices.Details.backToManageInvoices') : t('paymentInvoices.Details.backToManageCredits')}
        </Button>
      </div>
      <Heading>
        {INVOICES_SCREEN ? t('paymentInvoices.Details.Invoice') : t('paymentInvoices.Details.Credit')} - {`#${billNumber}` || '#'}
      </Heading>
      <div className="details-card-wrapper">
        <div className="details-card-container">
          {CommonUtils.isNonEmptyObject(selectedAccount) && (
            <div className="account-info">
              <div className="account-name">
                {CommonUtils.isNonEmptyString(selectedAccount?.accountName) ? selectedAccount?.accountName : ''}
              </div>
              <div className="account-address">{selectedAccount ? GeographicUtils.addressAggregator(selectedAccount) : ''}</div>
            </div>
          )}
          <DetailsFlexGrid invoiceDetails={invoiceDetails} />
        </div>
        <DetailMetrics data={billDates} />
        <CustomDataTable
          id="my-data-table"
          type="normal"
          columns={columns}
          data={data || []}
          onSortIconClick={() => {}}
          //   progressPending={isFetching}
          noDataComponent={
            <EmptyDataTable
              isLoading={false}
              error={false ? 'Something went wrong! Please try again' : null}
              image={EmptyDataImage}
              heading={t('paymentInvoices.invoice.table.emptyData')}
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
      </div>

      <div className="footer-section">
        {INVOICES_SCREEN ? (
          <React.Fragment>
            <Button size="md" variant="secondary">
              {t('paymentInvoices.Details.DownloadPDF')}
            </Button>
            <Button size="md" variant="primary" type="submit">
              {t('paymentInvoices.Details.ReviewAndPay')}
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Button size="md" variant="primary">
              {t('paymentInvoices.Details.DownloadPDF')}
            </Button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

Details.propTypes = {};

export default Details;
