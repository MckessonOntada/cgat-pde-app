import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { routesConfig } from './constants';
import Home from "./Dashboard";
import AddQuestionnaire from '../questionnaire/Create';
import MapQuestionnaire from './manageMaster/mapQuestionnaire';
import NotFound from '@src/pages/error-pages/NotFound';
import { ManageQuestionnaireProvider } from '../context/ManageQuestionnaireContext';


function ManageQuestionnaireRoute() {
  return (
    <ManageQuestionnaireProvider>
    <Routes>
      <Route path={routesConfig.dashboard} element={<Home/>}></Route>
      <Route path={routesConfig.addQuestionnaire} element={<AddQuestionnaire/>}></Route> 
      <Route path={routesConfig.mapQuestionnaire} element={<MapQuestionnaire/>}></Route> 
      <Route path="*" element={<NotFound />} /> 
    </Routes></ManageQuestionnaireProvider>
  );
}

export default ManageQuestionnaireRoute;
