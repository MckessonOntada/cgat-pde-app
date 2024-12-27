import React from 'react';
import { Button, Divider, Loader } from '@mckesson/mcp-component-library';
import InfoCards from '@src/components/infoCards/InfoCards';
import LinearSegmentChart from '@src/components/linearSegmentChart/LinearSegmentChart';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import { useBalanceContext } from '../context/BalanceContext';
import { useAccountContext } from '../context/AccountContext';

export default function BalanceDetails() {
  const { t } = useTranslate();
  const { balanceData, isMutating: isLoadingBalance } = useBalanceContext();
  const { selectedAccount } = useAccountContext();

  const formatBalanceData = (data) => {
    if (data) {
      const totalDebitBalance = data?.totalDebitBalance?.toFixed(2);
      const totalCreditBalance = data?.totalCreditBalance?.toFixed(2);
      const pastDueBalance = data?.pastDueBalance?.toFixed(2);
      const formattedData = [
        {
          label: t('paymentInvoices.metrics.totalDebitBalance'),
          value: `$${Math.abs(totalDebitBalance) || '0.00'}`,
          tooltipText: t('paymentInvoices.metrics.totalDebitBalance.tooltipText')
        },
        {
          label: t('paymentInvoices.metrics.totalCreditBalance'),
          value: `$${Math.abs(totalCreditBalance) || '0.00'}`,
          tooltipText: t('paymentInvoices.metrics.totalCreditBalance.tooltipText')
        },
        {
          label: t('paymentInvoices.metrics.pastDueBalance'),
          value: `$${Math.abs(pastDueBalance) || '0.00'}`,
          tooltipText: t('paymentInvoices.metrics.pastDueBalance.tooltipText')
        }
      ];
      return formattedData;
    }
  };

  const formatChartData = (data) => {
    if (data) {
      const formattedData = [
        { key: 'OVERDUE', label: t('paymentInvoices.balanceCard.1_30_DAYS_OVERDUE'), color: '#BED630' },
        { key: 'PLUS_31_DAYS_OVERDUE', label: t('paymentInvoices.balanceCard.31_60_DAYS_OVERDUE'), color: '#F7C91E' },
        { key: 'PLUS_61_DAYS_OVERDUE', label: t('paymentInvoices.balanceCard.61_90_DAYS_OVERDUE'), color: '#FF9839' },
        { key: 'PLUS_91_DAYS_OVERDUE', label: t('paymentInvoices.balanceCard.PLUS_91_DAYS_OVERDUE'), color: '#DB3A29' }
      ];

      return formattedData.map(({ key, label, color }) => ({
        label,
        segmentValue: Math.abs(data[key] || 0),
        color
      }));
    }
  };

  return CommonUtils.isNonEmptyObject(selectedAccount) ? (
    <div className="card-container">
      {isLoadingBalance ? (
        <Loader type="inline" variant="circular" />
      ) : (
        <div className="flex-switch">
          <div className="metrics-container">
            <div className="metrics">
              {formatBalanceData(balanceData).map((data, index) => (
                <div key={index} className="info-cards-container">
                  <InfoCards title={data.label} value={data.value} infoText={data.tooltipText} />
                </div>
              ))}
            </div>
            <div className="action-button">
              <Button size={'lg'} disabled={!CommonUtils.isNonEmptyObject(balanceData) || true}>
                {t('paymentInvoices.balanceCard.payNowBtn')}
              </Button>
            </div>
          </div>
          {!CommonUtils.isNonEmptyObject(balanceData) ? null : <Divider className="divider-style" />}
          {!CommonUtils.isNonEmptyObject(balanceData) ? null : (
            <div className="metrics-chart">
              <LinearSegmentChart data={formatChartData(balanceData.overDueAmountByStatus)} unit={'$'} />
            </div>
          )}
        </div>
      )}
    </div>
  ) : null;
}
