import React from 'react';
import StepHeader from './StepHeader';
import styles from './ContactUs.module.scss';
import { useTranslate } from '@src/translations/useTranslation';

const CardSelector = ({ step, title, options, value, onChange }) => {
  const { t } = useTranslate();

  return (
    <div className={styles.techOptions}>
      <StepHeader step={step} title={title} />

      <div className={styles.techOptionsGrid}>
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              className={`${styles.techCard} ${isSelected ? styles.techCardActive : ''}`}
              onClick={() => onChange(option.id)}>
              <div className={styles.techCardIcon}>
                <Icon />
              </div>

              <span className={styles.techCardLabel}>{t(option.label)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CardSelector;
