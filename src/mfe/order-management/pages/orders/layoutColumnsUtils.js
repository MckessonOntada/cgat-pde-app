import { ORDER_TABS } from './config';

// Maps table column id → layout columnName (only non-mandatory optional columns)
export const TABLE_ID_TO_LAYOUT_KEY = {
  PATIENT_NAME: 'PatientName',
  PATIENT_ID: 'PatientId',
  PRICE: 'Price',
  PROVIDER: 'Provider',
  COI_ID: 'CoiId',
  PO_NUMBER: 'PoNumber'
};

const TAB_TO_CONFIG_KEY = {
  [ORDER_TABS.SUBMITTED_BUY_AND_BILL]: 'SubmittedBnb',
  [ORDER_TABS.SUBMITTED_SP]: 'SubmittedSP',
  [ORDER_TABS.PENDING_SUBMISSION]: 'PendingSubmission',
  [ORDER_TABS.PENDING_APPROVAL]: 'PendingApproval'
};

const COLUMN_TRANSLATION_KEY = {
  PatientName: 'labels.patientName',
  PatientId: 'labels.PatientID',
  PoNumber: 'labels.providePONumber',
  CoiId: 'labels.coiId',
  Price: 'table.columns.captions.price',
  Provider: 'labels.provider'
};

export const getLayoutColumns = (layoutConfig, tab, t) => {
  const commonCols = (layoutConfig.common || []).filter((c) => !c.mandatory);

  const tabKey = TAB_TO_CONFIG_KEY[tab];
  const tabCols = tabKey ? (layoutConfig[tabKey] || []).filter((c) => !c.mandatory) : [];

  return [...commonCols, ...tabCols].map(({ columnName, visibility }) => ({
    key: columnName,
    label: t(COLUMN_TRANSLATION_KEY[columnName] || columnName),
    defaultChecked: visibility
  }));
};
