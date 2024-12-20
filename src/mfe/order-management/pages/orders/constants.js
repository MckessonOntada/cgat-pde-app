export const breadcrumbItems = [{ label: 'Dashboard', url: '/' }, { label: 'Manage Orders' }];

export const getTabs = (t) => [
  {
    id: 1,
    configName: t('labels.tabs.pendingSubmission'),
    isActive: true,
    sequence: 1,
    labelForMobile: 'PENDING SUBMISSION'
  },
  {
    id: 2,
    configName: t('labels.tabs.submitted'),
    isActive: false,
    sequence: 2,
    labelForMobile: 'SUBMITTED'
  }
];

export const StatusEnum = {
  IN_DRAFT: 'in draft',
  APPROVAL_PENDING: 'approval pending',
  SUBMITTED: 'submitted',
  CANCELLED: 'cancelled'
};
