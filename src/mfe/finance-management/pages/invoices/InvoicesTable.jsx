import React, { useState } from 'react';
import { Badge, Button, CustomDataTable, Loader } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { usePaymentInvoices } from '../../context/PaymentsInvoicesContext';
import { FormattedNumber } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as ActionIcon } from '@src/assets/image/actionIcon.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import dayjs from 'dayjs';
import { DUE_STATUS } from './InvoiceConstants';
import { PATHS } from '../../routes';
import CommonUtils from '@src/util/CommonUtils';

export default function InvoicesTable() {
  const { t } = useTranslate();
  const [includeinvoiceData, setIncludeinvoiceData] = useState([]);
  const navigate = useNavigate();
  const { data, isFetching, paginationConfig, setPageNumber, applySort, isError } = usePaymentInvoices();

  const getindeterminate = () => {
    const allDataIncluded = data.every((invoice) =>
      includeinvoiceData.some((includedInvoice) => includedInvoice.billNumber === invoice.billNumber)
    );
    return allDataIncluded;
  };
  const renderCheckBox = (row, index) => {
    return (
      <input
        data-testid="rowcheckbox"
        type="checkbox"
        id={'checkbox' + row?.id}
        disabled={isCheckboxDisabled(row)}
        onChange={() => handleRowSelected(row)}
        checked={isChecked(row)}
        ref={(el) => {
          if (el) {
            el.indeterminate =
              row.id === 'ALL_PATIENTS_' + paginationConfig.pageNumber && includeinvoiceData.length > 0 && !getindeterminate();
          }
        }}
      />
    );
  };
  const isChecked = (row) => {
    if (row.id === 'ALL_PATIENTS_' + paginationConfig.pageNumber) {
      return getindeterminate();
    }
    let availableRow = includeinvoiceData.find((item) => item.billNumber === row?.billNumber);
    return !!availableRow;
  };
  const isAllChecked = () => {
    return includeinvoiceData.length === data.length;
  };
  const isCheckboxDisabled = (row) => {
    let isDisbled = row.id === 'ALL_PATIENTS_' + paginationConfig.pageNumber && !CommonUtils.isNonEmptyArray(data);
    return isDisbled;
  };
  const handleRowSelected = (data) => {
    if (data.id === 'ALL_PATIENTS_' + paginationConfig.pageNumber) {
      handleHeaderCheck(data);
    } else {
      handleIndividualCheck(data);
    }
  };
  const handleIndividualCheck = (data) => {
    if (includeinvoiceData.find((item) => item.billNumber === data?.billNumber)) {
      setIncludeinvoiceData(includeinvoiceData.filter((item) => item.billNumber !== data?.billNumber));
      return;
    }
    setIncludeinvoiceData([...includeinvoiceData, ...[data]]);
  };
  const handleHeaderCheck = () => {
    if (isAllChecked()) {
      setIncludeinvoiceData([]);
    } else {
      if (paginationConfig.pageNumber === 1) {
        setIncludeinvoiceData(data);
      } else {
        const allDataIncluded = data.every((invoice) =>
          includeinvoiceData.some((includedInvoice) => includedInvoice.billNumber === invoice.billNumber)
        );
        if (!allDataIncluded) {
          setIncludeinvoiceData([...includeinvoiceData, ...data]);
        } else {
          setIncludeinvoiceData(includeinvoiceData.filter((item) => !data.some((invoice) => invoice.billNumber === item.billNumber)));
        }
      }
    }
  };

  const columns = [
    {
      id: 'checkbox',
      name: renderCheckBox({ id: 'ALL_PATIENTS_' + paginationConfig.pageNumber }),
      sortable: false,
      cell: (row, index) => renderCheckBox(row, index),
      selector: (row) => row.MRN,
      width: '48px'
    },
    {
      name: t('paymentInvoices.history.table.billNumber'),
      id: 'billNumber',
      selector: (row) => `${row.billNumber}`,
      sortable: true,
      wrap: true,
      minWidth: '112px',
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}
            to={`/record/${PATHS.invoices}/${props?.billNumber}/details`}
            state={{ invoices: [...[], props] }}>{`${props?.billNumber || ''}`}</Link>
        </div>
      )
    },
    {
      id: 'soldToSite',
      name: t('paymentInvoices.history.table.SoldToSite'),
      selector: (row) => row.soldToSite,
      minWidth: '160px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{props?.soldToSite || '-'}</div>
    },
    {
      name: t('paymentInvoices.history.table.PostingDate'),
      selector: (row) => row.billDate,
      sortable: true,
      id: 'billDate',
      wrap: true,
      minWidth: '160px',
      cell: (props) => (
        <EclipsesTextcss className="cellEllipse" str={dayjs(props?.billDate, 'DD/MM/YYYY')?.format('MM/DD/YYYY') || '-'} maxWidth={240} />
      )
    },
    {
      name: t('paymentInvoices.history.table.PaymentTerm'),
      selector: 'paymentTerm',
      minWidth: '144px',
      id: 'paymentTerm',
      wrap: true,
      cell: (props) => <div className="status-container">{props?.paymentTerm}</div>
    },
    {
      name: t('paymentInvoices.history.table.DueDate'),
      selector: (row) => row.dueDate,
      minWidth: '168px',
      sortable: true,
      wrap: true,
      id: 'dueDate',
      cell: (props) => <div className="cellEllipse">{dayjs(props?.dueDate, 'DD/MM/YYYY')?.format('MM/DD/YYYY') || '-'}</div>
    },
    {
      name: t('paymentInvoices.history.table.OpenAmount'),
      selector: (row) => row.openAmount,
      minWidth: '144px',
      sortable: true,
      wrap: true,
      id: 'openAmount',
      cell: (props) => (
        <div className="cellEllipse align-items-right ">
          <FormattedNumber value={props?.openAmount || 0} style="currency" currency="USD" />
        </div>
      ),
      right: true
    },
    {
      name: t('paymentInvoices.history.table.status'),
      selector: (row) => row.status,
      minWidth: '170px',
      sortable: true,
      center: true,
      wrap: true,
      id: 'status',
      cell: (props) => (
        <div className="status-container">
          {props?.status ? (
            <Badge
              text={DUE_STATUS[props?.status].label}
              type={'info-default'}
              customStyle={{ color: `${DUE_STATUS[props?.status].color}`, border: `1px solid ${DUE_STATUS[props?.status].color}` }}
            />
          ) : (
            '-'
          )}
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.BillAmount'),
      selector: (row) => row?.billAmount,
      minWidth: '140px',
      sortable: true,
      right: true,
      id: 'billAmount',
      cell: (props) => (
        <div className="cellEllipse align-items-right ">
          <FormattedNumber value={props?.billAmount || 0} style="currency" currency="USD" />
        </div>
      )
    }
    // {
    //   name: t('paymentInvoices.history.table.Actions'),
    //   minWidth: '144px',
    //   sortable: true,
    //   id: 'actions',
    //   wrap: true,
    //   cell: (props) => (
    //     <div className="cellEllipse actionIcon">
    //       <DropdownMenu
    //         anchorEl={<ActionIcon />}
    //         handleSelect={() => {}}
    //         options={dataElement}
    //         optionsAlign="left"
    //         aria-label="Profile options"
    //       />
    //     </div>
    //   )
    // }
  ];
  const handleSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.id) applySort({ sortBy: selectedColumn.id, sortOrder: sortDirection });
  };

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };
  return (
    <React.Fragment>
      {includeinvoiceData.length > 0 && (
        <div className="selected-invoices">
          <div className="label">{`${includeinvoiceData.length} ${t('paymentInvoices.history.table.selectedAccount')}`}</div>
          <Button
            variant="secondary"
            onClick={() => {
              navigate(`/record/invoices/reviewPayments`, { state: { invoices: includeinvoiceData, reviewPay: true } });
            }}
            size="sm">
            {t('paymentInvoices.Details.ReviewAndPay')}
          </Button>
        </div>
      )}

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
        noDataComponent={
          <EmptyDataTable
            isLoading={isFetching}
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
