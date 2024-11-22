import React from 'react';
import './StatusBreadcrumb.scss';
import { useTranslate } from '@src/translations/useTranslation';

const StatusBreadcrumb = () => {
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
    <ol className={'status-breadcrumb'}>
      {items.map((item, index) => (
        <li key={index} className={'item'}>
          <span className='caption'>{item.label}</span>
        </li>
      ))}
    </ol>
  );
};

export default StatusBreadcrumb;
