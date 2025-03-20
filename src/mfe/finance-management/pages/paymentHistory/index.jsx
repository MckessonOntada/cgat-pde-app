import React, { useEffect, useMemo, useState } from 'react';
import Filters from './Filters';
import PaymentHistoryTable from './PaymentHistoryTable';
import './index.scss';
import { Button, Heading } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';
import { usePaymentHistory } from '../../context/PaymentHistoryContext';
import { useTranslate } from '@src/translations/useTranslation';
import dayjs from 'dayjs';
import ModuleHeader from '@src/components/module-header';
import CommonUtils from '@src/util/CommonUtils';
import { DUE_STATUS } from '../invoices/InvoiceConstants';

export default function PaymentHistory(params) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, actualData, exportPDF } = usePaymentHistory();

  const [statusOptions, setStatusOptions] = useState([]);
  const [methodOptions, setMethodOptions] = useState([]);

  useEffect(() => {
    if (!CommonUtils.isNonEmptyObject(statusOptions)) {
      updateOptions('paymentStatus', setStatusOptions);
    }
    if (!CommonUtils.isNonEmptyObject(methodOptions)) {
      updateOptions('paymentMethod', setMethodOptions);
    }
  }, [actualData]);

  const updateOptions = (key, setState) => {
    let currentFilterData = [...new Set(actualData.map((e) => e[key]).filter((e) => e))];
    let _options = currentFilterData.map((item) => {
      return { value: item, label: item, isDisabled: false };
    });
    setState([..._options]);
  };

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'multiSelectDropdown',
        name: 'paymentStatus',
        // tableColumnId: 'paymentStatus',
        label: t('paymentInvoices.history.filters.status'),
        options: statusOptions,
        getUpdatedOptions: (e) => {
          if (e.length > 0) {
            setStatusOptions(e);
          }
        }
      },
      {
        type: 'multiSelectDropdown',
        name: 'paymentMethod',
        label: t('paymentInvoices.history.filters.method'),
        options: methodOptions,
        getUpdatedOptions: (e) => {
          if (e.length > 0) {
            setMethodOptions(e);
          }
        }
      },
      {
        type: 'dateRangePicker',
        name: 'dateRange',
        startDateLabel: t('paymentInvoices.pendingPayments.filter.initiationDateStart'),
        endDateLabel: t('paymentInvoices.pendingPayments.filter.initiationDateEnd'),
        minDate: dayjs().subtract(180, 'days').toDate(),
        maxDate: new Date()
      }
    ];
  }, [statusOptions, methodOptions]);

  return (
    <React.Fragment>
      <div className="MCP-CardContainer">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={AdditionalFiltersConfig}
          searchPlaceholder={t('paymentInvoices.history.filters.autoSearch')}
        />
      </div>
      <ModuleHeader
        heading={<Heading as="h2">{t('paymentInvoices.table.paymentHistory')}</Heading>}
        controls={
          <div className="table-header">
            <Button
              variant="secondary"
              onClick={() => {
                exportPDF();
              }}
              size="sm">
              {t('paymentInvoices.CS.ExportExcel')}
            </Button>
          </div>
        }
      />
      <PaymentHistoryTable />
    </React.Fragment>
  );
}
