import React from 'react';
import SPCatalogRouter from './routes/Routes';
import { OrgAccountMultiSelectionProvider } from './pages/context/OrgAccountMultiSelectContext';
import { useLocation } from 'react-router-dom';
import { ROUTE_PATHS } from './routes/constants';

const ManageSPCatalog = () => {
  const location = useLocation();
  const isLinkCatalog = location.pathname.endsWith(`/${ROUTE_PATHS.LINK}`) || location.pathname.endsWith(`/${ROUTE_PATHS.REVIEW}`);
  return (
    <div>
      <OrgAccountMultiSelectionProvider enableOrg={true} enableAcct={true} isLinkCatalog={isLinkCatalog}>
        <SPCatalogRouter />
      </OrgAccountMultiSelectionProvider>
    </div>
  );
};

export default ManageSPCatalog;
