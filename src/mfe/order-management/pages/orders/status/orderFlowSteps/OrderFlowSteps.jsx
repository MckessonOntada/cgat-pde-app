import React from 'react';
import styles from './OrderFlowSteps.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { useManageOrder } from '@src/mfe/order-management/context/ManageOrderContext';

function OrderFlowSteps() {
  const { t } = useTranslate();
  const { formState } = useManageOrder();

  const catalogConfiguration = formState.activeRecord?.catalogConfiguration;
  if (!catalogConfiguration || !catalogConfiguration.steps) return null;

  return (
    <div className="MCP-panel-container">
      <div className={`${styles.orderFlow}`}>
        <h4 className={styles.customSecondaryHeading}>{t('labels.whatToExpect')}</h4>
        <div className={styles.orderListContainer}>
          {catalogConfiguration.steps.map((item, index) => (
            <div className={styles.orderListItem} key={index}>
              <div className={styles.orderListCount}>{index + 1}</div>
              <div className={styles.orderListContent}>
                <div className={styles.orderListLabel}>{item.stepName}</div>
                <div className={styles.orderListDescription}>{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderFlowSteps;
