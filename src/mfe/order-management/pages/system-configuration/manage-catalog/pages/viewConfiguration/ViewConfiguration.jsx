import React from 'react';
import styles from './viewConfiguration.module.scss';
import { useTranslate } from '@src/translations/useTranslation';

function ViewConfiguration({ steps = [] }) {
  const { t } = useTranslate();
  console.log('steps...', steps);
  return (
    <div className="MCP-panel-container">
      <div className={`${styles.orderFlow}`}>
        <h4 className={styles.customSecondaryHeading}>{t('labels.whatToExpect')}</h4>
        <div className={styles.orderListContainer}>
          {steps?.map((item, index) => (
            <div className={styles.orderListItem} key={index}>
              <div className={styles.orderListCount}>{index + 1}</div>
              <div className={styles.orderListContent}>
                <div className={styles.orderListLabel}>{item.stepName}</div>
                <div className={styles.orderListdescription}>{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ViewConfiguration;
