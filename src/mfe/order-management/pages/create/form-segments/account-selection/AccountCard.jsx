import React, { useState } from "react";
import styles from './AccountCard.module.scss';
import { useTranslate } from '@src/translations/useTranslation';

const AccountCard = ({ options, onChange }) => {
  const { t } = useTranslate();
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    onChange && onChange(value);
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.header}>
        <p className={styles.title}>{t('headings.accountListing')}</p>
        <p className={styles.subtitle}>{t('headings.selectAccountToUpdate')}</p>
      </div>
      {options.map((option, index) => (
        <label
          key={index}
          className={`${styles.card} ${selected === option.id ? styles.selected : null}`}
          onClick={() => handleSelect(option.id)}
        >
          <input
            type="radio"
            name="card-radio"
            value={option.id}
            checked={selected === option.id}
            onChange={() => handleSelect(option.id)}
            style={{ display: "none" }}
          />
          <div className={styles.cardContent}>
            <h3>{option.accountNumber}</h3>
            <h3>{option.accountName}</h3>
            <p>{option.address}</p>
          </div>
        </label>
      ))}
    </div>
  );
};

export default AccountCard;