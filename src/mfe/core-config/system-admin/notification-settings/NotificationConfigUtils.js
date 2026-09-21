import { NOTIFICATION_TYPES } from './constants';

export const getNotificationType = (selectedTab) => (selectedTab === 1 ? NOTIFICATION_TYPES.ORDER_SUBMIT : NOTIFICATION_TYPES.PATIENT_INGESTION);

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
        notificationType: NOTIFICATION_TYPES.ORDER_SUBMIT,
        isCustomerServiceEnabled: tabState?.[1]?.notifications ?? true,
        isAdditionalRecipientEnabled: tabState?.[1]?.notifications ?? true ? tabState?.[1]?.addRecipients ?? true : false,
        recipients: mapRecipients(tabState?.[1]?.recipients ?? [])
      },
      {
        notificationType: NOTIFICATION_TYPES.PATIENT_INGESTION,
        isCustomerServiceEnabled: tabState?.[2]?.notifications ?? true,
        isAdditionalRecipientEnabled: tabState?.[2]?.notifications ?? true ? tabState?.[2]?.addRecipients ?? true : false,
        recipients: mapRecipients(tabState?.[2]?.recipients ?? [])
      }
    ]
  };
};
