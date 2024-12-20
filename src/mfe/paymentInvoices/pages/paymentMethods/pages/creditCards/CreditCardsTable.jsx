import React, { useState } from 'react';
import DataTable from '@src/components/dataTable/DataTable';
import { ReactComponent as MasterCardLogo } from '@src/assets/svg/master_card_logo.svg';
import { ReactComponent as VisaLogo } from '@src/assets/svg/visa_logo.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { usePaymentMethods } from '@src/mfe/paymentInvoices/context/PaymentMethodsContext';
import { FinanceUtils } from '@src/util/FinanceUtil';

const CARD_TYPES = {
  VISA: 'VISA',
  MASTER_CARD: 'MASTER_CARD',
};

export default function CreditCardsTable() {
  const { t } = useTranslate();
  const { cardsData } = usePaymentMethods();

  const columns = [
    {
      name: t('paymentInvoices.paymentMethods.table.cards.cardType'),
      selector: (row) => row.type,
      sortable: true,
      wrap: true,
      minWidth: '112px',
      cell: (props) => <div>{props.type === CARD_TYPES.VISA ? <VisaLogo /> : <MasterCardLogo />}</div>
    },
    {
      name: t('paymentInvoices.paymentMethods.table.cards.nameOnCard'),
      selector: (row) => row.holderName,
      sortable: true,
      wrap: true,
      minWidth: '160px',
      cell: (props) => <div>{props.holderName}</div>
    },
    {
      name: t('paymentInvoices.paymentMethods.table.cards.cardNumber'),
      selector: (row) => row.number,
      sortable: true,
      wrap: true,
      minWidth: '160px',
      cell: (props) => <div className="cellEllipse">{FinanceUtils.maskCardNumber(props.number)}</div>
    },
    {
      name: t('paymentInvoices.paymentMethods.table.cards.cardValidity'),
      selector: (row) => row.expirationDate,
      sortable: true,
      wrap: true,
      minWidth: '144px',
      cell: (props) => <div>{props.expirationDate}</div>
    },
    {
      name: t('paymentInvoices.paymentMethods.table.cards.zipCode'),
      selector: (row) => row.postalCode,
      sortable: true,
      wrap: true,
      minWidth: '168px',
      cell: (props) => <div>{props.postalCode}</div>
    }
    // {
    //   name: t('paymentInvoices.paymentMethods.table.cards.action'),
    //   selector: () => {},
    //   minWidth: '80px',
    //   cell: () => (
    //     <div>
    //       <button style={{ background: 'transparent', border: 'none' }}>
    //         <i className="more-icon" />
    //       </button>
    //     </div>
    //   )
    // }
  ];

  const handleSortClick = (column, sortDirection) => {
    console.log('column', filteredData, column);
    const sortedData = filteredData.sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[column.selector] > b[column.selector] ? 1 : -1;
      } else {
        return a[column.selector] < b[column.selector] ? 1 : -1;
      }
    });
    // setFilteredData([...sortedData]);
  };

  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        rows={cardsData}
        responsive
        handleSortClick={handleSortClick}
        noDataComponent={t('message.emptyTableTitle')}
      />
    </React.Fragment>
  );
}
