export const ORDER_STAGES = {
  THERAPY_SELECTION: 'THERAPY_SELECTION',
  ACCOUNT_DETAILS: 'ACCOUNT_DETAILS',
  PATIENT_DETAILS: 'PATIENT_DETAILS',
  PATIENT_AND_PROVIDER_DETAILS: 'PATIENT_AND_PROVIDER_DETAILS',
  PAYER_DETAILS: 'PAYER_DETAILS',
  ADDITIONAL_DETAILS: 'ADDITIONAL_DETAILS',
  ORDER_SUMMARY: 'ORDER_SUMMARY'
};

export const CHANNEL_TYPE = {
  BUY_AND_BILL: 'BUY_AND_BILL',
  SPECIALTY_PHARMA: 'SPECIALITY_PHARMA'
};

export const FormList = (t) => [
  {
    name: ORDER_STAGES.THERAPY_SELECTION,
    label: t('labels.therapySelection')
  },
  {
    name: ORDER_STAGES.ACCOUNT_DETAILS,
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
export const PROGRAM_LIST = ['WAC', '340B', 'GOV'];

export const CGAT_IDENTIFIER = {
  WAC: 'WAC',
  '340B': '340B',
  340: '340B',
  GOV: 'GOV'
};

export const INFO_340B = [
  {
    title: 'order.account.selection.eligibility.patient.title',
    info: 'order.account.selection.eligibility.patient.info',
    requirements: ['order.account.selection.eligibility.patient.requirement1', 'order.account.selection.eligibility.patient.requirement2']
  },
  {
    title: 'order.account.selection.eligibility.facility.title',
    info: 'order.account.selection.eligibility.facility.info',
    requirements: ['order.account.selection.eligibility.facility.requirement1', 'order.account.selection.eligibility.facility.requirement2']
  },
  {
    title: 'order.account.selection.compliance.requirements.title',
    requirements: ['order.account.selection.compliance.requirements.requirement1']
  }
];

export const ORDER_ATTESTATION_MESSAGES = (t) => ({
  [ORDER_STAGES.THERAPY_SELECTION]: t('attestation.therapySelection'),
  [ORDER_STAGES.ACCOUNT_DETAILS]: t('attestation.accountDetails'),
  [ORDER_STAGES.PATIENT_AND_PROVIDER_DETAILS]: t('attestation.patientAndProviderDetails'),
  [ORDER_STAGES.PAYER_DETAILS]: t('attestation.payerDetails'),
  [ORDER_STAGES.ADDITIONAL_DETAILS]: t('attestation.additionalDetails')
});

export const NOTIFY_ALERT = (t) => ({
  [ORDER_STAGES.ACCOUNT_DETAILS]: t('captions.notifyUserAlert.accountSelection'),
  [ORDER_STAGES.PATIENT_AND_PROVIDER_DETAILS]: t('captions.notifyUserAlert.patientAndProviderDetails'),
  [ORDER_STAGES.PAYER_DETAILS]: t('captions.notifyUserAlert.patientAndProviderDetails'),
  [ORDER_STAGES.ADDITIONAL_DETAILS]: t('captions.notifyUserAlert.additionalDetails'),
  [ORDER_STAGES.ORDER_SUMMARY]: t('captions.notifyUserAlert.orderSummary')
});
