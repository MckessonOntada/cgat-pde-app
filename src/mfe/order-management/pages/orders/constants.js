export const getBreadcrumbItems = (t) => [{ label: t('order.label.admin'), url: '/' }, { label: t('order.label.manageOrder') }];

export const getTabs = (t) => [
  {
    id: 1,
    configName: t('labels.tabs.pendingSubmission'),
    isActive: true,
    sequence: 1,
    labelForMobile: t('labels.tabs.pendingSubmission')
  },
  {
    id: 2,
    configName: t('labels.tabs.submitted'),
    isActive: false,
    sequence: 2,
    labelForMobile: t('labels.tabs.submitted')
  }
];

export const StatusEnum = {
  IN_DRAFT: 'IN_DRAFT',
  APPROVAL_PENDING: 'APPROVAL_PENDING',
  SUBMITTED: 'SUBMITTED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED'
};
