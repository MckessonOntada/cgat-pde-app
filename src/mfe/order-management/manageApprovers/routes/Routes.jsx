import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from './constants';
import NotFound from '@src/pages/error-pages/NotFound';
import Home from '../pages/Dashboard';
import CreateApproverGroup from '../pages/CreateApproverGroup';
import ApproverGroupDetails from '../pages/ApproverGroupDetail';
import EditApproverGroup from '../pages/CreateApproverGroup';
function ManageApproverRoute() {
  return (
    <Routes>
      <Route path={PATHS.dashboard} element={<Home />} />
      <Route path={PATHS.createapprovergroup} element={<CreateApproverGroup />} />
      <Route path={PATHS.approvergroupDetail} element={<ApproverGroupDetails />} />
      <Route path={`${PATHS.editapprovergroup}/:grpId`} element={<EditApproverGroup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default ManageApproverRoute;
