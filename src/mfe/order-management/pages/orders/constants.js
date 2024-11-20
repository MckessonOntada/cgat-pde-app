export const breadcrumbItems = [
    { label: 'Dashboard', url: '/' },
    { label: 'Manage Orders' }
];

export const tabs = [
    {
        id: 1,
        configName: "PENDING SUBMISSION",
        isActive: true,
        sequence: 1,
        labelForMobile: "PENDING SUBMISSION"
    },
    {
        id: 2,
        configName: "SUBMITTED",
        isActive: false,
        sequence: 2,
        labelForMobile: "SUBMITTED"
    }
];

export const StatusEnum = {
    IN_DRAFT: 'in draft',
    APPROVAL_PENDING: 'approval pending',
    SUBMITTED: 'submitted',
    CANCELLED: 'cancelled'
};