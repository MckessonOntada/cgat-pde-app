import { Alert, Button, Heading, Loader } from '@mckesson/mcp-component-library';
import ApiRoutes from '@src/api/ApiRoutes';
import OrderService from '@src/api/commonService/OrderService';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { CustomDataTable } from '@src/components/dataTableComponent';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import EmptyDataTable from '@src/components/EmptyTable';
import { FooterContext } from '@src/components/footer/FooterContext';
import TherapyDetails from '@src/components/therapyDetails/TherapyDetails';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { TherapyDetailsConstantsForBB } from '@src/mfe/order-management/pages/create/form-segments/therapy-selection/assets/constants/TherapyDetailsConstants';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import { GeographicUtils } from '@src/util/GeographicUtil';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FormattedNumber } from 'react-intl';
import { useMutation, useQuery } from 'react-query';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import DetailMetrics from '../../components/detailMetrics/DetailMetrics';
import DetailsFlexGrid from '../../components/detailsList/DetailsFlexGrid';
import { useAccountContext } from '../../context/AccountContext';
import { PATHS } from '../../routes';
import './viewDetails.scss';
import History from './history';

function Details(props) {
  const { billNumber } = useParams();
  const { type } = props;
  const { selectedAccount, globalConfig } = useAccountContext();
  const { t } = useTranslate();
  const INVOICES_SCREEN = type === PATHS.invoices;
  const CREDITS_SCREEN = type === PATHS.credits;
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [billDates, setBillDates] = useState({});
  const [therapy, setTherapy] = useState(null);
  const { controlRef } = useContext(FooterContext);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const locationParams = useLocation();
  const showCardView = useResponsiveView();
  const [alert, setAlert] = React.useState(null);
  const { state = {} } = locationParams;
  const pageType = state.pageType;
  const { invoices = [], selectedCredit = [] } = state || {};
  const source = invoices[0] || selectedCredit[0];
  const onBackToPaymentsInvoices = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (source?.scheduled === 'X') {
      setAlert({
        description: t('paymentInvoices.instruction.scheduled.text', {}),
        type: 'info'
      });
    } else if (!CommonUtils.enableReviewAndPay(selectedAccount)) {
      setAlert({
        description: t('paymentInvoices.instruction.5040.text', {
          contact_no: CommonUtils.formatSupportNumber(globalConfig?.supportContactNumber || '')
        }),
        type: 'info'
      });
    } else {
      setAlert(null);
    }
  }, [selectedAccount, source?.scheduled]);

  const { mutate: handleOnClickOrderId } = useMutation(
    async (orderId) => {
      return OrderService.getBackendOrderId(orderId);
    },
    {
      onSuccess: (data) => {
        navigate(`/orders/${data}/summary`, {
          state: {
            backToInvoiceDetails: true
          }
        });
      },
      onError: (error) => {
        const { response } = error;
        let errorMsg = response?.data?.message || 'Error fetching order details';
        console.log(errorMsg);
      }
    }
  );

  const { isLoading, data } = useQuery({
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
          setInvoiceDetails(() => {
            if (!res?.data) return {};

            const baseDetails = {
              [t('paymentInvoices.Details.invoiceNumber')]: res.data.billNumber,
              [t('paymentInvoices.Details.PaymentTerm')]: res.data.paymentTerm,
              [t('paymentInvoices.Details.orderID')]: (
                <Link
                  className="MCP-table-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOnClickOrderId(res?.data?.orderId);
                  }}>
                  {res?.data?.orderId || '-'}
                </Link>
              ),
              [t('paymentInvoices.Details.billTo')]: res.data.billToAccountName
            };

            if (res.data?.mrnRequirement === null || res.data.mrnRequirement === 'NOT_REQUIRED') {
              return {
                ...baseDetails,
                [t('paymentInvoices.Details.purchaseOrderNumber')]: res.data.poNumber,
                [t('paymentInvoices.Details.shipTo')]: res.data.shipToAccountName,
                [t('paymentInvoices.Details.manufacturerPatientId')]: res.data.manufacturerPatientId,
                [t('paymentInvoices.Details.dateOfAdministration')]: CommonUtils.convertDateStringFormat(
                  res.data.dateOfAdministration,
                  'MM/DD/YYYY',
                  'DD/MM/YYYY'
                )
              };
            }
            return {
              ...baseDetails,
              [t('paymentInvoices.Details.MRN')]: res.data.medicalRecordNumber || '-',
              [t('paymentInvoices.Details.shipTo')]: res.data.shipToAccountName,
              [t('paymentInvoices.Details.purchaseOrderNumber')]: res.data.poNumber,
              [t('paymentInvoices.Details.dateOfAdministration')]: CommonUtils.convertDateStringFormat(
                res.data.dateOfAdministration,
                'MM/DD/YYYY',
                'DD/MM/YYYY'
              ),
              [t('paymentInvoices.Details.manufacturerPatientId')]: res.data.manufacturerPatientId,
              ['__z0']: null
            };
          });
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
          [t('paymentInvoices.credits.table.credit.date')]: CommonUtils.convertDateStringFormat(res.data.dueDate, 'MM/DD/YYYY', 'DD/MM/YYYY')
        };
    setBillDates(_invoiceDue);
  };

  const { mutate: handleDownload } = useMutation(
    async () => {
      const url = `${ApiRoutes.INVOICES_CREDITS_DETAILS(selectedAccount?.id, source.billNumber)}/details-pdf`;
      const body = {
        fiscalYear: source.fiscalYear,
        companyCode: selectedAccount.companyCode,
        documentNo: source.billNumber
      };
      const headers = {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json;charset=UTF-8'
      };
      const response = await HttpResourceService.callRest(url, httpVerb.POST, body, headers, null, null, null, 'blob');

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;

      const disposition = response.headers['content-disposition'];
      const match = disposition?.match(/filename="?([^"]+)"?/);
      const filename = match ? match[1] : 'invoice.pdf';

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    },
    {
      onSuccess: () => {},
      onError: () => {}
    }
  );

  const columns = useMemo(
    () => [
      {
        name: t('paymentInvoices.Details.lineNumber'),
        id: 'item',
        selector: (row) => `${row.item}`,
        wrap: true,
        minWidth: '80px',
        cell: (props) => <div className="cellEllipse">{parseInt(props.item, 10) || '-'}</div>
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
              {CommonUtils.removeLeadingZeros(props?.therapyId) || '-'}
            </Link>
          </div>
        )
      },
      {
        name: t('labels.tradeName'),
        id: 'tradeName',
        selector: (row) => {
          row.tradeName;
        },
        wrap: true,
        minWidth: '180px',
        cell: (props) => <div className="cellEllipse">{props.tradeName || '-'}</div>
      },
      {
        name: t('paymentInvoices.Details.Quantity'),
        id: 'quantity',
        selector: (row) => {
          row.quantity;
        },
        wrap: true,
        minWidth: '80px',
        cell: (props) => <div className="cellEllipse">{props.quantity || '-'}</div>
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
        name: t('paymentInvoices.Details.unitAmount'),
        id: 'unitPrice',
        selector: (row) => {
          row.unitPrice;
        },
        wrap: true,
        right: true,
        minWidth: '150px',
        cell: (props) => (
          <div className="cellEllipse align-items-right">
            <FormattedNumber value={props.unitPrice || 0} style="currency" currency="USD" />
          </div>
        )
      },
      {
        name: t('paymentInvoices.Details.netAmount'),
        id: 'netPrice',
        selector: (row) => {
          row.netPrice;
        },
        wrap: true,
        right: true,
        minWidth: '150px',
        cell: (props) => (
          <div className="cellEllipse align-items-right">
            <FormattedNumber value={JSON.stringify(props.netPrice)} style="currency" currency="USD" />
          </div>
        )
      },
      {
        name: t('paymentInvoices.Details.taxAmount'),
        id: 'taxAmount',
        selector: (row) => {
          row.taxAmount;
        },
        wrap: true,
        right: true,
        minWidth: '150px',
        cell: (props) => (
          <div className="cellEllipse align-items-right">
            <FormattedNumber value={JSON.stringify(props.taxAmount)} style="currency" currency="USD" />
          </div>
        )
      },
      {
        name: t('paymentInvoices.Details.grossAmount'),
        id: 'grossPrice',
        selector: (row) => {
          row.grossPrice;
        },
        minWidth: '150px',
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
  const getBackLinkLabel = () => {
    if (locationParams?.state?.reviewPay) {
      return t('paymentInvoices.Details.backToReviewAndPay');
    } else if (pageType) {
      return t(`paymentInvoices.Details.${pageType}`);
    } else if (INVOICES_SCREEN) {
      return t('paymentInvoices.Details.backToManageInvoices');
    } else if (CREDITS_SCREEN) {
      return t('paymentInvoices.Details.backToManageCredits');
    } else {
      return 'go back';
    }
  };

  return (
    <div className="view-details-container">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={onBackToPaymentsInvoices} size="md">
          {getBackLinkLabel()}
        </Button>
      </div>
      <Heading as="h1">
        {INVOICES_SCREEN ? t('paymentInvoices.Details.Invoice') : t('paymentInvoices.Details.Credit')} - {`#${billNumber}` || '#'}
      </Heading>
      {alert && (
        <div>
          <Alert description={alert?.description} type={alert?.type} onClose={() => setAlert(null)} />
        </div>
      )}
      <div className="details-card-wrapper">
        <div className="details-card-container">
          {CommonUtils.isNonEmptyObject(selectedAccount) && (
            <div className="account-info">
              <div className="account-name">{CommonUtils.isNonEmptyString(selectedAccount?.accountName) ? selectedAccount?.accountName : ''}</div>
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
        <History billNumber={billNumber} />
      </div>
      {INVOICES_SCREEN && <div className="finance-label">{t('paymentInvoices.Details.financeCharges')}</div>}

      {!CREDITS_SCREEN && !locationParams?.state?.reviewPay && !pageType && (
        <React.Fragment>
          {CommonUtils.enableReviewAndPay(selectedAccount) && (
            <div className="footer-wrapper" ref={controlRef}>
              <div className="controls footer-controls">
                {data?.pdfIndicator && (
                  <Button size="md" variant="secondary" onClick={handleDownload}>
                    {t('paymentInvoices.Details.btnDownloadPdf')}
                  </Button>
                )}
                <Button
                  size="md"
                  variant="primary"
                  type="submit"
                  disabled={source.scheduled === 'X'}
                  onClick={() => {
                    navigate(`/record/invoices/reviewPayments`, { state: { ...locationParams.state, reviewPay: true } });
                  }}>
                  {t('paymentInvoices.Details.ReviewAndPay')}
                </Button>
              </div>
            </div>
          )}
        </React.Fragment>
      )}
      {open && (
        <TherapyDetails
          therapyId={therapy}
          onSelect={() => {}}
          onClose={() => setOpen(!open)}
          therapyData={TherapyDetailsConstantsForBB(true)}
          showFooter={false}
          heading={t('labels.therapyDetails')}
          useUserService={true}
        />
      )}
    </div>
  );
}

Details.propTypes = {};

export default Details;
