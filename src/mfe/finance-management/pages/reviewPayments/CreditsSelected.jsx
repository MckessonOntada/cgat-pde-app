import React, { useEffect, useState } from 'react';
import { Badge, Button, Loader } from '@mckesson/mcp-component-library';
import { Link, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as PDFicon } from '../../../../assets/svg/office-file-pdf.svg';
import { usePaymentCredits } from '../../context/PaymentsCreditsContext';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { FormattedNumber } from 'react-intl';
import CommonUtils from '@src/util/CommonUtils';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';

function CreditsSelected(props) {
  const { t } = useTranslate();
  const [data, setData] = useState([]);
  const location = useLocation();
  const { state } = location;
  const { creditsSelected } = state;
  const showCardView = useResponsiveView();
  useEffect(() => {
    if (creditsSelected?.length > 0) {
      setData(creditsSelected);
    }
  }, [creditsSelected]);

  const columns = [
    {
      id: 'billNumber',
      name: t('paymentInvoices.history.table.bill.id'),
      selector: (row) => `${row.billNumber}`,
      wrap: true,
      minWidth: '112px',
      showInMobileHeader: true,
      showColumnNameInHeader: true,
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{ color: 'var(--brand-color-primary)', fontWeight: '600', textDecoration: 'none' }}
            to={`/record/${PATHS.credits}/${props?.billNumber}/details`}>
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
      wrap: true,
      cell: (props) => <div>{props?.soldToSite || '-'}</div>
    },
    {
      id: 'description',
      name: t('paymentInvoices.credits.table.description'),
      selector: (row) => row.description,
      minWidth: '320px',
      wrap: true,
      showInMobileHeader: true,
      cardHeader: true,
      cell: (props) => (
        <div>
          <EclipsesTextcss str={props?.description} maxWidth={280} />
        </div>
      )
    },
    {
      id: 'billDate',
      name: t('paymentInvoices.credits.table.billDate'),
      selector: (row) => row.billDate,
      wrap: true,
      minWidth: '160px',
      cell: (props) => (
        <EclipsesTextcss
          className="cellEllipse"
          str={CommonUtils.convertDateStringFormat(props?.billDate, 'MM/DD/YYYY', 'DD/MM/YYYY')}
          maxWidth={240}
        />
      )
    },
    {
      id: 'dueDate',
      name: t('paymentInvoices.credits.table.validfrom'),
      selector: (row) => row.dueDate,
      wrap: true,
      minWidth: '160px',
      cell: (props) => (
        <EclipsesTextcss
          className="cellEllipse"
          str={CommonUtils.convertDateStringFormat(props?.dueDate, 'MM/DD/YYYY', 'DD/MM/YYYY')}
          maxWidth={240}
        />
      )
    },
    {
      id: 'billAmount',
      name: t('paymentInvoices.credits.table.amount'),
      selector: (row) => row.openAmount,
      minWidth: '144px',
      wrap: true,
      cell: (props) => (
        <div className="status-container align-items-right">
          <FormattedNumber value={props?.openAmount} style="currency" currency="USD" />
        </div>
      ),
      right: true
    }
  ];

  return (
    <React.Fragment>
      <CustomDataTable
        id="my-data-table"
        type="normal"
        columns={columns.filter((col) => !props.excludedColumns?.includes(col.id))}
        data={data || []}
        showCardView={showCardView}
        defaultExpandedCardView={false}
        noDataComponent={
          <EmptyDataTable
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
