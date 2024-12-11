import React from 'react';
import styles from './TherapyDetails.module.scss';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@mckesson/mcp-component-library';

const detailsList = [
  {
    title: 'Material Details',
    details: {
      'Material Number': '00000000000003742657',
      'Material Description': 'MPB HEMLIBRA 105MG/0.7ML SDV',
      NDC: 'N50242092201',
      Strength: '105 MG/0.7',
      Dosage: 'VIAL',
      'Selling Unit Code': 'EA',
      'Vendor Name': 'GENENTECH/MCK SP/MPB',
      'UPC Code': '35024292201',
      'Drop Ship Indicator': 'Y',
      'Base Unit of Measure': 'EA',
      'CGAT Identifier': 'One to One',
      'Product Level Pricing': 'Yes',
      'Minimum Order Quantity': '1'
    }
  }
];

function TherapyDetails({ therapyId, handleOnClose }) {
  const { t } = useTranslate();
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Heading as="h2">{t('labels.therapyDetails')}</Heading>
        <button onClick={handleOnClose}>
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
