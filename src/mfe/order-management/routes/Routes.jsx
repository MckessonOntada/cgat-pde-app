import React from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { routesConfig } from './constants';
import OrderIndex from './../pages/orders';
import OrderStatus from '../pages/orders/status/OrderStatus';
import TherapySelection from '../pages/create/form-segments/therapy-selection';
import AccountSelection from '../pages/create/form-segments/account-selection/AccountSelection';
import PatientDetails from '../pages/create/form-segments/patient-details';
import Summary from '../pages/create/form-segments/summary';
import AdditionalDetails from '../pages/create/form-segments/additional-details';
import NotFound from '../../../pages/error-pages/NotFound';
import { OrderProvider } from '../context/OrderContext';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import ProtectedRoute from '@src/routes/ProtectedRoute';
import UploadOrderDocument from '../pages/create/form-segments/upload-document';
import PayersDetails from '../pages/create/form-segments/payers-details';
import FinalizeOrder from '../pages/create/form-segments/finalize-order';
import OrcaPatientDetails from '../pages/create/form-segments/summary/orca-patient-details/OrcaPatientDetails';
import { useWidgetContext } from '@src/context/WidgetContext';
import { TableProvider } from '@src/context/TableContext';
import OrderService from '@src/api/commonService/OrderService';
import useRouteMode from '@src/mfe/user-management/routes/useRouteMode';
import AuthUtils from '@src/util/AuthUtils';
import { normalizeOrderResponse } from '../pages/create/form-segments/OrderUtil';

function OrderManagementRoutes() {
  const orderPermissions = [
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.THERAPY_SELECTION,
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.ACCOUNT_SELECTION,
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.UPDATE_PATIENTS_DETAILS,
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.UPDATE_ADDITIONAL_DETAILS,
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.SUBMIT_ORDER,
    PERMISSIONS_ENUM.ORDER_MANAGEMENT.VIEW_ORDERS
  ];
  return (
    <Routes>
      <Route
        path={routesConfig.index}
        element={
          <OrderProvider>
            <OrderIndex />
          </OrderProvider>
        }
      />

      <Route path="create" element={<OrderLoader />}>
        <Route path="" element={<CreateOrderWrapper />}>
          <Route index element={<Navigate to={'therapy-selection'} replace />} />
          <Route
            path={'therapy-selection'}
            element={
              <ProtectedRoute permissions={orderPermissions}>
                <TableProvider fetchFn={OrderService.getTherapies}>
                  <TherapySelection />
                </TableProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path={':orderId/therapy-selection'}
            element={
              <ProtectedRoute permissions={orderPermissions}>
                <TableProvider fetchFn={OrderService.getTherapies}>
                  <TherapySelection />
                </TableProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path={`:orderId/account-details`}
            element={
              <ProtectedRoute permissions={orderPermissions}>
                <AccountSelection />
              </ProtectedRoute>
            }
          />
          <Route path={`:orderId/payer-details`} element={<PayersDetails />} />
          <Route path={`:orderId/patient-details`} element={<PatientDetails />} />
          <Route path={`:orderId/additional-details`} element={<AdditionalDetails />} />
        </Route>
      </Route>
      <Route path=":orderId" element={<OrderLoader />}>
        <Route path={`review`} element={<FinalizeOrder />} />
        <Route path={`verification/:manufacturer`} element={<OrcaPatientDetails />} />
        <Route path={`documents/upload`} element={<UploadOrderDocument />} />
        <Route path={`status`} element={<OrderStatus />} />
        <Route path={`summary`} element={<Summary />} />
      </Route>

      <Route path="" element={<OrderLoader />}>
        <Route
          path={`edit/:orderId`}
          element={
            <ProtectedRoute permissions={orderPermissions}>
              <TableProvider fetchFn={OrderService.getTherapies}>
                <TherapySelection />
              </TableProvider>
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
}

export const OrderLoader = () => {
  const { state, setValue } = useWidgetContext();
  const { id } = useRouteMode({ editSegment: 'edit', paramKey: 'orderId' });
  const isCustomerReviewOrderWizard = AuthUtils.isCustomerCenterView();
  const navigate = useNavigate();

  const refreshOrderDetails = React.useCallback(async () => {
    try {
      const params = new URLSearchParams(location.search);
      const orgId = params.get('orgId');
      const result = isCustomerReviewOrderWizard
        ? await OrderService.getOrderByIdCsUser(id, orgId)
        : await OrderService.getOrderById(id);
      if (result) {
        const beautifiedOrderDetails = normalizeOrderResponse(result);
        const loggedInUserId = AuthUtils.getUserId();
        const { approver = {} } = beautifiedOrderDetails;
        setValue('orderDetails', beautifiedOrderDetails);
        setValue('isApprover', approver.id === loggedInUserId);
      }
    } catch (error) {
      if (error?.status === 404) {
        navigate('/orders', {
          state: {
            alert: {
              type: 'error',
              description: 'Order details not found.'
            }
          }
        });
      }
    }
  }, [id, isCustomerReviewOrderWizard]);

  React.useEffect(() => {
    if (id) setValue('refetchOrderDetails', refreshOrderDetails);
  }, [refreshOrderDetails]);

  React.useEffect(() => {
    if (!id) {
      setValue('isLoading', false);
      setValue('orderDetails', {});
      setValue('isChangeOnPreviousStep', false);
      setValue('isApprover', false);
      return;
    }
    setValue('orderDetails', {});
    setValue('isChangeOnPreviousStep', false);
    setValue('isApprover', false);
    let fetchPromise = null;
    if (isCustomerReviewOrderWizard) {
      const params = new URLSearchParams(location.search);
      const orgId = params.get('orgId');

      fetchPromise = OrderService.getOrderByIdCsUser(id, orgId);
    } else {
      fetchPromise = OrderService.getOrderById(id);
    }

    if (fetchPromise) {
      fetchPromise
        .then((result) => {
          if (result) {
            const beautifiedOrderDetails = normalizeOrderResponse(result);
            const loggedInUserId = AuthUtils.getUserId();
            const { approver = {} } = beautifiedOrderDetails;
            setValue('orderDetails', beautifiedOrderDetails);
            setValue('isApprover', approver.id === loggedInUserId);
          }
        })
        .catch((error) => {
          if (error.status === 404) {
            navigate('/orders', {
              state: {
                alert: {
                  type: 'error',
                  description: 'Order details not found.'
                }
              }
            });
          }
        })
        .finally(() => {
          setValue('isLoading', false);
        });
    }
  }, [id, location.pathname]);

  if (state.isLoading) return <Loader variant="circular" />;
  return <Outlet />;
};

const CreateOrderWrapper = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default OrderManagementRoutes;
