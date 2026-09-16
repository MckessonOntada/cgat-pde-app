export const getNotificationType = (selectedTab) => (selectedTab === 1 ? 'ORDER_SUBMIT' : 'PATIENT_INGESTION');

export const mapRecipients = (recipients = []) =>
  recipients.map(({ firstName, middleName, lastName, email }) => ({
    firstName: firstName || '',
    middleName: middleName || '',
    lastName: lastName || '',
    email: email || ''
  }));

export const buildCombinedNotificationPayload = ({ therapy, tabState }) => {
  const therapyList = Array.isArray(therapy) ? therapy : [];
  const ndcNumbers = therapyList.map((item) => item?.ndc || item?.ndcNumber).filter(Boolean);
  const channelType = therapyList[0]?.channelType;

  return {
    ndcNumbers,
    channelType,
    notificationTypeConfigs: [
      {
        notificationType: 'ORDER_SUBMIT',
        isCustomerServiceEnabled: tabState?.[1]?.notifications ?? true,
        recipients: mapRecipients(tabState?.[1]?.recipients ?? [])
      },
      {
        notificationType: 'PATIENT_INGESTION',
        isCustomerServiceEnabled: tabState?.[2]?.notifications ?? true,
        recipients: mapRecipients(tabState?.[2]?.recipients ?? [])
      }
    ]
  };
};
