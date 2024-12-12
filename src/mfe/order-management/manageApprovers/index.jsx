import React from 'react';
import ManageApproverRoute from './routes/Routes';
import { ApproverProvider } from './context/ApproverContext';

const ManageApprovers = () => {
  return (
    <div>
      <ApproverProvider>
        <ManageApproverRoute />
      </ApproverProvider>
    </div>
  );
};

export default ManageApprovers;
