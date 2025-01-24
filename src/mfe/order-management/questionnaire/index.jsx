import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ManageQuestionnaire from './ManageQuestionnaire';
import AddQuestionnaire from './AddQuestionnaire';

function Questionnaire() {
  return (
    <Routes>
      <Route path="" index element={<ManageQuestionnaire />} />
      <Route path="/add" element={<AddQuestionnaire />} />
    </Routes>
  );
}

export default Questionnaire;
