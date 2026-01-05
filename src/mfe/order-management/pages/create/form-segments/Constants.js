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

export const MANUFACTURER = {
  ORCA: 'ORCA',
  REGENERON: 'REGENERON'
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
  [ORDER_STAGES.PATIENT_DETAILS]: t('attestation.patientDetails'),
  [ORDER_STAGES.PATIENT_AND_PROVIDER_DETAILS]: t('attestation.patientAndProviderDetails'),
  [ORDER_STAGES.PAYER_DETAILS]: t('attestation.payerDetails'),
  [ORDER_STAGES.ADDITIONAL_DETAILS]: t('attestation.additionalDetails')
});

export const NOTIFY_ALERT = (t, patientDetailsRequired) => ({
  [ORDER_STAGES.ACCOUNT_DETAILS]: t('captions.notifyUserAlert.accountSelection'),
  [ORDER_STAGES.PATIENT_AND_PROVIDER_DETAILS]: t('captions.notifyUserAlert.patientAndProviderDetails'),
  [ORDER_STAGES.PAYER_DETAILS]: t('captions.notifyUserAlert.patientAndProviderDetails'),
  [ORDER_STAGES.ADDITIONAL_DETAILS]: t(
    patientDetailsRequired ? 'captions.notifyUserAlert.additionalDetails' : 'captions.notifyUserAlert.additionalDetailsforNoPatientDetails'
  ),
  [ORDER_STAGES.ORDER_SUMMARY]: t('captions.notifyUserAlert.orderSummary')
});

export const NOTIFY_USER_EVENT_TYPE = (t) => ({
  [ORDER_STAGES.ACCOUNT_DETAILS]: 'ORDER_ACCOUNT_SELECTION_RESEND',
  [ORDER_STAGES.PATIENT_AND_PROVIDER_DETAILS]: 'ORDER_PATIENT_DETAILS_RESEND',
  [ORDER_STAGES.PAYER_DETAILS]: 'ORDER_PATIENT_DETAILS_RESEND',
  [ORDER_STAGES.ADDITIONAL_DETAILS]: 'ORDER_ADDITIONAL_DETAILS_RESEND',
  [ORDER_STAGES.ORDER_SUMMARY]: 'ORDER_SUMMARY_RESEND'
});

export const STAGE_COLORS = {
  THERAPY_SELECTION: '#B05F59',
  ACCOUNT_DETAILS: '#C86AC5',
  PATIENT_DETAILS: '#297CB0',
  PAYER_DETAILS: '#297CB0',
  ADDITIONAL_DETAILS: '#EB7A7A',
  ORDER_SUMMARY: '#5C56C2'
};
export const GET_STAGE_DISPLAY_NAME = (stageKey, channelType, t) => {
  const displayMap = {
    [ORDER_STAGES.THERAPY_SELECTION]: t('labels.therapySelection'),
    [ORDER_STAGES.ACCOUNT_DETAILS]: t('labels.accountDetails'),
    [ORDER_STAGES.PATIENT_DETAILS]:
      channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? t('stepper.label.PATIENT_AND_PROVIDER_DETAILS') : t('labels.patientDetails'),
    [ORDER_STAGES.PAYER_DETAILS]: t('labels.payerDetails'),
    [ORDER_STAGES.ADDITIONAL_DETAILS]: t('labels.additionalDetails'),
    [ORDER_STAGES.ORDER_SUMMARY]: t('labels.summary')
  };
  return displayMap[stageKey] || stageKey;
};
export const STAGE_INDEX = {
  THERAPY_SELECTION: 1,
  ACCOUNT_DETAILS: 2,
  PATIENT_DETAILS: 3,
  PATIENT_AND_PROVIDER_DETAILS: 3,
  PAYER_DETAILS: 4,
  ADDITIONAL_DETAILS: 5,
  ORDER_SUMMARY: 6
};
