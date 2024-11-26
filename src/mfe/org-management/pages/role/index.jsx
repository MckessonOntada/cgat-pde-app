import React from 'react';
import { RoleProvider } from '../../context/RoleContext';
import RolesList from './list';
import RoleDetails from './manage/RoleDetails';
import RolePermissions from './manage/RolePermissions';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from '../../routes/constants';

const Role = () => {
    return (
        <RoleProvider>
          <Routes>
            <Route path="/" index element={<RolesList />} />
            <Route path={PATHS.createRole} element={<RoleDetails />} />
            <Route path={PATHS.editRole} element={<RoleDetails />} />
            <Route path={PATHS.permissions} element={<RolePermissions />} />
          </Routes>
        </RoleProvider>
    )
}
export default Role;