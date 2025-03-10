import React from 'react';
import EmptyDataTable from '@src/components/EmptyTable';
import { ReactComponent as MasterCardLogo } from '@src/assets/svg/master_card_logo.svg';
import { ReactComponent as VisaLogo } from '@src/assets/svg/visa_logo.svg';
import { Loader } from '@mckesson/mcp-component-library';
import { usePaymentMethods } from '@src/mfe/finance-management/context/PaymentMethodsContext';
import { useTranslate } from '@src/translations/useTranslation';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { FinanceUtils } from '@src/util/FinanceUtil';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';
import CommonUtils from '@src/util/CommonUtils';

const CARD_TYPES = {
  VISA: 'VISA',
  MASTER_CARD: 'MASTER_CARD'
};

export default function CreditCardsTable() {
  const { t } = useTranslate();
  const { cardsData, isFetching, isError, applyCardsSort, cardsPaginationConfig, setCardsTablePageNumber } = usePaymentMethods();
  const showCardView = useResponsiveView();
  const columns = [
    {
      id: 'type',
      name: t('paymentInvoices.paymentMethods.table.cards.cardType'),
      selector: (row) => row.type,
      sortable: true,
      wrap: true,
      width: '140px',
      cell: (props) => (
        <div style={{ width: '66px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {props.type === CARD_TYPES.VISA ? <VisaLogo /> : <MasterCardLogo />}
        </div>
      )
    },
    {
      id: 'holderName',
      name: t('paymentInvoices.paymentMethods.table.cards.nameOnCard'),
      selector: (row) => row.holderName,
      sortable: true,
      wrap: true,
      minWidth: '160px',
      showInMobileHeader: true,
      showColumnNameInHeader: true,
      cell: (props) => <div>{props.holderName}</div>
    },
    {
      id: 'number',
      name: t('paymentInvoices.paymentMethods.table.cards.cardNumber'),
      selector: (row) => row.number,
      sortable: true,
      wrap: true,
      minWidth: '160px',
      showInMobileHeader: true,
      cardHeader: true,
      cell: (props) => <div className="cellEllipse">{FinanceUtils.maskCardNumber(props.number)}</div>
    },
    {
      id: 'expirationDate',
      name: t('paymentInvoices.paymentMethods.table.cards.cardValidity'),
      selector: (row) => row.expirationDate,
      sortable: true,
      wrap: true,
      width: '160px',
      cell: (props) => CommonUtils.convertDateStringFormat(props?.expirationDate, 'MM/DD/YYYY', 'DD/MM/YYYY')
    },
    {
      id: 'postalCode',
      name: t('paymentInvoices.paymentMethods.table.cards.zipCode'),
      selector: (row) => row.postalCode,
      sortable: true,
      wrap: true,
      width: '120px',
      cell: (props) => <div>{props.postalCode}</div>
    }
  ];

  const handleSortClick = (selectedColumn, sortDirection) => {
    if (selectedColumn.id) applyCardsSort({ sortBy: selectedColumn.id, sortOrder: sortDirection });
  };

  const handleChangePage = (e, newPage) => {
    setCardsTablePageNumber(newPage);
  };

  return (
    <React.Fragment>
      <CustomDataTable
        id="credit-cards-table"
        type="normal"
        columns={columns}
        data={cardsData || []}
        responsive
        onSortIconClick={handleSortClick}
        currentPage={cardsPaginationConfig.pageNumber}
        totalPageCount={cardsPaginationConfig.totalPages}
        pagination={true}
        totalRocords={cardsPaginationConfig.totalElements}
        handleChangePage={handleChangePage}
        recordsPerPage={cardsPaginationConfig.pageSize}
        paginationTotalRecorsMessage={t('orgManagement.results')}
        paginationRecordsPerPageMessage={t('orgManagement.per_page')}
        progressPending={isFetching}
        showCardView={showCardView}
        defaultExpandedCardView={false}
        noDataComponent={
          <EmptyDataTable
            isLoading={isFetching}
            // error={isError ? 'Something went wrong! Please try again' : null}
            image={EmptyDataImage}
            heading={t('paymentInvoices.paymentMethods.table.cards.emptyData')}
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
