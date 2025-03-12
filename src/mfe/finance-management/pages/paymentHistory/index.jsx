import React, { useMemo } from 'react';
import Filters from './Filters';
import PaymentHistoryTable from './PaymentHistoryTable';
import './index.scss';
import { Button, Heading } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';
import { usePaymentHistory } from '../../context/PaymentHistoryContext';
import { useTranslate } from '@src/translations/useTranslation';
import dayjs from 'dayjs';
import ModuleHeader from '@src/components/module-header';

export default function PaymentHistory(params) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, actualData, exportPDF } = usePaymentHistory();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'multiSelectDropdown',
        name: 'paymentStatus',
        tableColumnId: 'paymentStatus',
        label: t('paymentInvoices.history.filters.status'),
        options: []
      },
      {
        type: 'multiSelectDropdown',
        name: 'paymentMethod',
        tableColumnId: 'paymentMethod',
        label: t('paymentInvoices.history.filters.method'),
        options: []
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
  }, []);

  return (
    <React.Fragment>
      <div className="MCP-CardContainer">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={AdditionalFiltersConfig}
          searchPlaceholder={t('paymentInvoices.history.filters.autoSearch')}
          actualData={actualData}
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
