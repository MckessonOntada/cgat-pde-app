import React from 'react';
import { Heading, Loader, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { FormattedNumber } from 'react-intl';
import { CustomDataTable } from '@src/components/dataTableComponent';
import useResponsiveView from '@src/hooks/useResponsiveView';
import CommonUtils from '@src/util/CommonUtils';
import { ReactComponent as PDFicon } from '@src/assets/svg/office-file-pdf.svg';
import ApiRoutes from '@src/api/ApiRoutes';
import { useAccountContext } from '../../context/AccountContext';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';

const createColumns = (t, type, pageType, paymentInitiationDate, handlePdfDownload) => {
  const commonColumns = [
    {
      name: t('paymentInvoices.history.table.invoiceNumber'),
      id: 'billNumber',
      selector: (row) => `${row.billNo}`,
      sortable: true,
      wrap: true,
      minWidth: '112px',
      showInMobileHeader: true,
      showColumnNameInHeader: true,
      cell: (props) => <div className="cellEllipse">{props?.billNo || ''}</div>
    },
    {
      id: 'soldToSite',
      name: t('paymentInvoices.history.table.SoldToAccountNo'),
      selector: (row) => row.soldToSite,
      minWidth: '250px',
      sortable: true,
      wrap: true,
      cardHeader: true,
      showInMobileHeader: true,
      cell: (props) => <div>{props?.soldToAccountNumber || '-'}</div>
    }
  ];

  const invoiceColumns = [
    ...commonColumns,
    {
      name: t('paymentInvoices.history.table.invoiceDate'),
      selector: (row) => row.billDate,
      sortable: true,
      id: 'billDate',
      wrap: true,
      width: '150px',
      cell: (props) => <div className="cellEllipse">{CommonUtils.convertDateStringFormat(props?.billDate, 'MM/DD/YYYY', 'DD/MM/YYYY')}</div>
    },
    {
      name: t('paymentInvoices.history.table.DueDate'),
      selector: (row) => row.dueDate,
      width: '150px',
      sortable: true,
      wrap: true,
      id: 'dueDate',
      cell: (props) => <div className="cellEllipse">{CommonUtils.convertDateStringFormat(props?.dueDate, 'MM/DD/YYYY', 'DD/MM/YYYY')}</div>
    },
    {
      name: t('paymentInvoices.history.table.invoiceAmount'),
      selector: (row) => row?.billAmount,
      minWidth: '120px',
      sortable: true,
      right: true,
      id: 'billAmount',
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.billAmount || 0} style="currency" currency="USD" />
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.authorizedAmount'),
      selector: (row) => row?.authAmount,
      minWidth: '200px',
      sortable: true,
      right: true,
      id: 'authorizedPayment',
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.authAmount || 0} style="currency" currency="USD" />
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.Actions'),
      width: '150px',
      wrap: true,
      isAction: true,
      cell: (props) => (
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <PDFicon />}
          onClick={() => {
            handlePdfDownload(props);
          }}
          size="md"
          disabled={!props?.isPdfAvailable}>
          {t('paymentInvoices.Details.btnDownloadPdf')}
        </Button>
      )
    }
  ];

  const creditColumns = [
    ...commonColumns,
    {
      name: t('paymentInvoices.history.table.usedDate'),
      selector: (row) => row.usedDate,
      width: '150px',
      sortable: true,
      wrap: true,
      id: 'usedDate',
      cell: (props) => <div className="cellEllipse">{CommonUtils.convertDateStringFormat(paymentInitiationDate, 'MM/DD/YYYY', 'DD/MM/YYYY')}</div>
    },
    {
      name: t('paymentInvoices.credits.table.amount'),
      selector: (row) => row?.billAmount,
      minWidth: '150px',
      sortable: true,
      right: true,
      id: 'billAmount',
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.billAmount || 0} style="currency" currency="USD" />
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.creditUsed'),
      selector: (row) => row?.authAmount,
      minWidth: '180px',
      sortable: true,
      right: true,
      id: 'authAmount',
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.authAmount || 0} style="currency" currency="USD" />
        </div>
      )
    }
  ];

  return type === 'invoice' ? invoiceColumns : creditColumns;
};
function ConfirmationTable({ invoiceData, creditData, pageType, paymentInitiationDate }) {
  const { t } = useTranslate();
  const showCardView = useResponsiveView();
  const { selectedAccount } = useAccountContext();
  const { mutate: handlePdfDownload } = useMutation(
    async (props) => {
      const url = `${ApiRoutes.INVOICES_CREDITS_DETAILS(selectedAccount?.id, props.billNo)}/details-pdf`;
      const body = {
        fiscalYear: props.fiscalYear,
        companyCode: selectedAccount.companyCode,
        documentNo: props.billNo
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
      const filename = match ? match[1] : 'credit.pdf';

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    },
    {
      onSuccess: () => {
        showAlert({
          description: t('paymentInvoices.table.column.pdfDownload'),
          type: 'success',
          anchorEl: alertContainerId
        });
      },
      onError: (error) => {
        showAlert({
          description: t('errors.default'),
          type: 'error',
          anchorEl: alertContainerId
        });
      }
    }
  );

  return (
    <>
      <Heading as="h2" fontWeight="600">
        {t('paymentInvoices.table.confirmationInvoiceHeading')}
      </Heading>
      <div className="details-table">
        <CustomDataTable
          id="invoice-data-table"
          type="normal"
          columns={createColumns(t, 'invoice', pageType, paymentInitiationDate, handlePdfDownload)}
          data={invoiceData || []}
          onSortIconClick={() => {}}
          handleChangePage={() => {}}
          noDataComponent={'No invoice used in this payments'}
          showCardView={showCardView}
          defaultExpandedCardView={false}
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
      {creditData.length > 0 && (
        <>
          <Heading as="h2" fontWeight="600">
            {t('paymentInvoices.table.creditHeading')}
          </Heading>
          <div className="details-table">
            <CustomDataTable
              id="credit-data-table"
              type="normal"
              columns={createColumns(t, 'credit', pageType, paymentInitiationDate, handlePdfDownload)}
              data={creditData || []}
              onSortIconClick={() => {}}
              handleChangePage={() => {}}
              noDataComponent={'No credit used in this payments'}
              showCardView={showCardView}
              defaultExpandedCardView={false}
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
        </>
      )}
    </>
  );
}

export default ConfirmationTable;
