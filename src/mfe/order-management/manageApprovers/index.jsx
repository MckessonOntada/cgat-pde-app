import React from 'react';
import ManageApproverRoute from './routes/Routes';
import { ApproverProvider } from './context/ApproverContext';
import { FormProvider } from './context/FormContext';

const ManageApprovers = () => {
  return (
    <div>
      <ApproverProvider>
        <FormProvider>
          <ManageApproverRoute />
        </FormProvider>
      </ApproverProvider>
    </div>
  );
};

export default ManageApprovers;
