import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import AuthUtils from '@src/util/AuthUtils';

function Order(data) {
  Object.assign(this, data);

  const rules = {};

  //evaluate admin-user + orgView + phi permission
  rules.hasImpersonatedUserPhiPermission = AuthUtils.isImpersonatedAdminWithPhiPermission();
  if (data.therapy?.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) rules.hasImpersonatedUserPhiPermission = true;

  this.rules = rules;
}

export default Order;
