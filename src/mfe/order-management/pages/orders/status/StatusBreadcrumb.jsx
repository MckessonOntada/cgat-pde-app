import React from 'react';
import styles from './StatusBreadcrumb.module.scss';
import { useTranslate } from '@src/translations/useTranslation';

const StatusBreadcrumb = () => {
  const { t } = useTranslate();
  const items = [
    {
      id: 'approval',
      label: t('labels.approval'),
      description: t('labels.description.approval')
    },
    {
      id: 'fulfillment',
      label: t('labels.fulfillment'),
      description: t('labels.description.fulfillment')
    },
    {
      id: 'shipment',
      label: t('labels.shipment'),
      description: t('labels.description.shipment')
    },
    {
      id: 'finalDelivery',
      label: t('labels.finalDelivery'),
      description: t('labels.description.finalDelivery')
    }
  ];
  return (
    // <ol className={'status-breadcrumb'}>
    //   {items.map((item, index) => (
    //     <li key={index} className={'item'}>
    //       <span className='caption'>{item.label}</span>
    //     </li>
    //   ))}
    // </ol>
    <div className={styles.orderListContainer}>
      {items.map((item, index) => (
        <div className={styles.orderListItem} key={index}>
          <div className={styles.orderListCount}>{index + 1}</div>
          <div className={styles.orderListContent}>
            <div className={styles.orderListLabel}>{item.label}</div>
            <div className={styles.orderListdescription}>{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusBreadcrumb;
