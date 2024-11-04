import React from 'react';
import { Badge } from '@mckesson/mcp-component-library';
import styles from './StatusBadge.module.scss';

function StatusBadge(props) {
  const { status, statusCode } = props;
  if (!status || !statusCode) {
    return null;
  }
  const statusClassMap = {
    CA_ASSIGNED: 'badge-ca',
    IN_CA: 'badge-ca',
    CA_READY: 'badge-ca-with-border',
    CA_COMPLETED: 'badge-ca-complete',
    VENDOR_QC_ASSIGNED: 'badge-vqc',
    VENDOR_QC_PROGRESS: 'badge-vqc',
    VENDOR_QC_READY: 'badge-vqc-with-border',
    VENDOR_QC_COMPLETED: 'badge-vqc-complete',
    ONTADA_QC_ASSIGNED: 'badge-oqc',
    ONTADA_QC_PROGRESS: 'badge-oqc',
    ONTADA_QC_READY: 'badge-oqc-with-border',
    ONTADA_QC_COMPLETED: 'badge-oqc-complete',
    COMPLETED: 'badge-complete',
    AWAITING_DOCUMENTS: 'badge-awaiting-documents',
    IN_ELIGIBLE: 'badge-ineligible'
  };

  const statusBadge = {
    CA_ASSIGNED: 'CA Assigned',
    IN_CA: 'CA IN PROG',
    CA_READY: 'CA Ready',
    CA_COMPLETED: 'CA Complete',
    VENDOR_QC_READY: 'V-QC Ready',
    VENDOR_QC_PROGRESS: 'V-QC in Prog',
    VENDOR_QC_COMPLETED: 'V-QC Complete',
    ONTADA_QC_PROGRESS: 'O-QC in Prog',
    ONTADA_QC_READY: 'O-QC Ready',
    ONTADA_QC_COMPLETED: 'O-QC Complete',
    COMPLETED: 'Complete',
    IN_ELIGIBLE: 'INELIGIBLE'
  };

  const conditionalClass = statusClassMap[statusCode] || '';

  return (
    <div className={`${styles[conditionalClass]} ${styles.statusBadge}`}>
      <Badge text={statusBadge[statusCode] || status} />
    </div>
  );
}

export default StatusBadge;
