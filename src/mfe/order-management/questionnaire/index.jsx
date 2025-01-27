import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ManageQuestionnaire from './ManageQuestionnaire';
import AddQuestionnaire from './AddQuestionnaire';
import { ROUTE_CONFIG } from './constants';
import MapQuestionnaire from './manageMaster/mapQuestionnaire';
import NotFound from '@src/pages/error-pages/NotFound';
import { OrgAccountSelectionProvider } from '../components/orgAccountSelection/context/OrgAccountSelectionContext';
import { ManageQuestionnaireProvider } from '../context/ManageQuestionnaireContext';
import { MasterEntityType } from './util';

function Questionnaire() {
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
    <Routes>
      <Route path="" index element={<ManageQuestionnaire />} />
      <Route path={ROUTE_CONFIG.ADD_QUESTIONNAIRE} element={<AddQuestionnaire />} />
      <Route path={`${ROUTE_CONFIG.EDIT_QUESTIONNAIRE}/:id`} element={<AddQuestionnaire />} />
      <Route
        path={ROUTE_CONFIG.MAP_QUESTIONNAIRE}
        element={
          <OrgAccountSelectionProvider enableOrg={handleOrg()} enableAcct={handleAccount()}>
            <ManageQuestionnaireProvider>
              <MapQuestionnaire />
            </ManageQuestionnaireProvider>
          </OrgAccountSelectionProvider>
        }></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Questionnaire;
