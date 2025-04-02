export const ORDER_STAGES = {
  THERAPY_SELECTION: 'THERAPY_SELECTION',
  ACCOUNT_SELECTION: 'ACCOUNT_SELECTION',
  PATIENT_DETAILS: 'PATIENT_DETAILS',
  ADDITIONAL_DETAILS: 'ADDITIONAL_DETAILS',
  ORDER_SUMMARY: 'ORDER_SUMMARY'
};

export const FormList = (t) => [
  {
    name: ORDER_STAGES.THERAPY_SELECTION,
    label: t('labels.therapySelection')
  },
  {
    name: ORDER_STAGES.ACCOUNT_SELECTION,
    label: t('labels.accountSelection')
  },
  {
    name: ORDER_STAGES.PATIENT_DETAILS,
    label: t('labels.patientDetails')
  },
  {
    name: ORDER_STAGES.ADDITIONAL_DETAILS,
    label: t('labels.additionalDetails')
  },
  {
    name: ORDER_STAGES.ORDER_SUMMARY,
    label: t('labels.summary')
  }
];
export const InventoryIndicatorStatus = (status, t) => {
  const statusMap = {
    PENDING: t('tooltip.material.status.PENDING'),
    AVAILABLE: t('tooltip.material.status.AVAILABLE'),
    DROP_SHIP: t('tooltip.material.status.DROP_SHIP'),
    OUT_OF_STOCK: t('tooltip.material.status.OUT_OF_STOCK'),
    CHECKING: t('tooltip.material.status.CHECKING')
  };
  return statusMap[status];
};
