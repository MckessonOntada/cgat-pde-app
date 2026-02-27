import { Loader } from '@mckesson/mcp-component-library';
import AccountSetting from '@src/components/AccountSetting';
import Footer from '@src/components/footer';
import { FooterProvider } from '@src/components/footer/FooterContext';
import ScrollToTop from '@src/components/scrollToTop/ScrollToTop';
import { debugIds, ID } from '@src/constants/id';
import AdminRoutes from '@src/mfe/core-config/admin';
import NotificationPreference from '@src/mfe/core-config/notifications-setting/UserNotificationPreference';
import Dashboard from '@src/mfe/core-config/system-admin';
import RecordsMainRoutes from '@src/mfe/finance-management/RecordsMainRoutes';
import { AccountProvider } from '@src/mfe/finance-management/context/AccountContext';
import Notifications from '@src/mfe/notification-mfe/Notifications';
import { NotificationDrawer } from '@src/mfe/notification-mfe/components/NotificationDrawer/NotificationDrawer';
import { useNotifications } from '@src/mfe/notification-mfe/context/NotificationsContext';
import ProtectedRoute from '@src/routes/ProtectedRoute';
import { routePermissionConfig } from '@src/routes/RoutePermissionConstats';
import AuthUtils from '@src/util/AuthUtils';
import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import styles from '../../src/assets/styles/MainLayout.module.scss';
import Header from '../components/header';
import AppRoutes from '../routes/AppRoutes';
import ErrorWrapper from './ErrorWrapper';
import NotFound from './error-pages/NotFound';
import { WidgetProvider } from '@src/context/WidgetContext';
import { CSReviewOrders } from '@src/mfe/core-config/system-admin/cs-review-orders';

const OrderManagementEntryPoint = React.lazy(() => import('@src/mfe/order-management'));
const INITIAL_STATE = {
  orcaPatient: null,
  isVerified: false
};
function MainLayout() {
  const { notificationDrawerOpen, setNotificationDrawerOpen } = useNotifications();
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  return (
    <div id={debugIds(ID.MAIN)} className={styles.appContainer}>
      <Header onNotificationClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)} />
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
                        <ProtectedRoute
                          permissions={[
                            ...routePermissionConfig.systemAdmin,
                            ...routePermissionConfig.organization,
                            ...routePermissionConfig.systemConfiguration
                          ]}>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path={'orders/*'}
                      element={
                        isCustomerCenter ? (
                          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
                            <WidgetProvider initialState={INITIAL_STATE}>
                              <CSReviewOrders />
                            </WidgetProvider>
                          </ProtectedRoute>
                        ) : (
                          <ProtectedRoute permissions={[...routePermissionConfig.orders]}>
                            <OrderManagementEntryPoint />
                          </ProtectedRoute>
                        )
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
                    <Route element={<UserOnlyRout />}>
                      <Route path="/notification-setting" element={<NotificationPreference />} />
                    </Route>
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

const UserOnlyRout = () => {
  const isSystemAdmin = AuthUtils.isRootAdmin();
  return isSystemAdmin ? <Navigate to="/" /> : <Outlet />;
};

const mapStateToProps = () => ({});
export default connect(mapStateToProps, {})(MainLayout);
