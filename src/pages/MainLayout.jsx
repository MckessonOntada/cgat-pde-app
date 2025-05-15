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
import { SystemConfiguration } from '@src/mfe/core-config';
import { AccountProvider } from '@src/mfe/finance-management/context/AccountContext';
import Footer from '@src/components/footer';
import ErrorWrapper from './ErrorWrapper';
import AccountSetting from '@src/components/AccountSetting';
import ManageProviders from '@src/mfe/core-config/manage-providers';
import ManageCrossWalk from '@src/mfe/core-config/manage-crosswalk';
import ManageSPCatalog from '@src/mfe/core-config/manage-sp-catalog';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import { FooterProvider } from '@src/components/footer/FooterContext';
import { OrgAccountSelectionProvider } from '@src/mfe/order-management/components/orgAccountSelection/context/OrgAccountSelectionContext';
import { SPMaterialProvider } from '@src/mfe/core-config/manage-sp-material/context/SPMaterialContext';
import { QuestionnaireProvider } from '@src/mfe/order-management/context/QuestionnaireContext';
import { ManageMaterialProvider } from '@src/mfe/order-management/context/ManageMaterialContext';
import ManageCatalogRoute from '@src/mfe/core-config/manage-catalog/routes/Routes';
import ManageMaterial from '@src/mfe/core-config/manage-material/ManageMaterial';
import ManageAccountRoute from '@src/mfe/core-config/manage-account/routes/Routes';
import ManageSPMaterialRoute from '@src/mfe/core-config/manage-sp-material/routes/Routes';
import ManageSPAccountRoute from '@src/mfe/core-config/manage-sp-account/routes/Routes';
import Questionnaire from '@src/mfe/core-config/questionnaire';

const UsersEntryPoint = React.lazy(() => import('../mfe/user-management'));
const OrderManagementEntryPoint = React.lazy(() => import('@src/mfe/order-management'));
const OrgEntryPoint = React.lazy(() => import('@src/mfe/org-management'));

function MainLayout() {
  return (
    <div id={debugIds(ID.MAIN)} className={styles.appContainer}>
      <Header />
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
                      path={AppRoutes.pathSystemConfiguration}
                      element={
                        <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
                          <SystemConfiguration />
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
                      path={`${AppRoutes.pathUserManagement}/*`}
                      element={
                        <ProtectedRoute permissions={routePermissionConfig.users}>
                          <UsersEntryPoint />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/admin/*">
                      <Route
                        path={'providers/*'}
                        element={
                          <ProtectedRoute permissions={Object.values(PERMISSIONS_ENUM.MANAGE_PROVIDERS)}>
                            <ManageProviders />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={'crosswalk/*'}
                        element={
                          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
                            <ManageCrossWalk />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path={'sp-catalog/*'}
                        element={
                          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
                            <ManageSPCatalog />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={'manage-material/*'}
                        element={
                          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
                            <ManageMaterialProvider>
                              <ManageMaterial />
                            </ManageMaterialProvider>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={'manage-catalog/*'}
                        element={
                          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
                            <OrgAccountSelectionProvider showAccountsSelect={true}>
                              <ManageCatalogRoute />
                            </OrgAccountSelectionProvider>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={`questionnaire/*`}
                        element={
                          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
                            <QuestionnaireProvider>
                              <Questionnaire />
                            </QuestionnaireProvider>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={'manage-account/*'}
                        element={
                          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
                            <OrgAccountSelectionProvider showAccountsSelect={true}>
                              <ManageAccountRoute />
                            </OrgAccountSelectionProvider>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={'manage-sp-material/*'}
                        element={
                          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
                            <SPMaterialProvider>
                              <ManageSPMaterialRoute />
                            </SPMaterialProvider>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path={'manage-sp-account/*'}
                        element={
                          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
                            <OrgAccountSelectionProvider enableAcct={false} defaultFirstOrgSelected={true}>
                              <ManageSPAccountRoute />
                            </OrgAccountSelectionProvider>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={`organization/roles/*`}
                        element={
                          <ProtectedRoute permissions={routePermissionConfig.roles}>
                            <Role />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={`approver-group/*`}
                        element={
                          <ProtectedRoute permissions={routePermissionConfig.approvergroups}>
                            <ManageApprovers />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={'organization/*'}
                        element={
                          AuthUtils.isSystemAdmin() && !AuthUtils.isSystemAdminView() ? (
                            <Navigate to={'/'} />
                          ) : (
                            <ProtectedRoute permissions={routePermissionConfig.organization}>
                              <OrgEntryPoint />
                            </ProtectedRoute>
                          )
                        }
                      />
                    </Route>
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
                      path={'/admin'}
                      element={
                        !AuthUtils.isSystemAdminView() ? (
                          <ProtectedRoute
                            permissions={[...routePermissionConfig.approvergroups, ...routePermissionConfig.roles, ...routePermissionConfig.users]}>
                            <AdminLayout />
                          </ProtectedRoute>
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    />
                    <Route path="/account-setting" element={<AccountSetting />} />
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
