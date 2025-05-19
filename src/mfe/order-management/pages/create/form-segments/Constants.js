export const ORDER_STAGES = {
  THERAPY_SELECTION: 'THERAPY_SELECTION',
  ACCOUNT_SELECTION: 'ACCOUNT_SELECTION',
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
export const PROGRAM_LIST = ['WAC', '340B', 'GOV'];

export const INFO_340B = [
  {
    title: 'Patient Eligibility Requirements',
    info: 'An individual is a "340B eligible patient" only if ALL of the following criteria are mot:',
    requirements: [
      "The covered entity has established a relationship with the patient, with records of the patient's health care maintained by the covered entity.",
      'The patient receives health care services from a professional who is employed by the covered entity or provides services under contractual arrangement with the covered entity.'
    ]
  },
  {
    title: 'Facility Eligibility Requirements',
    info: 'For a facility to be eligible to participate in the 340B program, it must:',
    requirements: [
      'Be registered in the 340B Office of Pharmacy Affairs Information System (OPAIS).',
      "For hospital outpatient facilities, be listed as reimbursable on the hospital's most recently filed Medicare cost report."
    ]
  },
  {
    title: 'Compliance Requirements',
    requirements: [
      'Covered entities must maintain auditable records that demonstrate compliance with all 340B program requirements, including patient eligibility.'
    ]
  }
];
