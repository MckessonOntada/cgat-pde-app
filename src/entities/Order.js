import AuthUtils from '@src/util/AuthUtils';

function Order(data) {
  Object.assign(this, data);

  const rules = {};

  //evaluate admin-user + orgView + phi permission
  const iUser = AuthUtils.getImpersonateId();
  rules.hasImpersonatedUserPhiPermission = AuthUtils.isImpersonatedAdminWithPhiPermission();

  this.rules = rules;
}

export default Order;
