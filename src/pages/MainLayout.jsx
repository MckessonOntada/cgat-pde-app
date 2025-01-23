import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { Loader } from '@mckesson/mcp-component-library';
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
import RecordsMainRoutes from '@src/mfe/finance-management/RecordsMainRoutes';
import AdminLayout from './admin';
import { SystemConfiguration } from '@src/mfe/order-management/pages/system-configuration';

const UsersEntryPoint = React.lazy(() => import('../mfe/user-management'));
const OrderManagementEntryPoint = React.lazy(() => import('@src/mfe/order-management'));
const OrgEntryPoint = React.lazy(() => import('@src/mfe/org-management'));

function MainLayout() {
  return (
    <div id={debugIds(ID.MAIN)} className={styles.appContainer}>
      <Header />
      <div className={`${styles['app-wrapper']}`}>
        <div className={`${styles.home} max-container`} id={debugIds(ID.HOME)}>
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
                  path={AppRoutes.pathSystemConfiguration}
                  element={
                    <ProtectedRoute permissions={[]} isDashboard={true}>
                      <SystemConfiguration />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={'orders/*'}
                  element={
                    <ProtectedRoute permissions={[...routePermissionConfig.orders, ...routePermissionConfig.systemConfiguration]}>
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
                    path={'/admin/user'}
                    element={
                      <ProtectedRoute permissions={routePermissionConfig.users}>
                        <UsersEntryPoint />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={'/admin/user/*'}
                    element={
                      <ProtectedRoute permissions={routePermissionConfig.users}>
                        <UsersEntryPoint />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route
                  path={`/admin/organization/roles/*`}
                  element={
                    <ProtectedRoute permissions={routePermissionConfig.roles}>
                      <Role />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`/admin/approver-group/*`}
                  element={
                    <ProtectedRoute permissions={routePermissionConfig.approvergroups}>
                      <ManageApprovers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={'/admin/organization'}
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
                    path={'/admin/organization'}
                    element={
                      <ProtectedRoute permissions={routePermissionConfig.organization}>
                        <OrgEntryPoint />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={'/admin/organization/*'}
                    element={
                      <ProtectedRoute permissions={routePermissionConfig.organization}>
                        <OrgEntryPoint />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route
                  path={'/record/*'}
                  element={
                    <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
                      <RecordsMainRoutes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  index={true}
                  path={'/admin'}
                  element={
                    !AuthUtils.isSystemAdminView() ? (
                      <ProtectedRoute permissions={routePermissionConfig.admin}>
                        <AdminLayout />
                      </ProtectedRoute>
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {})(MainLayout);
