import React, { useEffect, useMemo, useState } from 'react';
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
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { useQuery } from 'react-query';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';

function Details(props) {
  const { billNumber } = useParams();
  const { type } = props;
  const { selectedAccount } = useAccountContext();
  const { t } = useTranslate();
  const INVOICES_SCREEN = type === PATHS.invoices;
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [billDates, setBillDates] = useState({});
  const navigate = useNavigate();
  const onBackToPaymentsInvoices = () => {
    navigate(-1);
  };

  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ['invoiceDetails', selectedAccount],
    queryFn: async () => {
      if (selectedAccount?.id) {
        const url = `${ApiRoutes.INVOICES_CREDITS_DETAILS(selectedAccount?.id, billNumber)}`;
        let payload = {
          companyCode: selectedAccount?.companyCode,
          salesOrg: selectedAccount?.salesOrg,
          payerAccountNumber: selectedAccount?.accountNumber,
          userName: ''
        };
        const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
        if (res.data) {
          setInvoiceDetails(() => ({
            ...{},
            Bill: res.data.billNumber,
            Reference: res.data.referenceNumber,
            'PO#': res.data.poNumber,
            'Payment Term': res.data.paymentTerm
          }));
          // bill bates
          let _invoiceDue = INVOICES_SCREEN
            ? { 'Amount Due': `$${res.data.amountDue}`, 'Due Date': res.data.dueDate, 'Bill Date': res.data.billDate }
            : { 'Credit Amount': `$${res.data.amountDue}`, 'Credit Remaining': '', 'Valid From': res.data.dueDate };
          setBillDates(_invoiceDue);
          return res.data;
        }
      }
    },
    refetchOnWindowFocus: false
  });

  const columns = useMemo(
    () => [
      {
        name: 'Item',
        id: 'item',
        selector: (row) => `${row.item}`,
        wrap: true,
        minWidth: '120px',
        cell: (props) => <div className="cellEllipse">{props.item || '-'}</div>
      },
      {
        name: 'Therapy Id',
        id: 'therapyId',
        selector: (row) => {
          row.therapyId;
        },
        wrap: true,
        minWidth: '150px',
        cell: (props) => (
          <div className="cellEllipse">
            {' '}
            <Link style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}>{`${props?.therapyId || '-'}`}</Link>
          </div>
        )
      },
      {
        name: 'Description',
        id: '',
        selector: (row) => {},
        wrap: true,
        cell: (props) => <div className="cellEllipse">-</div>
      },
      {
        name: 'Reference Document',
        id: 'referenceDocument',
        selector: (row) => {
          row.referenceDocument;
        },
        wrap: true,
        minWidth: '300px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.referenceDocument} maxWidth={280} />
          </div>
        )
      },
      {
        name: 'Quantity',
        id: 'quantity',
        selector: (row) => {
          row.quantity;
        },
        wrap: true,
        minWidth: '112px',
        cell: (props) => <div className="cellEllipse">{props.quantity}</div>
      },
      {
        name: 'Unit',
        id: 'unit',
        selector: (row) => {
          row.unit;
        },
        wrap: true,
        minWidth: '250px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.unit} maxWidth={200} />
          </div>
        )
      },
      {
        name: 'Net Value',
        id: 'netPrice',
        selector: (row) => {
          row.netPrice;
        },
        wrap: true,
        right: true,
        cell: (props) => <div className="cellEllipse align-items-right">{props.netPrice || '-'}</div>
      },
      {
        name: 'Gross Value',
        id: 'grossPrice',
        selector: (row) => {
          row.grossPrice;
        },
        minWidth: '150px',
        right: true,
        cell: (props) => <div className="cellEllipse align-items-right">{props.grossPrice || '-'}</div>
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
        <div className="datatable-container">
          <CustomDataTable
            id="my-data-table"
            type="normal"
            columns={columns}
            data={data?.invoiceItems || []}
            onSortIconClick={() => {}}
            progressPending={isLoading}
            fixedHeader
            fixedHeaderScrollHeight="20px"
            noDataComponent={
              <EmptyDataTable
                isLoading={isLoading}
                error={isError ? 'Something went wrong! Please try again' : null}
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
                  height: '150px',
                  justifyContent: 'center'
                }}>
                <Loader variant="circular" />
              </div>
            }
          />
        </div>
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
