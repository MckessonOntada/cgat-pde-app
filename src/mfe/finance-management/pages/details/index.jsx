import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAccountContext } from '../../context/AccountContext';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
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
import { useMutation, useQuery } from 'react-query';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import TherapyDetails from '@src/components/therapyDetails/TherapyDetails';
import { TherapyDetailsConstantsForBB } from '@src/mfe/order-management/pages/create/form-segments/therapy-selection/assets/constants/TherapyDetailsConstants';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { FormattedNumber } from 'react-intl';
import { FooterContext } from '@src/components/footer/FooterContext';
import OrderService from '@src/api/commonService/OrderService';

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
  const searchParams = new URLSearchParams(location.search);
  const { controlRef } = useContext(FooterContext);

  const [open, setOpen] = useState(false);
  const therapyDetails = searchParams.get('therapy-details');
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
    if (!CommonUtils.enableReviewAndPay(selectedAccount)) {
      setAlert({
        description: t('paymentInvoices.instruction.5040.text', {
          contact_no: CommonUtils.formatSupportNumber(globalConfig?.supportContactNumber || '')
        }),
        type: 'info'
      });
    } else {
      setAlert(null);
    }
  }, [selectedAccount]);

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
            [t('paymentInvoices.Details.invoiceNumber')]: res.data.billNumber,
            [t('paymentInvoices.Details.billTo')]: res.data.billToAccountName,
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
            [t('paymentInvoices.Details.shipTo')]: res.data.shipToAccountName,
            [t('paymentInvoices.Details.purchaseOrderNumber')]: res.data.poNumber,
            ['']: <p></p>,
            [t('paymentInvoices.Details.PaymentTerm')]: res.data.paymentTerm
          }));
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
        name: t('paymentInvoices.Details.netPrice'),
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
      <Heading>
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
      </div>
      {INVOICES_SCREEN && <div className="finance-label">{t('paymentInvoices.Details.financeCharges')}</div>}

      {!CREDITS_SCREEN && !locationParams?.state?.reviewPay && !pageType && (
        <React.Fragment>
          {CommonUtils.enableReviewAndPay(selectedAccount) && (
            <div className="footer-wrapper" ref={controlRef}>
              <div className="controls footer-controls">
                <Button
                  size="md"
                  variant="primary"
                  type="submit"
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
