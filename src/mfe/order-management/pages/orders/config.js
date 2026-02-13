import AuthUtils from '@src/util/AuthUtils';

export const ORDER_TABS = {
  SUBMITTED_BUY_AND_BILL: 'SUBMITTED_BUY_AND_BILL',
  SUBMITTED_SP: 'SUBMITTED_SP',
  PENDING_SUBMISSION: 'PENDING_SUBMISSION',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  REVIEW: 'REVIEW',
  SUBMITTED: 'SUBMITTED'
};

export const ORDER_STATUS = Object.freeze({
  IN_DRAFT: 'IN_DRAFT',
  PENDING: 'PENDING',
  APPROVAL_PENDING: 'APPROVAL_PENDING',
  SUBMITTED: 'SUBMITTED',
  DELETED: 'DELETED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  ALL: 'ALL',
  REVIEW: 'REVIEW',
  CS_REVIEW: 'CS_REVIEW',
  COMPLETED: 'COMPLETED',
  OPEN: 'OPEN'
});

export const TAB_FILTERS = Object.freeze({
  [ORDER_TABS.SUBMITTED_BUY_AND_BILL]: [ORDER_STATUS.SUBMITTED, ORDER_STATUS.CS_REVIEW, ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED],
  [ORDER_TABS.SUBMITTED_SP]: [ORDER_STATUS.SUBMITTED, ORDER_STATUS.CS_REVIEW, ORDER_STATUS.CANCELLED],
  [ORDER_TABS.PENDING_SUBMISSION]: [ORDER_STATUS.IN_DRAFT, ORDER_STATUS.REJECTED, ORDER_STATUS.DELETED, ORDER_STATUS.REVIEW],
  [ORDER_TABS.PENDING_APPROVAL]: [ORDER_STATUS.APPROVAL_PENDING],
  [ORDER_TABS.REVIEW]: [],
  [ORDER_TABS.SUBMITTED]: []
});

export const ORDER_VIEW = Object.freeze({
  ALL_ORDERS: 'ALL_ORDERS',
  MY_ORDERS: 'MY_ORDERS',
  ASSIGNED_TO_ME: 'ASSIGNED_TO_ME',
  PAP_ORDERS: 'NO_COST_THERAPY'
});

export const TOGGLE_FILTERS = {
  [ORDER_TABS.SUBMITTED_BUY_AND_BILL]: [ORDER_VIEW.ALL_ORDERS, ORDER_VIEW.MY_ORDERS, ORDER_VIEW.PAP_ORDERS],
  [ORDER_TABS.SUBMITTED_SP]: [ORDER_VIEW.ALL_ORDERS, ORDER_VIEW.MY_ORDERS],
  [ORDER_TABS.PENDING_SUBMISSION]: [ORDER_VIEW.ALL_ORDERS, ORDER_VIEW.MY_ORDERS],
  [ORDER_TABS.PENDING_APPROVAL]: [ORDER_VIEW.ALL_ORDERS, ORDER_VIEW.ASSIGNED_TO_ME, ORDER_VIEW.PAP_ORDERS],
  [ORDER_TABS.REVIEW]: [],
  [ORDER_TABS.SUBMITTED]: []
};

export const COLUMNS = {
  SAP_ID: 'SAP_ID',
  PDE_ID: 'PDE_ID',
  ORDER_ID: 'ORDER_ID',
  PRESCRIPTION_ID: 'PRESCRIPTION_ID',
  ORDER_ID_SP: 'ORDER_ID_SP',
  PATIENT_NAME: 'PATIENT_NAME',
  THERAPY: 'THERAPY',
  ORGANIZATION: 'ORGANIZATION',
  AUTHOR: 'AUTHOR',
  ASSIGNEE: 'ASSIGNEE',
  SUBMITTED_BY: 'SUBMITTED_BY',
  SUBMITTED_ON: 'SUBMITTED_ON',
  UPDATED_BY: 'UPDATED_BY',
  UPDATED_ON: 'UPDATED_ON',
  STATUS: 'STATUS',
  PRICE: 'PRICE',
  CREATED_ON: 'CREATED_ON',
  ACTION: 'ACTION'
};

