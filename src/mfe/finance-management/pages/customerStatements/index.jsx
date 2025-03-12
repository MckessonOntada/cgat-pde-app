import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import './index.scss';
import { Button, Heading } from '@mckesson/mcp-component-library';
import CustomerStatementTable from './CustomerStatementTable';
import { useTranslate } from '@src/translations/useTranslation';
import { useCustomerStatements } from '../../context/CustomerStatementsContext';
import dayjs from 'dayjs';
import ApiRoutes from '@src/api/ApiRoutes';
import { useAccountContext } from '../../context/AccountContext';
import { GeographicUtils } from '@src/util/GeographicUtil';
import ModuleHeader from '@src/components/module-header';

export default function CustomerSatements(params) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, actualData, filterConfig, exportPDF } = useCustomerStatements();
  const { selectedAccount } = useAccountContext();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'dateRangePicker',
        name: 'dateRange',
        minDate: dayjs().subtract(180, 'days').toDate(),
        maxDate: new Date()
      }
    ];
  }, []);

  const onExportStatements = () => {
    exportPDF(
      `${ApiRoutes.EXPORT_CUSTOMER_STATEMENTS_EXCEL(selectedAccount.accountNumber)}`,
      {
        companyCode: selectedAccount?.companyCode,
        salesOrg: selectedAccount?.salesOrg,
        payerAccountNumber: selectedAccount?.accountNumber,
        filter: {
          searchTerm: filterConfig.searchQuery
        },
        excelMetaDataDTO: {
          accountNumber: selectedAccount?.accountNumber,
          name: selectedAccount?.accountName,
          address: GeographicUtils.addressAggregator(selectedAccount)
        },
        dateFrom: dayjs(filterConfig.dateRange[0], 'MM/DD/YYYY').format('DD/MM/YYYY') || null,
        dateTo: dayjs(filterConfig.dateRange[1], 'MM/DD/YYYY').format('DD/MM/YYYY') || null
      },
      'xlsx'
    );
  };

  return (
    <React.Fragment>
      <div className="MCP-CardContainer">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={AdditionalFiltersConfig}
          searchPlaceholder={t('paymentInvoices.CS.filters.autoSearch')}
          actualData={actualData}
        />
      </div>
      <div className="MCP-table-wrapper">
        <ModuleHeader
          heading={<Heading as="h2">{t('paymentInvoices.table.customerStatement')}</Heading>}
          controls={
            <div className="table-header">
              <Button variant="secondary" onClick={() => onExportStatements()} size="sm">
                {t('paymentInvoices.CS.ExportExcel')}
              </Button>
            </div>
          }
        />
        <CustomerStatementTable />
      </div>
    </React.Fragment>
  );
}
