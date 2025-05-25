import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader } from '@mckesson/mcp-component-library';
import { debugIds, ID } from '@src/constants/id';
import styles from '../../src/assets/styles/MainLayout.module.scss';
import AuthUtils from '@src/util/AuthUtils';
import AppRoutes from '../routes/AppRoutes';
import Header from '../components/header';
import NotFound from './error-pages/NotFound';
import ProtectedRoute from '@src/routes/ProtectedRoute';
import { routePermissionConfig } from '@src/routes/RoutePermissionConstats';
import ScrollToTop from '@src/components/scrollToTop/ScrollToTop';
import RecordsMainRoutes from '@src/mfe/finance-management/RecordsMainRoutes';
import { AccountProvider } from '@src/mfe/finance-management/context/AccountContext';
import Footer from '@src/components/footer';
import ErrorWrapper from './ErrorWrapper';
import AccountSetting from '@src/components/AccountSetting';
import { FooterProvider } from '@src/components/footer/FooterContext';
import Dashboard from '@src/mfe/core-config/system-admin';
import AdminRoutes from '@src/mfe/core-config/admin';
import Notifications from '@src/mfe/notification-mfe/Notifications';
import { NotificationDrawer } from '@src/mfe/notification-mfe/components/NotificationDrawer/NotificationDrawer';
import { useNotifications } from '@src/mfe/notification-mfe/context/NotificationsContext';
const UsersEntryPoint = React.lazy(() => import('../mfe/user-management'));
const OrderManagementEntryPoint = React.lazy(() => import('@src/mfe/order-management'));
const OrgEntryPoint = React.lazy(() => import('@src/mfe/org-management'));

function MainLayout() {
  const { notificationDrawerOpen, setNotificationDrawerOpen } = useNotifications();

  return (
    <div id={debugIds(ID.MAIN)} className={styles.appContainer}>
      <Header
        onNotificationClick={() =>
          setNotificationDrawerOpen(!notificationDrawerOpen)
        }
      />
      <NotificationDrawer />
      <ErrorWrapper>
        <div className={`${styles['app-wrapper']}`} id={debugIds(ID.APP_WRAPPER)}>
          <FooterProvider>
            <div className={`${styles.home} max-container`} id={debugIds(ID.HOME)}>
              <ScrollToTop containerId={debugIds(ID.APP_WRAPPER)} />
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
                      path={'system-admin/*'}
                      element={
                        <ProtectedRoute permissions={routePermissionConfig.systemAdmin}>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path={'orders/*'}
                      element={
                        <ProtectedRoute permissions={[...routePermissionConfig.orders]}>
                          <OrderManagementEntryPoint />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path={'/record/*'}
                      element={
                        <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
                          <AccountProvider>
                            <RecordsMainRoutes />
                          </AccountProvider>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      index={true}
                      path={'/admin/*'}
                      element={
                        !AuthUtils.isSystemAdminView() ? (
                          <ProtectedRoute
                            permissions={[...routePermissionConfig.approvergroups, ...routePermissionConfig.roles, ...routePermissionConfig.users]}>
                            <AdminRoutes />
                          </ProtectedRoute>
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    />
                    <Route path="/account-setting" element={<AccountSetting />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </Suspense>
            </div>
            <Footer />
          </FooterProvider>
        </div>
      </ErrorWrapper>
    </div>
  );
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {})(MainLayout);