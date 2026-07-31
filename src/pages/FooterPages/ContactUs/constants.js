import { ReactComponent as wrenchIcon } from '@src/assets/svg/wrench-outlined.svg';
import { ReactComponent as orderIcon } from '@src/assets/svg/order-outlined.svg';
import { ReactComponent as invoiceIcon } from '@src/assets/svg/invoice-outlined.svg';
import { ReactComponent as questionMarkIcon } from '@src/assets/svg/question-mark-outlined.svg';
import { ReactComponent as loginIcon } from '@src/assets/svg/login-icon.svg';
import { ReactComponent as otherIcon } from '@src/assets/svg/other-icon.svg';
import { ReactComponent as notificaionIcon } from '@src/assets/svg/notification-icon.svg';
import { ReactComponent as userIcon } from '@src/assets/svg/user-icon.svg';

export const contactReasons = [
  { id: 1, value: 'Tech issue', label: 'Tech issue', Icon: wrenchIcon },
  { id: 2, value: 'Order issue', label: 'Order issue', Icon: orderIcon },
  { id: 3, value: 'Invoices & Payments', label: 'Invoices & Payments', Icon: invoiceIcon },
  { id: 4, value: 'Other', label: 'Other', Icon: questionMarkIcon }
];

export const techIssueOptions = [
  { id: 1, value: 'Login & Account Management', label: 'Login & Account Management', icon: loginIcon },
  { id: 2, value: 'User & Role Management', label: 'User & Role Management', icon: userIcon },
  { id: 3, value: 'Notifications', label: 'Notifications', icon: notificaionIcon },
  { id: 4, value: 'Other', label: 'Other', icon: otherIcon }
];
