import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';
import { Button } from '@mckesson/mcp-component-library';

import ErrorComponent from '../components/app/error/ErrorComponent';

import { debugIds, ID } from '../common/constants/id';

import styles from '../../src/assets/styles/MainLayout.module.scss';
import AccessDeniedPage from './accessDenied/accessDenied';
import AuthUtils from '../common/util/AuthUtils';
import AppRoutes from '../routes/AppRoutes';
import Header from '../components/header';

const UsersEntryPoint = React.lazy(() => import('../mfe/user-management'))

function MainLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const userHasRoutePermission = AuthUtils.userHasRoutePermission(pathname);

  return (
    <Box id={debugIds(ID.MAIN)}>
      <header id={debugIds(ID.HEADER, ID.CONTAINER)}>
        <Header />
      </header>
      <div className={styles.home} id={debugIds(ID.HOME)}>
        <Suspense fallback={<></>}>
          {userHasRoutePermission ? (
            <div className={styles.routeContent} id={debugIds(ID.HOME, ID.ROUTE_CONTENT)}>
              <Routes className={styles.routes}>
                {AppRoutes.routes.map((route, idx) => {
                  return route.element ? (
                    <Route key={idx} path={route.path} element={<route.element />} />
                  ) : null;
                })}
                <Route path={AppRoutes.pathUserManagement} element={<Outlet />}>
                  <Route path={"/user"} element={<UsersEntryPoint />} />
                  <Route path={"/user/*"} element={<UsersEntryPoint />} />
                </Route>
              </Routes>

            </div>
          ) : (
            <ErrorComponent
              variant="center"
              type="access-denied"
              header="Access Denied"
              body="You do not have permission to access this page. "
              bodyFooter={
                <Button data-testid="deny-back-button" variant="text" onClick={() => navigate(-1)}>
                  Go Back
                </Button>
              }
            />
          )}
        </Suspense>
      </div>
    </Box>
  );
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {})(MainLayout);
