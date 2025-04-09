import React, { useState } from 'react';
import { Button, Loader, Tooltip } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/cross-red.svg';
import { usePendingPayments } from '../../context/PendingPaymentsContext';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { FormattedNumber } from 'react-intl';
import { PATHS } from '../../routes';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';
import CommonUtils from '@src/util/CommonUtils';
import { renderModal } from '@src/util/ModalUtil';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useAccountContext } from '../../context/AccountContext';
import useSnackbar from '@src/hooks/useSnackbar';
import dayjs from 'dayjs';

export default function PendingPaymentTable() {
  const { t } = useTranslate();
  const { data, isFetching, paginationConfig, setPageNumber, applySort, isError, refetch } = usePendingPayments();
  const { selectedAccount } = useAccountContext();
  const showCardView = useResponsiveView();
  const { showSnackbar } = useSnackbar();

  const columns = [
    {
      id: 'confirmationNo',
      name: t('pendingPayments.table.confirmationNumber'),
      selector: (row) => `${row.confirmationNo}`,
      sortable: true,
      wrap: true,
      minWidth: '210px',
      showInMobileHeader: true,
      cardHeader: true,
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{ color: 'var(--brand-color-primary)', fontWeight: '600', textDecoration: 'none' }}
            to={`/record/${PATHS.pendingPayments}/${props.confirmationNo}/confirmation`}
            state={{ ...props }}>
            {props.confirmationNo}
          </Link>
        </div>
      )
    },
    {
      id: 'paymentMethod',
      name: t('paymentInvoices.history.table.paymentMethod'),
      selector: (row) => row.paymentMethod,
      minWidth: '350px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{props.paymentMethod}</div>
    },
    {
      id: 'paymentInitiationDate',
      name: t('paymentInvoices.history.table.paymentInitiationDate'),
      selector: (row) => row.paymentInitiationDate,
      sortable: true,
      wrap: true,
      maxWidth: '160px',
      cell: (props) => CommonUtils.convertDateStringFormat(props.paymentInitiationDate, 'MM/DD/YYYY', 'DD/MM/YYYY')
    },
    {
      id: 'authorizedAmt',
      name: t('pendingPayments.table.totalAuthorizedPaymentAmt'),
      selector: (row) => row.authorizedAmt,
      minWidth: '305px',
      sortable: true,
      wrap: true,
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.authorizedAmt} style="currency" currency="USD" />
        </div>
      ),
      right: true
    },
    {
      name: t('paymentInvoices.history.table.Actions'),
      minWidth: '200px',
      sortable: false,
      wrap: true,
      center: true,
      isAction: true,
      cell: (props) => {
        const today = new Date().getTime();
        const payOnDate = new Date(dayjs(props.payOn, 'DD/MM/YYYY').format('MM/DD/YYYY')).getTime();
        const earliestDueDate = props.invoices?.reduce((min, inv) => {
          const date = dayjs(inv.dueDate, 'DD/MM/YYYY');
          return !min || date.isBefore(min) ? date : min;
        }, null);
        const dueDate = earliestDueDate?.valueOf();
        const isValidDate = payOnDate >= today && today <= dueDate;
        return (
          <Tooltip body={!isValidDate ? t('pendingPayments.cancel.tooltip') : ''}>
            <span>
              <Button
                className="cancel-button-control"
                variant="tertiary"
                Icon={() => <CrossIcon />}
                onClick={() => onCancelPaymentClick(props.confirmationNo)}
                size="md"
                disabled={!isValidDate}>
                {t('pendingPayments.table.cancelPayment')}
              </Button>
            </span>
          </Tooltip>
        );
      }
    }
  ];
  const handleSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.id) applySort({ sortBy: selectedColumn.id, sortOrder: sortDirection });
  };

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const onCancelPaymentClick = (confirmationNo) => {
    renderModal({
      title: t('messages.header.confirmation'),
      bodyContent: (
        <div className="MCP-modal-body">
          <p>{t('pendingPayments.table.confirmationDialogue')}</p>
        </div>
      ),
      footerActions: {
        cancel: {
          label: t('paymentInvoices.reviewPayments.cancel')
        },
        confirm: {
          label: t('paymentInvoices.reviewPayments.confirm'),
          action: () => {
            mutate({ confirmationNo });
          }
        }
      }
    });
  };

  const { mutate } = useMutation(
    async ({ confirmationNo }) => {
      const apiUrl = `${ApiRoutes.PENDING_PAYMENTS_LISTING(selectedAccount?.id)}/${selectedAccount.companyCode}/${confirmationNo}`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.DELETE, {});
      return res;
    },
    {
      onSuccess: (response) => {
        refetch();
        showSnackbar({ description: t('pendingPayments.cancel.success'), type: 'success' });
      },
      onError: (error) => {
        showSnackbar({ description: t('pendingPayments.cancel.failed'), type: 'error' });
      }
    }
  );

  return (
    <React.Fragment>
      {/* <DataTable columns={columns} rows={filteredData} responsive /> */}
      <CustomDataTable
        id="my-data-table"
        type="normal"
        columns={columns}
        data={data || []}
        onSortIconClick={handleSort}
        currentPage={paginationConfig.pageNumber}
        totalPageCount={paginationConfig.totalPages}
        pagination={true}
        totalRocords={paginationConfig.totalElements}
        handleChangePage={handleChangePage}
        recordsPerPage={paginationConfig.pageSize}
        paginationTotalRecorsMessage={t('orgManagement.results')}
        paginationRecordsPerPageMessage={t('orgManagement.per_page')}
        progressPending={isFetching}
        showCardView={showCardView}
        defaultExpandedCardView={false}
        noDataComponent={
          <EmptyDataTable
            isLoading={isFetching}
            image={EmptyDataImage}
            heading={t('pendingPayments.table.bankAccount.emptyData')}
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
