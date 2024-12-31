export const breadcrumbItems = [{ label: 'Dashboard', url: '/' }, { label: 'Manage Orders' }];

export const getTabs = (t) => [
  {
    id: 1,
    configName: 'PENDING SUBMISSION',
    isActive: true,
    sequence: 1,
    labelForMobile: 'PENDING SUBMISSION'
  },
  {
    id: 2,
    configName: 'SUBMITTED',
    isActive: false,
    sequence: 2,
    labelForMobile: 'SUBMITTED'
  }
];

export const StatusEnum = {
  IN_DRAFT: 'IN_DRAFT',
  APPROVAL_PENDING: 'APPROVAL_PENDING',
  SUBMITTED: 'SUBMITTED',
  CANCELLED: 'CANCELLED'
};
