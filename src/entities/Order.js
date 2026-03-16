import AuthUtils from '@src/util/AuthUtils';

function Order(data) {
  Object.assign(this, data);

  const rules = {};

  //evaluate admin-user + orgView + phi permission
  const iUser = AuthUtils.getImpersonateId();
  rules.hasImpersonatedUserPhiPermission =
    AuthUtils.getImpersonateId() > 0 && !AuthUtils.isSystemAdminView() ? AuthUtils.impersonatedUserHasPermission(['VIEW_PHI_INFORMATION']) : true;

  this.rules = rules;
}

export default Order;
