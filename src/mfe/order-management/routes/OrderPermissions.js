import React from 'react';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';
import { ORDER_STAGES } from '../pages/create/form-segments/Constants';

export const STAGE_TO_PERMISSION_MAP = {
  [ORDER_STAGES.THERAPY_SELECTION]: PERMISSIONS_ENUM.CREATE_NEW_ORDER.THERAPY_SELECTION,
  [ORDER_STAGES.ACCOUNT_DETAILS]: PERMISSIONS_ENUM.CREATE_NEW_ORDER.ACCOUNT_SELECTION,
  [ORDER_STAGES.PATIENT_DETAILS]: PERMISSIONS_ENUM.CREATE_NEW_ORDER.UPDATE_PATIENTS_DETAILS,
  [ORDER_STAGES.PAYER_DETAILS]: PERMISSIONS_ENUM.CREATE_NEW_ORDER.UPDATE_PATIENTS_DETAILS,
  [ORDER_STAGES.ADDITIONAL_DETAILS]: PERMISSIONS_ENUM.CREATE_NEW_ORDER.UPDATE_ADDITIONAL_DETAILS,
  [ORDER_STAGES.ORDER_SUMMARY]: PERMISSIONS_ENUM.CREATE_NEW_ORDER.SUBMIT_ORDER
};

const withPermissions = (WrappedComponent, currentStage) => {
  return function WithPermissionsWrapper(props) {
    const { hasPermission } = usePermission();
    const requiredPermission = STAGE_TO_PERMISSION_MAP[currentStage];
    const canAccess = hasPermission(requiredPermission);

    const checkEditPermission = (stage) => {
      const requiredPermission = STAGE_TO_PERMISSION_MAP[stage];
      return hasPermission(requiredPermission);
    };

    return <WrappedComponent {...props} readOnly={!canAccess} hasPermission={canAccess} checkEditPermission={checkEditPermission} />;
  };
};

export default withPermissions;
