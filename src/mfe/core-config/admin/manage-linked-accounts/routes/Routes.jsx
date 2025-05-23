import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ManageLinkedAccount from '..';

const ManagedLinkedAccounts = () => {
  return (
    <Routes>
      <Route index path="/" element={<ManageLinkedAccount/>} />
    </Routes>
  );
};

export default ManagedLinkedAccounts;
