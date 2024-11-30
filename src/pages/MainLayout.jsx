import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Button, Loader } from '@mckesson/mcp-component-library';

import ErrorComponent from '../components/error/ErrorComponent';
import { debugIds, ID } from '@src/constants/id';

import styles from '../../src/assets/styles/MainLayout.module.scss';
import AuthUtils from '@src/util/AuthUtils';
import AppRoutes from '../routes/AppRoutes';
import Header from '../components/header';
import NotFound from './error-pages/NotFound';

const UsersEntryPoint = React.lazy(() => import('../mfe/user-management'));
const OrderManagementEntryPoint = React.lazy(() => import('@src/mfe/order-management'));
const OrgEntryPoint = React.lazy(() => import('@src/mfe/org-management'));
const PaymentInvoices = React.lazy(() => import('@src/mfe/paymentInvoices'))

function MainLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const userHasRoutePermission = AuthUtils.userHasRoutePermission(pathname);
  return (
    <div id={debugIds(ID.MAIN)} className={styles.appContainer}>
      <Header />
      <div className={styles.home} id={debugIds(ID.HOME)}>
        <Suspense fallback={<Loader type="screen" />}>
          {userHasRoutePermission ? (
            <div className={styles.routeContent} id={debugIds(ID.HOME, ID.ROUTE_CONTENT)}>
              <Routes className={styles.routes}>
                {AppRoutes.routes.map((route, idx) => {
                  return route.element ? (
                    <Route key={idx} path={route.path} element={<route.element />} />
                  ) : null;
                })}
                <Route path={'orders/*'} element={<OrderManagementEntryPoint />} />

                <Route path={AppRoutes.pathUserManagement} element={<Outlet />}>
                  <Route path={'/user'} element={<UsersEntryPoint />} />
                  <Route path={'/user/*'} element={<UsersEntryPoint />} />
                </Route>
                <Route path={AppRoutes.pathOrgManagement} element={<Outlet />}>
                  <Route path={'/organization'} element={<OrgEntryPoint />} />
                  <Route path={'/organization/*'} element={<OrgEntryPoint />} />
                </Route>
                <Route path={'/record/*'} element={<PaymentInvoices />} />
                <Route path={AppRoutes.pathSystemAdminManagement} element={<Outlet />}>
                  <Route path={'/system-admin'} element={<UsersEntryPoint />} />
                  <Route path={'/system-admin/*'} element={<UsersEntryPoint />} />
                </Route>
                <Route path="*" element={<NotFound />} />
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
    </div>
  );
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {})(MainLayout);
