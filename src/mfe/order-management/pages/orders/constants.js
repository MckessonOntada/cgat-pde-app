export const breadcrumbItems = [{ label: 'Dashboard', url: '/' }, { label: 'Manage Orders' }];

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
  CANCELLED: 'CANCELLED'
};
