import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import CreditsTable from './CreditsTable';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';
import { usePaymentCredits } from '../../context/PaymentsCreditsContext';

export default function Credits(props) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, actualData, exportExcel } = usePaymentCredits();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'dateRangePicker',
        name: 'billDate',
        startDateLabel: t('paymentInvoices.invoicesTable.filter.validFromStart'),
        endDateLabel: t('paymentInvoices.invoicesTable.filter.validFromEnd')
      },
      {
        type: 'dateRangePicker',
        name: 'dueDate',
        startDateLabel: t('paymentInvoices.invoicesTable.filter.dueDateStart'),
        endDateLabel: t('paymentInvoices.invoicesTable.filter.dueDateEnd')
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
          searchPlaceholder={t('paymentInvoices.filter.searchByBill')}
          actualData={actualData}
        />
      </div>

      <div className="MCP-table-wrapper credit-table-container">
        {!props.selectableRows && (
          <div className="table-header">
            <Button variant="secondary" onClick={() => exportExcel()} size="sm">
              {t('paymentInvoices.CS.ExportExcel')}
            </Button>
          </div>
        )}
        <CreditsTable
          selectedRows={props.selectedCredits}
          setSelectedRows={props.setSelectedCredits}
          selectableRows={props.selectableRows}
        />
      </div>
    </React.Fragment>
  );
}
