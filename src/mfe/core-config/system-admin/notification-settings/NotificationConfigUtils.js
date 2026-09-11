export const buildNotificationConfigPayload = ({ therapy, selectedTab, notifications, recipients = [] }) => {
  const therapyList = Array.isArray(therapy) ? therapy : [];

  const selectedTherapy = therapyList[0];

  const ndcNumbers = therapyList.map((item) => item?.ndc || item?.ndcNumber).filter(Boolean);

  return {
    ndcNumbers,
    channelType: selectedTherapy?.channelType,
    notificationType: selectedTab === 1 ? 'ORDER_SUBMIT' : 'PATIENT_INGESTION',
    isCustomerServiceEnabled: notifications,
    isActive: selectedTherapy?.isActive ?? selectedTherapy?.active,
    recipients: recipients.map(({ firstName, middleName, lastName, email }) => ({
      firstName,
      middleName,
      lastName,
      email
    }))
  };
};
