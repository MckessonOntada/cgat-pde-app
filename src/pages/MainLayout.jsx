import React, { Suspense, useEffect } from 'react';
import { connect } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Button, Loader } from '@mckesson/mcp-component-library';

import ErrorComponent from '../components/error/ErrorComponent';
import { debugIds, ID } from '@src/constants/id';

import styles from '../../src/assets/styles/MainLayout.module.scss';
import AuthUtils from '@src/util/AuthUtils';
import AppRoutes from '../routes/AppRoutes';
import Header from '../components/header';
import NotFound from './error-pages/NotFound';
import ProtectedRoute from '@src/routes/ProtectedRoute';
import { routePermissionConfig } from '@src/routes/RoutePermissionConstats';
import Role from '@src/mfe/org-management/pages/role';
import ScrollToTop from '@src/components/scrollToTop/ScrollToTop';
import ManageApprovers from '@src/mfe/order-management/manageApprovers';
import { AccountProvider } from '@src/mfe/finance-management/context/AccountContext';
import Details from '@src/mfe/finance-management/pages/details';
import { PATHS as PaymentInvoicesPaths } from '@src/mfe/finance-management/routes';

const UsersEntryPoint = React.lazy(() => import('../mfe/user-management'));
const OrderManagementEntryPoint = React.lazy(() => import('@src/mfe/order-management'));
const OrgEntryPoint = React.lazy(() => import('@src/mfe/org-management'));
const PaymentInvoices = React.lazy(() => import('@src/mfe/finance-management'));

function MainLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div id={debugIds(ID.MAIN)} className={styles.appContainer}>
      <Header />
      <div className={styles.home} id={debugIds(ID.HOME)}>
        <ScrollToTop containerId={debugIds(ID.HOME)} />
        <Suspense fallback={<Loader type="screen" />}>
          <div className={styles.routeContent} id={debugIds(ID.HOME, ID.ROUTE_CONTENT)}>
            <Routes className={styles.routes}>
              {AppRoutes.routes.map((route, idx) => {
                return route.element ? (
                  <Route
                    key={idx}
                    path={route.path}
                    element={
                      <ProtectedRoute isDashboard={route.isDashboard}>
                        <route.element />
                      </ProtectedRoute>
                    }
                  />
                ) : null;
              })}
              <Route
                path={'orders/*'}
                element={
                  <ProtectedRoute permissions={routePermissionConfig.orders}>
                    <OrderManagementEntryPoint />
                  </ProtectedRoute>
                }
              />

              <Route
                path={AppRoutes.pathUserManagement}
                element={
                  <ProtectedRoute permissions={routePermissionConfig.users}>
                    <Outlet />
                  </ProtectedRoute>
                }>
                <Route
                  path={'/user'}
                  element={
                    <ProtectedRoute permissions={routePermissionConfig.users}>
                      <UsersEntryPoint />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={'/user/*'}
                  element={
                    <ProtectedRoute permissions={routePermissionConfig.users}>
                      <UsersEntryPoint />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path={`/organization/roles/*`}
                element={
                  <ProtectedRoute permissions={routePermissionConfig.roles}>
                    <Role />
                  </ProtectedRoute>
                }
              />
              <Route
                path={`/approver-group/*`}
                element={
                  <ProtectedRoute permissions={routePermissionConfig.approvergroups}>
                    <ManageApprovers />
                  </ProtectedRoute>
                }
              />
              <Route
                path={'/organization'}
                element={
                  AuthUtils.isSystemAdmin() && !AuthUtils.isSystemAdminView() ? (
                    <Navigate to={'/'} />
                  ) : (
                    <ProtectedRoute permissions={routePermissionConfig.organization}>
                      <Outlet />
                    </ProtectedRoute>
                  )
                }>
                <Route
                  path={'/organization'}
                  element={
                    <ProtectedRoute permissions={routePermissionConfig.organization}>
                      <OrgEntryPoint />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={'/organization/*'}
                  element={
                    <ProtectedRoute permissions={routePermissionConfig.organization}>
                      <OrgEntryPoint />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path={'/record/invoices/:billNumber/details'}
                element={
                  <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
                    <AccountProvider>
                      <Details type={PaymentInvoicesPaths.invoices} />
                    </AccountProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path={'/record/credits/:billNumber/details'}
                element={
                  <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
                    <AccountProvider>
                      <Details type={PaymentInvoicesPaths.credits} />
                    </AccountProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path={'/record/pending-payments/:confirmationNumber/confirmation'}
                element={
                  <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
                    <AccountProvider>
                      <Details />
                    </AccountProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path={'/record/payment-history/:confirmationNumber/confirmation'}
                element={
                  <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
                    <AccountProvider>
                      <Details />
                    </AccountProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path={'/record/*'}
                element={
                  <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
                    <AccountProvider>
                      <PaymentInvoices />
                    </AccountProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path={'/system-admin'}
                element={
                  AuthUtils.isSystemAdmin() && !AuthUtils.isSystemAdminView() ? (
                    <Navigate to={'/'} />
                  ) : (
                    <ProtectedRoute permissions={routePermissionConfig.systemAdmin}>
                      <Outlet />
                    </ProtectedRoute>
                  )
                }>
                <Route
                  path={'/system-admin'}
                  element={
                    <ProtectedRoute permissions={routePermissionConfig.systemAdmin}>
                      <UsersEntryPoint />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={'/system-admin/*'}
                  element={
                    <ProtectedRoute permissions={routePermissionConfig.systemAdmin}>
                      <UsersEntryPoint />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {})(MainLayout);
