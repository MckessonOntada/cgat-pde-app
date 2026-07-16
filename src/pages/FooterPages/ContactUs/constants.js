import { ReactComponent as wrenchIcon } from '@src/assets/svg/wrench-outlined.svg';
import { ReactComponent as orderIcon } from '@src/assets/svg/order-outlined.svg';
import { ReactComponent as invoiceIcon } from '@src/assets/svg/invoice-outlined.svg';
import { ReactComponent as questionMarkIcon } from '@src/assets/svg/question-mark-outlined.svg';
import { ReactComponent as loginIcon } from '@src/assets/svg/login-icon.svg';
import { ReactComponent as otherIcon } from '@src/assets/svg/other-icon.svg';
import { ReactComponent as notificaionIcon } from '@src/assets/svg/notification-icon.svg';
import { ReactComponent as userIcon } from '@src/assets/svg/user-icon.svg';

export const contactReasons = [
  { id: 'tech', label: 'Tech issue', Icon: wrenchIcon },
  { id: 'order', label: 'Order issue', Icon: orderIcon },
  { id: 'invoice', label: 'Invoices & Payments', Icon: invoiceIcon },
  { id: 'other', label: 'Other', Icon: questionMarkIcon }
];

export const techIssueOptions = [
  { id: 'login', label: 'Login & Account Management', icon: loginIcon },
  { id: 'userrole', label: 'User & Role Managament', icon: userIcon },
  { id: 'notification', label: 'Notifications', icon: notificaionIcon },
  { id: 'other', label: 'Other', icon: otherIcon }
];
