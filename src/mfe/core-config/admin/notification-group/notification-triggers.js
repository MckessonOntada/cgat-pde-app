const NotificationTriggers = [
  {
    label: 'User Access Awaiting Review',
    description: 'Triggered when a new user access request is pending admin approval.'
  },
  {
    label: 'Delegate Login Recorded',
    description: 'Captures login activity when a user accesses the system on behalf of another.'
  },
  {
    label: 'Order Auto-Approved Successfully',
    description: 'Notification when an order is automatically approved after submission.'
  },
  {
    label: 'Order Awaiting Review',
    description: 'Sent when an order requires manual review and approval.'
  },
  {
    label: 'Order Approved Successfully',
    description: 'Confirmation notification once the order has been approved.'
  },
  {
    label: 'Order Request Rejected',
    description: 'Informs the user that their order request has been rejected.'
  },
  {
    label: 'Orders Waiting Physician Review',
    description: 'Displays orders queued for physician review before approval.'
  },
  {
    label: 'Therapy Selection Confirmed',
    description: 'Confirmation that therapy selection for the order is completed.'
  },
  {
    label: 'Account Confirmed – Buy & Bill',
    description: 'Indicates account confirmation for Buy & Bill orders.'
  },
  {
    label: 'Account Confirmed – Specialty Pharmacy',
    description: 'Indicates account confirmation for Specialty Pharmacy orders.'
  },
  {
    label: 'Patient Information Confirmed',
    description: 'Confirms that all patient details have been entered and verified.'
  },
  {
    label: 'Additional Information Confirmed',
    description: 'Confirms that the additional details section has been completed.'
  },
  {
    label: 'Account Step Completed',
    description: 'Notification confirming completion of the account selection step.'
  },
  {
    label: 'Patient Info Updated – Buy & Bill',
    description: 'Indicates that patient details for Buy & Bill orders have been updated.'
  },
  {
    label: 'Patient Info Updated – SP',
    description: 'Indicates that patient details for Specialty Pharmacy orders have been updated.'
  },
  {
    label: 'Additional Info Updated',
    description: 'Confirms that additional order information has been successfully updated.'
  },
  {
    label: 'Order Successfully Submitted',
    description: 'Confirmation that the order has been submitted successfully.'
  }
];

export default NotificationTriggers;
