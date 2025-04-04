import React, { useState } from 'react';
import { paymentDetails } from '../../mockData/PaymentHistoryData';
import styles from '../../../order-management/pages/create/form-segments/therapy-selection/TherapyDetails.module.scss';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

function PaymentDetails() {
  const { t } = useTranslate();
  const [data, setData] = useState(paymentDetails);
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h6>{t('paymentInvoices.history.filters.paymentDetails')}</h6>
        <Button variant="tertiary" onClick={() => {}}>
          <IconClose />
        </Button>
      </div>
      <div className={styles.body}>
        {data?.map((detailItem, index) => {
          return (
            <div key={`${detailItem.label}_${index}`} className={styles.detailsPanel}>
              <p className={styles.panelHeading}>{detailItem.label}</p>
              {detailItem?.Children?.map((subItem, subIndex) => (
                <div key={`${subItem.label}_${subIndex}`} className={styles.detailItem}>
                  <p className={styles.fieldName}>{subItem.label}</p>
                  <p className={styles.fieldValue}>{subItem.value}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className={styles.header}>
        <Button variant="secondary" onClick={() => {}} size="md">
          {t('paymentInvoices.history.filters.printSummary')}
        </Button>
        <Button variant="primary" onClick={() => {}} size="md">
          {t('paymentInvoices.CS.ExportExcel')}
        </Button>
      </div>
    </div>
  );
}
export default PaymentDetails;
