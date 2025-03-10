import { ORDER_TABS } from './config';

export const getBreadcrumbItems = (t) => [{ label: t('order.label.admin'), url: '/' }, { label: t('order.label.manageOrder') }];

export const getTabs = (t) => [
  {
    id: ORDER_TABS.SUBMITTED_BUY_AND_BILL,
    configName: t('labels.tabs.submittedBuyAndBill'),
    isActiveTab: true,
    sequence: 1,
    labelForMobile: t('labels.tabs.submittedBuyAndBill')
  },
  {
    id: ORDER_TABS.SUBMITTED_SP,
    configName: t('labels.tabs.submittedSp'),
    isActiveTab: false,
    sequence: 2,
    labelForMobile: t('labels.tabs.submittedSp')
  },
  {
    id: ORDER_TABS.PENDING_SUBMISSION,
    configName: t('labels.tabs.pendingSubmission'),
    isActiveTab: false,
    sequence: 3,
    labelForMobile: t('labels.tabs.pendingSubmission')
  },
  {
    id: ORDER_TABS.PENDING_APPROVAL,
    configName: t('labels.tabs.pendingApproval'),
    isActiveTab: false,
    sequence: 4,
    labelForMobile: t('labels.tabs.pendingApproval')
  }
];

export const StatusEnum = {
  IN_DRAFT: 'IN_DRAFT',
  PENDING: 'PENDING',
  APPROVAL_PENDING: 'APPROVAL_PENDING',
  SUBMITTED: 'SUBMITTED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED'
};

export const SAPOrderStatusEnum = {
  OPEN: 'OPEN',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};
