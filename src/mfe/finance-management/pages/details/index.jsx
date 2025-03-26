import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAccountContext } from '../../context/AccountContext';
import { Heading, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import CommonUtils from '@src/util/CommonUtils';
import { GeographicUtils } from '@src/util/GeographicUtil';
import DetailsFlexGrid from '../../components/detailsList/DetailsFlexGrid';
import './viewDetails.scss';
import { Badge, DropdownMenu, Loader } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import DetailMetrics from '../../components/detailMetrics/DetailMetrics';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { PATHS } from '../../routes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { useQuery } from 'react-query';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import TherapyDetails from '@src/components/therapyDetails/TherapyDetails';
import { TherapyDetailsConstants } from './assets/constants/TherapyDetailsConstants';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { FormattedNumber } from 'react-intl';

function Details(props) {
  const { billNumber } = useParams();
  const { type } = props;
  const { selectedAccount } = useAccountContext();
  const { t } = useTranslate();
  const INVOICES_SCREEN = type === PATHS.invoices;
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [billDates, setBillDates] = useState({});
  const [therapy, setTherapy] = useState(null);
  const searchParams = new URLSearchParams(location.search);

  const [open, setOpen] = useState(false);
  const therapyDetails = searchParams.get('therapy-details');
  const navigate = useNavigate();
  const locationParams = useLocation();
  const showCardView = useResponsiveView();

  const { state: { invoices = [], selectedCredit = [] } = {} } = locationParams;
  const source = invoices[0] || selectedCredit[0];
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
          userName: '',
          fiscalYear: source?.fiscalYear,
          lineItem: source?.lineItem,
          referenceDocumentNumber: source?.referenceDocumentNumber
        };
        const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
        if (res.data) {
          setInvoiceDetails(() => ({
            ...{},
            [t('paymentInvoices.Details.Bill')]: res.data.billNumber,
            [t('paymentInvoices.Details.PaymentTerm')]: res.data.paymentTerm,
            [t('paymentInvoices.Details.Reference')]: res.data.referenceNumber,
            [t('paymentInvoices.Details.shipToPoNumber')]: res.data.shipToPONumber,
            [t('paymentInvoices.Details.PO')]: res.data.poNumber
          }));
          // bill bates
          updateBillDates(res);
          return res.data;
        }
      }
    },
    refetchOnWindowFocus: false,
    retry: 1
  });
  const updateBillDates = (res) => {
    let _invoiceDue = INVOICES_SCREEN
      ? {
          [t('paymentInvoices.Details.AmountDue')]: `$${CommonUtils.formatNumberWithoutSymbol(res.data.amountDue)}`,
          [t('paymentInvoices.Details.DueDate')]: CommonUtils.convertDateStringFormat(res.data.dueDate, 'MM/DD/YYYY', 'DD/MM/YYYY'),
          [t('paymentInvoices.Details.BillDate')]: CommonUtils.convertDateStringFormat(res.data.billDate, 'MM/DD/YYYY', 'DD/MM/YYYY')
        }
      : {
          [t('paymentInvoices.Details.CreditAmount')]: `$${CommonUtils.formatNumberWithoutSymbol(res.data.amountDue)}`,
          [t('paymentInvoices.Details.CreditRemaining')]: '',
          [t('paymentInvoices.Details.ValidFrom')]: CommonUtils.convertDateStringFormat(res.data.dueDate, 'MM/DD/YYYY', 'DD/MM/YYYY')
        };
    setBillDates(_invoiceDue);
  };

  const columns = useMemo(
    () => [
      {
        name: t('paymentInvoices.Details.Item'),
        id: 'item',
        selector: (row) => `${row.item}`,
        wrap: true,
        minWidth: '100px',
        cell: (props) => <div className="cellEllipse">{props.item || '-'}</div>
      },
      {
        name: t('paymentInvoices.Details.therapyId'),
        id: 'therapyId',
        selector: (row) => {
          row.therapyId;
        },
        wrap: true,
        minWidth: '120px',
        showInMobileHeader: true,
        showColumnNameInHeader: true,
        cell: (props) => (
          <div className="cellEllipse">
            <Link
              style={{ color: 'var(--brand-color-primary)', fontWeight: '600', textDecoration: 'none' }}
              onClick={() => {
                setOpen(!open);
                setTherapy(props?.therapyId);
              }}
              state={{ ...locationParams.state }}>
              {props?.therapyId || '-'}
            </Link>
          </div>
        )
      },
      {
        name: t('paymentInvoices.Details.Description'),
        id: '',
        selector: (row) => {},
        wrap: true,
        minWidth: '140px',
        maxWidth: '180px',
        cell: (props) => <EclipsesTextcss str={'-'} maxWidth={170} />
      },
      {
        name: t('paymentInvoices.Details.referenceDocument'),
        id: 'referenceDocument',
        selector: (row) => {
          row.referenceDocument;
        },
        wrap: true,
        minWidth: '100px',
        maxWidth: '220px',
        cardHeader: true,
        showInMobileHeader: true,
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.referenceDocument} maxWidth={210} />
          </div>
        )
      },
      {
        name: t('paymentInvoices.Details.Quantity'),
        id: 'quantity',
        selector: (row) => {
          row.quantity;
        },
        wrap: true,
        minWidth: '80px',
        cell: (props) => <div className="cellEllipse">{props.quantity}</div>
      },
      {
        name: t('paymentInvoices.Details.Unit'),
        id: 'unit',
        selector: (row) => {
          row.unit;
        },
        wrap: true,
        minWidth: '80px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.unit} maxWidth={200} />
          </div>
        )
      },
      {
        name: t('paymentInvoices.Details.netPrice'),
        id: 'netPrice',
        selector: (row) => {
          row.netPrice;
        },
        wrap: true,
        right: true,
        minWidth: '130px',
        cell: (props) => (
          <div className="cellEllipse align-items-right">
            <FormattedNumber value={JSON.stringify(props.netPrice)} style="currency" currency="USD" />
          </div>
        )
      },
      {
        name: t('paymentInvoices.Details.grossPrice'),
        id: 'grossPrice',
        selector: (row) => {
          row.grossPrice;
        },
        minWidth: '130px',
        right: true,
        cell: (props) => (
          <div className="cellEllipse align-items-right">
            <FormattedNumber value={props.grossPrice} style="currency" currency="USD" />
          </div>
        )
      }
    ],
    [data]
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
          {locationParams?.state?.reviewPay
            ? t('paymentInvoices.Details.backToReviewAndPay')
            : INVOICES_SCREEN
            ? t('paymentInvoices.Details.backToManageInvoices')
            : t('paymentInvoices.Details.backToManageCredits')}
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
        {CommonUtils.isNonEmptyObject(billDates) && <DetailMetrics data={billDates} />}
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
            showCardView={showCardView}
            defaultExpandedCardView={false}
            noDataComponent={
              <EmptyDataTable
                isLoading={isLoading}
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
        {!locationParams?.state?.reviewPay && (
          <React.Fragment>
            {CommonUtils.enableReviewAndPay(selectedAccount) && (
              <Button
                size="md"
                variant="primary"
                type="submit"
                onClick={() => {
                  navigate(`/record/invoices/reviewPayments`, { state: { ...locationParams.state, reviewPay: true } });
                }}>
                {t('paymentInvoices.Details.ReviewAndPay')}
              </Button>
            )}
          </React.Fragment>
        )}
      </div>
      {open && (
        <TherapyDetails
          therapyId={therapy}
          onSelect={() => {}}
          onClose={() => setOpen(!open)}
          therapyData={TherapyDetailsConstants}
          showFooter={false}
          heading={t('labels.therapyDetails')}
        />
      )}
    </div>
  );
}

Details.propTypes = {};

export default Details;
