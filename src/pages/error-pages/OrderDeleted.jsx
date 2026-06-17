import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from '@mckesson/mcp-component-library';
import Alert from '@src/components/cgat-alert/Alert';
import DetailSegment from '@src/components/DetailSegment';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import AuthUtils from '@src/util/AuthUtils';
import styles from './OrderDeleted.module.scss';

const OrderDeleted = ({ orderDetails }) => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [alertVisible, setAlertVisible] = useState(true);

  if (!orderDetails) return null;

  const {
    id,
    patient = {},
    therapy = {},
    tradeDetails = {},
    updatedAt,
    createdAt,
    createdBy,
    updatedBy
  } = orderDetails;

  const hasUserPhiPermission = AuthUtils.hasUserPhiPermission();
  const isCustomerCentreUser = AuthUtils.isCustomerCenterView();
  const patientName =
    !hasUserPhiPermission || isCustomerCentreUser
      ? '******'
      : patient.patientInfo
      ? CommonUtils.getUSFullName(patient.patientInfo)
      : '-';
  const therapyName = therapy.materialDescription || tradeDetails.tradeName || '-';
  const createdByName = createdBy?.name || createdBy?.userName || '-';
  const discardedByName = updatedBy?.name || updatedBy?.userName || '-';

  const discardedDate = updatedAt ? CommonUtils.convertDateStringFormat(updatedAt, 'MM/DD/YYYY') : '-';
  const startDate = createdAt ? CommonUtils.convertDateStringFormat(createdAt, 'MM/DD/YYYY') : '-';

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <div className={styles.header}>
          <Button
            className="back-button-control"
            variant="tertiary"
            Icon={() => <IconArrowLeft />}
            onClick={() => navigate('/orders')}
            size="md"
          >
            {t('labels.orderDeleted.backButton')}
          </Button>
        </div>

        {alertVisible && (
          <Alert
            type="error"
            showTitle={true}
            title={t('labels.orderDeleted.heading')}
            description={t('labels.orderDeleted.message', { orderId: id })}
            showCloseIcon={true}
            onClose={() => setAlertVisible(false)}
          />
        )}

        <div className="MCP-CardContainer">
          <div className={styles.grid}>
            <div className={styles.column}>
              <DetailSegment
                label="Order ID"
                value={id || '-'}
                direction="row"
                className={styles.detailRow}
              />
              <DetailSegment
                label={t('labels.orderDeleted.patient')}
                value={patientName}
                direction="row"
                className={styles.detailRow}
              />
              <DetailSegment
                label={t('labels.orderDeleted.therapy')}
                value={therapyName}
                direction="row"
                className={styles.detailRow}
              />
              <DetailSegment
                label={t('labels.orderDeleted.discardedOn')}
                value={discardedDate}
                direction="row"
                className={styles.detailRow}
              />
            </div>

            <div className={styles.column}>
              <DetailSegment
                label={t('labels.orderDeleted.createdBy')}
                value={createdByName}
                direction="row"
                className={styles.detailRow}
              />
              <DetailSegment
                label={t('labels.orderDeleted.startDate')}
                value={startDate}
                direction="row"
                className={styles.detailRow}
              />
              <DetailSegment
                label={t('labels.orderDeleted.status')}
                value={<Badge text="DISCARDED" type="error" />}
                direction="row"
                className={styles.detailRow}
                noTooltip={true}
              />
              <DetailSegment
                label={t('labels.orderDeleted.discardedBy')}
                value={discardedByName}
                direction="row"
                className={styles.detailRow}
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            size="md"
            variant="primary"
            onClick={() => navigate('/orders?tab=PENDING_SUBMISSION')}
          >
            {t('labels.orderDeleted.goToPending')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDeleted;

