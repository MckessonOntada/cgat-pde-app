import React, { useState } from 'react';
import styles from './AccountCard.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Loader } from '@mckesson/mcp-component-library';

const AccountCard = ({ options = [], onChange, isFetching }) => {
  const { t } = useTranslate();
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    const selectedAccount = options.filter((a) => a.id === value)[0];
    if (selectedAccount) onChange && onChange(selectedAccount);
  };
  if (isFetching) {
    return (
      <div className={styles.wrapper}>
        <Loader variant="circular" />
      </div>
    );
  }

  if (!options.length) return null;

  return (
    <div className={styles.cardContainer}>
      <div className={styles.header}>
        <p className={styles.title}>{t('headings.accountListing')}</p>
        <p className={styles.subtitle}>{t('headings.selectAccountToUpdate')}</p>
      </div>
      {options.map((option, index) => {
        const { accountName, accountNumber } = option;
        const address = [
          option.houseNumber,
          option.street,
          option.street2,
          option.street3,
          option.district,
          option.city,
          option.state,
          option.zipCode,
          option.country
        ]
          .filter((segment) => Boolean(segment))
          .join(', ');

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
