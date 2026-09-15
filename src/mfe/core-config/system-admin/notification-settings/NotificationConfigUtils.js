export const getNotificationType = (selectedTab) => (selectedTab === 1 ? 'ORDER_SUBMIT' : 'PATIENT_INGESTION');

export const mapRecipients = (recipients = []) =>
  recipients.map(({ firstName, middleName, lastName, email }) => ({
    firstName,
    middleName,
    lastName,
    email
  }));

export const buildNotificationConfigPayload = ({ therapy, selectedTab, notifications, recipients = [], isBulk = false }) => {
  const therapyList = Array.isArray(therapy) ? therapy : [];
  const selectedTherapy = therapyList[0];

  const ndcNumbers = therapyList.map((item) => item?.ndc || item?.ndcNumber).filter(Boolean);

  const basePayload = {
    channelType: selectedTherapy?.channelType,
    notificationType: getNotificationType(selectedTab),
    isCustomerServiceEnabled: notifications,
    isActive: selectedTherapy?.isActive ?? selectedTherapy?.active,
    recipients: mapRecipients(recipients)
  };

  if (isBulk) {
    return {
      ...basePayload,
      ndcNumbers
    };
  }

  return {
    ...basePayload,
    ndcNumber: ndcNumbers[0]
  };
};