export const TABLE_COLUMNS = {
  [ORDER_TABS.SUBMITTED_BUY_AND_BILL]: [
    COLUMNS.SAP_ID,
    COLUMNS.PDE_ID,
    COLUMNS.PATIENT_NAME,
    COLUMNS.THERAPY,
    COLUMNS.ORGANIZATION,
    COLUMNS.SUBMITTED_BY,
    COLUMNS.SUBMITTED_ON,
    COLUMNS.STATUS,
    COLUMNS.PRICE,
    COLUMNS.ACTION
  ],
  [ORDER_TABS.SUBMITTED_SP]: [
    COLUMNS.ORDER_ID_SP,
    COLUMNS.PATIENT_NAME,
    COLUMNS.THERAPY,
    COLUMNS.ORGANIZATION,
    COLUMNS.SUBMITTED_BY,
    COLUMNS.SUBMITTED_ON,
    COLUMNS.STATUS,
    COLUMNS.ACTION
  ],
  [ORDER_TABS.PENDING_SUBMISSION]: [
    COLUMNS.ORDER_ID,
    COLUMNS.PATIENT_NAME,
    COLUMNS.THERAPY,
    COLUMNS.AUTHOR,
    COLUMNS.CREATED_ON,
    COLUMNS.STATUS,
    COLUMNS.ACTION
  ],
  [ORDER_TABS.PENDING_APPROVAL]: [
    COLUMNS.ORDER_ID,
    COLUMNS.PATIENT_NAME,
    COLUMNS.THERAPY,
    COLUMNS.AUTHOR,
    COLUMNS.ASSIGNEE,
    COLUMNS.CREATED_ON,
    COLUMNS.STATUS,
    COLUMNS.ACTION
  ],
  [ORDER_TABS.REVIEW]: [COLUMNS.ORDER_ID_SP, COLUMNS.PATIENT_NAME, COLUMNS.THERAPY, COLUMNS.AUTHOR, COLUMNS.UPDATED_BY, COLUMNS.UPDATED_ON],
  [ORDER_TABS.SUBMITTED]: [COLUMNS.ORDER_ID_SP, COLUMNS.PATIENT_NAME, COLUMNS.THERAPY, COLUMNS.SUBMITTED_ON]
};

export const ORDER_ENTITY_ACTION = Object.freeze({
  VIEW: 'VIEW',
  RESUME: 'RESUME',
  DELETE: 'DELETE',
  CANCEL: 'CANCEL',
  EDIT: 'EDIT',
  REVIEW: 'REVIEW',
  ASSIGN: 'ASSIGN',
  UNASSIGN: 'UNASSIGN',
  DISCARD_MY_CHANGES: 'DISCARD_MY_CHANGES',
  UPLOAD_DOCUMENT: 'UPLOADED_DOCUMENT'
});

export const getTabs = (isCSReviewOrdersPage) => {
  const isPhysician = AuthUtils.isPhysician();
  if (isPhysician) {
    return [
      {
        id: ORDER_TABS.REVIEW,
        configName: 'labels.tabs.review',
        isActiveTab: false,
        sequence: 1,
        labelForMobile: 'labels.tabs.review'
      },
      {
        id: ORDER_TABS.SUBMITTED,
        configName: 'labels.tabs.submitted',
        isActiveTab: false,
        sequence: 1,
        labelForMobile: 'labels.tabs.submitted'
      }
    ];
  } else if (isCSReviewOrdersPage) {
    return [
      {
        id: ORDER_TABS.SUBMITTED_BUY_AND_BILL,
        configName: 'labels.tabs.submittedBuyAndBill',
        isActiveTab: false,
        sequence: 1,
        labelForMobile: 'labels.tabs.submittedBuyAndBill'
      },
      {
        id: ORDER_TABS.SUBMITTED_SP,
        configName: 'labels.tabs.submittedSp',
        isActiveTab: false,
        sequence: 2,
        labelForMobile: 'labels.tabs.submittedSp'
      }
    ];
  } else {
    return [
      {
        id: ORDER_TABS.SUBMITTED_BUY_AND_BILL,
        configName: 'labels.tabs.submittedBuyAndBill',
        isActiveTab: false,
        sequence: 1,
        labelForMobile: 'labels.tabs.submittedBuyAndBill'
      },
      {
        id: ORDER_TABS.SUBMITTED_SP,
        configName: 'labels.tabs.submittedSp',
        isActiveTab: false,
        sequence: 2,
        labelForMobile: 'labels.tabs.submittedSp'
      },
      {
        id: ORDER_TABS.PENDING_SUBMISSION,
        configName: 'labels.tabs.pendingSubmission',
        isActiveTab: false,
        sequence: 3,
        labelForMobile: 'labels.tabs.pendingSubmission'
      },
      {
        id: ORDER_TABS.PENDING_APPROVAL,
        configName: 'labels.tabs.pendingApproval',
        isActiveTab: false,
        sequence: 4,
        labelForMobile: 'labels.tabs.pendingApproval'
      }
    ];
  }
};

export const ORDER_DATE_FILTER_OPTIONS = [
  { label: 'Current Month', value: 'currentMonth' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Last 3 Months', value: 'last3Months' },
  { label: 'Last 6 Months', value: 'last6Months' },
  { label: 'Custom Range', value: 'customRange' }
];

export const DiSTRIBUTION_CHANNEL_OPTIONS = [
  { label: '3 PL', value: '3pl' },
  { label: 'MPB', value: 'mpb' }
];
