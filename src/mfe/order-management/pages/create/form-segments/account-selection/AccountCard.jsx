import React, { useState } from 'react';
import styles from './AccountCard.module.scss';
import { Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

const AccountCard = ({ options = [], onChange }) => {
  const { t } = useTranslate();
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    const selectedAccount = options.filter((a) => a.id === value)[0];
    if (selectedAccount) onChange && onChange(selectedAccount);
  };

  if (!options.length) return null;
  return (
    <div className={styles.cardContainer}>
      <div className={styles.header}>
        <p className={styles.title}>{t('headings.accountListing')}</p>
        <p className={styles.subtitle}>{t('headings.selectAccountToUpdate')}</p>
      </div>
      {options.map((option, index) => {
        const { accountName, accountNumber } = option;
        const address = [option.houseNumber, option.street, option.district, option.city, option.state, option.zipCode].join(', ');

        return (
          <label
            key={index}
            className={`${styles.card} ${selected === option.id ? styles.selected : null}`}
            onClick={() => handleSelect(option.id)}>
            <input
              type="radio"
              name="card-radio"
              value={option.id}
              checked={selected === option.id}
              onChange={() => handleSelect(option.id)}
              style={{ display: 'none' }}
            />
            <div className={styles.cardContent}>
              <p className={styles.title}>{accountName}</p>
              <p className={styles.title}>{accountNumber}</p>
              <p className={styles.address}>{address}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default AccountCard;
