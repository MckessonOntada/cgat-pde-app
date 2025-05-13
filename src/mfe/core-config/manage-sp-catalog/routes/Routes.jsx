import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTE_PATHS } from './constants';
import Index from '../pages';
import Upload from '../pages/upload';
import LinkSPMaterial from '../pages/link';
import { OrgAccountSelectionProvider } from '@src/mfe/order-management/components/orgAccountSelection/context/OrgAccountSelectionContext';
import { SPMaterialProvider } from '@src/mfe/order-management/pages/system-configuration/manage-spmaterial/context/SPMaterialContext';
import ReviewCatalogList from '../pages/link/ReviewCatalog';
import { OrgAccountMultiSelectionProvider } from '../pages/context/OrgAccountMultiSelectContext';

const SPCatalogRouter = () => {
  return (
    <OrgAccountMultiSelectionProvider enableOrg={true}>
      <Routes>
        <Route index path={ROUTE_PATHS.DASHBOARD} element={<Index />} />
        <Route path={ROUTE_PATHS.DETAILS} element={<div>Details</div>} />
        <Route path={ROUTE_PATHS.CREATE} element={<div>Create</div>} />
        <Route
          path={ROUTE_PATHS.LINK}
          element={
            <SPMaterialProvider isLinkCatalog={true}>
              <LinkSPMaterial />
            </SPMaterialProvider>
          }
        />
        <Route
          path={ROUTE_PATHS.REVIEW}
          element={
            <SPMaterialProvider isLinkCatalog={true}>
              <ReviewCatalogList />
            </SPMaterialProvider>
          }
        />
        <Route path={ROUTE_PATHS.UPLOAD} element={<Upload />} />
      </Routes>
    </OrgAccountMultiSelectionProvider>
  );
};

export default SPCatalogRouter;
