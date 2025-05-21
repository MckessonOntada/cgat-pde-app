import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ManageQuestionnaire from './ManageQuestionnaire';
import AddQuestionnaire from './AddQuestionnaire';
import { ROUTE_CONFIG } from './constants';
import MapQuestionnaire from './manage-master/mapQuestionnaire';
import NotFound from '@src/pages/error-pages/NotFound';
import { OrgAccountSelectionProvider } from './components/orgAccountSelection/context/OrgAccountSelectionContext';
import { ManageQuestionnaireProvider } from './context/ManageQuestionnaireContext';
import { MasterEntityType } from './util';
import { QuestionnaireProvider } from './context/QuestionnaireContext';
import ConfigurationPreview from './components/ConfigurationPreview';
import usePermission from '@src/hooks/usePermissions';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';

function Questionnaire() {
  const location = useLocation();
  const { hasPermission } = usePermission();

  const handleAccount = () => {
    if (location?.state?.value === MasterEntityType.Catalog) return true;
    return false;
  };
  const handleOrg = () => {
    if (location?.state?.value !== MasterEntityType.Material) return true;
    return false;
  };
  return (
    <QuestionnaireProvider>
      <Routes>
        <Route index element={<ManageQuestionnaire />} />
        {hasPermission(PERMISSIONS_ENUM.SYSTEM_CONFIGURATION.ADD_QUESTIONNAIRE) && (
          <Route path={ROUTE_CONFIG.ADD_QUESTIONNAIRE} element={<AddQuestionnaire />} />
        )}
        <Route path={`${ROUTE_CONFIG.VIEW_QUESTIONNAIRE}/:id`} element={<AddQuestionnaire />} />
        <Route
          path={ROUTE_CONFIG.MAP_QUESTIONNAIRE}
          element={
            <OrgAccountSelectionProvider enableOrg={handleOrg()} enableAcct={handleAccount()} enableConfigure={true}>
              <ManageQuestionnaireProvider>
                <MapQuestionnaire />
              </ManageQuestionnaireProvider>
            </OrgAccountSelectionProvider>
          }></Route>
        <Route path="*" element={<NotFound />} />

        <Route path={ROUTE_CONFIG.CONFIG_PREVIEW} element={<ConfigurationPreview />} />
      </Routes>
    </QuestionnaireProvider>
  );
}

export default Questionnaire;
