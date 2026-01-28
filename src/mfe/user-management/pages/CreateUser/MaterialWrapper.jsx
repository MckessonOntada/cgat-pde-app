import React from 'react';
import { TableProvider } from '@src/context/TableContext';
import AuthUtils from '@src/util/AuthUtils';
import { useWidgetContext } from '@src/context/WidgetContext';
import MaterialService from '@src/api/commonService/MaterialService';
import useRouteMode from '../../routes/useRouteMode';

function MaterialWrapper(props) {
  const { listingMode = 'ALL', children } = props;
  const { isEdit, id } = useRouteMode({ editSegment: 'edit', paramKey: 'userId' });
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { state } = useWidgetContext();
  const fetchMaterials = (params) => {
    if (isSystemAdminView && state.selectedRole === 'Customer Centre') {
      return MaterialService.getAllMaterialsForCustomerCentre(id, { ...params, listingMode });
    } else {
      return MaterialService.getAllMaterials(id, { ...params, listingMode });
    }
  };
  return <TableProvider fetchFn={fetchMaterials}>{children}</TableProvider>;
}

export default MaterialWrapper;
