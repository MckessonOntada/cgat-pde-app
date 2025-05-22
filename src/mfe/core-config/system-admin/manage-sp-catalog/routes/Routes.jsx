import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTE_PATHS } from './constants';
import Index from '../pages';
import Upload from '../pages/upload';
import LinkSPMaterial from '../pages/link';
import { SPMaterialProvider } from '@src/mfe/core-config/system-admin/manage-sp-material/context/SPMaterialContext';
import ReviewCatalogList from '../pages/link/ReviewCatalog';
import { OrgAccountMultiSelectionProvider } from '../pages/context/OrgAccountMultiSelectContext';
import ViewSPCatalogConfig from '../pages/ViewSPCatalogConfig';
import ViewQuesionnairePreview from '../pages/ViewQuestionnairePreview';

const SPCatalogRouter = () => {
  return (
    <OrgAccountMultiSelectionProvider enableOrg={true}>
      <Routes>
        <Route index path={ROUTE_PATHS.DASHBOARD} element={<Index />} />
        <Route path={ROUTE_PATHS.DETAILS} element={<div>Details</div>} />
        <Route path={ROUTE_PATHS.CREATE} element={<div>Create</div>} />
        <Route path={ROUTE_PATHS.VIEWSPCATALOG} element={<ViewSPCatalogConfig />} />
        <Route path={ROUTE_PATHS.VIEWQUESTIONNAIREPRIVIEW} element={<ViewQuesionnairePreview />} />
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
