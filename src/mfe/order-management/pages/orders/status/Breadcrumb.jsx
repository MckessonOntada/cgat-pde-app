import React from 'react';
import styles from './Breadcrumb.module.scss';
import { useTranslate } from '@src/translations/useTranslation';

const Breadcrumb = () => {
  const { t } = useTranslate();
  const items = [
    {
      id: 'approval',
      label: t('labels.approval')
    },
    {
      id: 'fulfillment',
      label: t('labels.fulfillment')
    },
    {
      id: 'shipment',
      label: t('labels.shipment')
    },
    {
      id: 'finalDelivery',
      label: t('labels.finalDelivery')
    }
  ];
  return (
    <div className={styles.breadcrumb}>
      {items.map((item, index) => (
        <div key={index} className={styles.breadcrumbItem}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
