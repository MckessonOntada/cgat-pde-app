import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { routesConfig } from './constants';
import Home from './Dashboard';
import AddQuestionnaire from '../questionnaire/Create';
import MapQuestionnaire from './manageMaster/mapQuestionnaire';
import NotFound from '@src/pages/error-pages/NotFound';
import { ManageQuestionnaireProvider } from '../context/ManageQuestionnaireContext';
import { OrgAccountSelectionProvider } from '../components/orgAccountSelection/context/OrgAccountSelectionContext';
import { MasterEntityType } from './util';

function ManageQuestionnaireRoute() {
  const location = useLocation();
  
  const handleAccount = () => {
    if (location?.state?.value === MasterEntityType.Catalog) return true;
    return false;
  };
  const handleOrg = () => {
    if (location?.state?.value !== MasterEntityType.Material) return true;
    return false;
  };

  

  return (
    <OrgAccountSelectionProvider enableOrg={handleOrg()} enableAcct={handleAccount()}>
      <ManageQuestionnaireProvider>
        <Routes>
          <Route path={routesConfig.dashboard} element={<Home />}></Route>
          <Route path={routesConfig.addQuestionnaire} element={<AddQuestionnaire />}></Route>
          <Route path={routesConfig.mapQuestionnaire} element={<MapQuestionnaire />}></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ManageQuestionnaireProvider>
    </OrgAccountSelectionProvider>
  );
}

export default ManageQuestionnaireRoute;
