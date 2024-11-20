import React from 'react';
import styles from './TherapyDetails.module.scss';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import { useTranslate } from '@src/translations/useTranslation';

const detailsList = [
  {
    title: 'Material Details',
    details: {
      'Material Description': 'MPB HEMLIBRA 105MG/0.7ML SDV',
      NDC: 'N50242092201',
      UDI: 'NA',
      'Sales Org': 'MPB'
    }
  },
  {
    title: 'Variant Details',
    details: {
      Variant: 'Type A',
      'Variant Description': 'One to One'
    }
  },
  {
    title: 'Contract Details',
    details: {
      'Contract Number': 630673,
      'Contract Type': 5,
      'Contract Type Description': 'Individual',
      'Contract Valid Form': '1/5/2024',
      'Contract Valid Till': '12/32/2025',
      Division: 10,
      '340b Identifier': 'No'
    }
  },
  {
    title: 'Pricing Details',
    details: {
      'Price Date': '9/23/2024',
      'Net Price ($)': 850,
      'Regular Price ($)': '11,754.60',
      'Contract Price ($)': '$1,000.00',
      'WAC Price ($)': '11,754.60',
      'Discounts ($)': 150,
      '340b Price': 'NA',
      'Price Unit': 1
    }
  }
];

function TherapyDetails({ onClose }) {
  const { t } = useTranslate();
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h6>{t('labels.therapyDetails')}</h6>
        <button onClick={onClose}>
          <IconClose />
        </button>
      </div>
      <div className={styles.body}>
        {detailsList.map((detailItem, index) => {
          return <DetailsPanel {...detailItem} />;
        })}
      </div>
    </div>
  );
}

function DetailsPanel(props) {
  const { title, details } = props;
  return (
    <div className={styles.detailsPanel}>
      <p className={styles.panelHeading}>{title}</p>
      {Object.entries(details).map(([key, value]) => (
        <div className={styles.detailItem}>
          <p className={'fieldName'}>{key}</p>
          <p className={'fieldValue'}>{value}</p>
        </div>
      ))}
    </div>
  );
}

export default TherapyDetails;
