import React, { useContext, useState } from 'react';
import { Button } from '@mckesson/mcp-component-library';
import styles from './TherapySelection.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TherapyDataTable from './TherapyDataTable';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import CommonFilters from '@src/components/Filters';
import { useMutation } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';
import OrderStepper from '../OrderStepper';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import { TherapyDetailsConstantsForBB, TherapyDetailsConstantsForSP } from './assets/constants/TherapyDetailsConstants';
import TableHeading from '@src/components/tableHeading/TableHeading';
import TherapyDetailsWithTabs from '@src/components/therapyDetails/TherapyDetailsWithTabs';
import { FooterContext } from '@src/components/footer/FooterContext';
import Alert from '@src/components/cgat-alert/Alert';
import CommonUtils from '@src/util/CommonUtils';
import ModuleHeader from '@src/components/module-header';
import { ORDER_STATUS } from '../../../orders/config';
import { hasUnsavedChanges } from '@src/store/reducer/orderReducer';
import { useDispatch } from 'react-redux';
import { ORDER_STAGES } from '../Constants';
import Collaborator from '../Collaborator';
import withPermissions from '@src/mfe/order-management/routes/OrderPermissions';
import { getOrderStepCaption, normalizeOrderResponse, NotifyAlert } from '../OrderUtil';
import { useFilters } from '@src/context/TableContext';
import { useWidgetContext } from '@src/context/WidgetContext';
import useRouteMode from '@src/mfe/user-management/routes/useRouteMode';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';

function TherapySelection({ readOnly }) {
  const { t } = useTranslate();
  const { controlRef } = useContext(FooterContext);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location?.state || {};
  const { search, pathname } = location || {};
  const [prevSearchState, setPrevSearchState] = React.useState(null);
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { applyFilters, clearFilters } = useFilters();
  const { state, setValue } = useWidgetContext();
  const { orderDetails = {}, isApprover } = state;
  const { id, isEdit, params } = useRouteMode({ editSegment: 'edit', paramKey: 'orderId' });

  const [tradeDetails, setTradeDetails] = useState(isEdit && orderDetails?.tradeDetails);
  const [isDirty, setIsDirty] = React.useState(false);
  const searchParams = new URLSearchParams(search);
  const trade = searchParams.get('trade');
  const channelType = searchParams.get('channelType');

  const therapy = searchParams.get('therapy');
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const { isBack = false } = locationState || {};
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (!orderDetails?.id) return;

    const { isPapOrder, tradeDetails, therapyDetails = {}, status } = orderDetails;

    if (tradeDetails) {
      setTradeDetails({ ...tradeDetails, ...therapyDetails });
    }

    if (isPapOrder) {
      const prevSearch = locationState?.__prevSearch || '';
      navigate(`/orders${prevSearch}`);
      return;
    }

    if (status === ORDER_STATUS.REVIEW) {
      navigate(RoutePaths.pathOrderManagement, { replace: true });
    }
  }, [orderDetails]);

  React.useEffect(() => {
    const isDirty = tradeDetails?.ndc !== orderDetails?.tradeDetails?.ndc;
    setIsDirty(isDirty);
    if (orderDetails?.tradeDetails?.ndc) setValue('isTherapyChanged', isDirty);
    dispatch(hasUnsavedChanges(isDirty));
    return () => dispatch(hasUnsavedChanges(false));
  }, [tradeDetails]);

  React.useEffect(() => {
    if (locationState && locationState.__prevSearch) setPrevSearchState(locationState.__prevSearch);
  }, [location.search]);

  const handleOnClose = () => {
    searchParams.delete('trade');
    searchParams.delete('channelType');
    searchParams.delete('therapy');
    navigate({
      pathname,
      state: {
        ...locationState,
        ...(prevSearchState && { __prevSearch: prevSearchState })
      }
    });
  };

  const { isLoading: isSaving, mutate: createOrder } = useMutation({
    mutationFn: async (data) => OrderService.createOrder(data),
    onSuccess: (result) => {
      const { id } = result;
      const beautifiedOrderDetails = normalizeOrderResponse(result);
      setValue('orderDetails', beautifiedOrderDetails);
      navigate(`../${id}/account-details`, {
        state: {
          ...locationState,
          ...(prevSearchState && { __prevSearch: prevSearchState }),
          isEdit: false
        }
      });
    },
    onError: (error) => {
      const statusCode = error?.response?.status;
      let description = t('error.default');
      if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

      setAlert({
        description,
        type: 'error'
      });
    }
  });

  const navigateToNextStage = (id) => {
    navigate(`/orders/create/${id}/account-details`, {
      state: {
        ...locationState,
        ...(prevSearchState && { __prevSearch: prevSearchState }),
        isEdit: false
      }
    });
  };

  const { isLoading: isUpdating, mutate: updateTherapy } = useMutation({
    mutationFn: async ({ orderId, payload }) => {
      return await OrderService.updateTherapy(orderId, payload);
    },
    onSuccess: (result) => {
      const { id } = result;
      const beautifiedOrderDetails = normalizeOrderResponse(result);
      setValue('orderDetails', beautifiedOrderDetails);
      navigateToNextStage(id);
    },
    onError: (error) => {
      const statusCode = error?.response?.status;
      let description = t('error.default');
      if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

      setAlert({
        description,
        type: 'error'
      });
    }
  });

  const handleOnSubmit = () => {
    if (!tradeDetails) {
      setAlert({
        pinPoint: 'therapy-selection',
        description: 'Select therapy to create order',
        type: 'error'
      });
      return;
    }

    if (tradeDetails) {
      const payload = {
        ndc: tradeDetails.ndc,
        tradeName: tradeDetails.tradeName,
        channelType: tradeDetails.channelType
      };

      if (isEdit || isApprover || isBack) {
        if (isDirty) {
          updateTherapy({ orderId, payload });
        } else {
          navigateToNextStage(orderId);
        }
      } else {
        createOrder(payload);
      }
    }
  };

  const handleOnBackToOrders = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      const prevSearch = locationState?.__prevSearch || prevSearchState || '';
      navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : 'list');
      return;
    }
    if (isEdit) {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/summary`, {
        state: {
          ...locationState,
          ...(prevSearchState && { __prevSearch: prevSearchState }),
          isEdit: true
        }
      });
    } else {
      const prevSearch = locationState?.__prevSearch || prevSearchState || '';
      navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    }
  };

  const handleNavigate = () => {
    const prevSearch = locationState?.__prevSearch || prevSearchState || '';
    if (modalSuccessCallback === 'list') {
      navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    } else if (modalSuccessCallback === 'summary') {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/summary`, {
        state: {
          ...locationState,
          ...(prevSearchState && { __prevSearch: prevSearchState }),
          isEdit: true
        }
      });
    }
  };

  const handleOnDrawerSelect = (details) => {
    setTradeDetails(details);
  };

  const handleOnApplyFilters = (filters) => {
    const { searchQuery, ...rest } = filters;
    applyFilters({ query: searchQuery, ...rest });
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <ModuleHeader
        heading={<PageHeader heading={isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')} />}
        controls={
          orderDetails?.collaborators && (
            <Collaborator
              currentStage={orderDetails?.currentStage}
              collaborators={orderDetails?.collaborators}
              orderId={orderId}
              channelType={orderDetails?.channelType}
            />
          )
        }
      />

      <div className="MCP-module-body">
        <OrderStepper
          status={orderDetails?.currentStage}
          patientDetailsRequired={orderDetails?.patientDetailsRequired}
          channelType={orderDetails?.channelType}
        />
        {readOnly && (
          <NotifyAlert
            stage={ORDER_STAGES.PATIENT_AND_PROVIDER_DETAILS}
            OnEdit={readOnly && orderDetails?.currentStage !== ORDER_STAGES.THERAPY_SELECTION ? true : false}
            orderId={orderId}
            setAlert={setAlert}
          />
        )}
        {alert && !alert.pinPoint && <Alert {...alert} onClose={() => setAlert(null)} />}

        <div className={`${styles.wrapper}`}>
          <div className="MCP-panel-container">
            <div className="MCP-CardContainer">
              <CommonFilters
                autoFocus={true}
                onApplyFilters={handleOnApplyFilters}
                onClearFilters={clearFilters}
                additionalFilters={[]}
                searchPlaceholder={t('controls.placeholder.therapySelection.search')}
              />
            </div>
            <TableHeading heading={t('labels.therapySelection')} />
            {alert && alert.pinPoint === 'therapy-selection' && <Alert {...alert} onClose={() => setAlert(null)} />}
            <TherapyDataTable trade={tradeDetails} onChange={setTradeDetails} location={location} readOnly={readOnly} />
          </div>
          <div className="footer-wrapper" ref={controlRef}>
            <div className="controls footer-controls">
              <Button size="md" variant="secondary" onClick={handleCancel}>
                {t('captions.btnCancel')}
              </Button>
              <Button
                variant="primary"
                isLoadingState={isSaving || isUpdating}
                Icon={(isSaving || isUpdating) && ButtonLoadingIcon}
                iconPosition="left"
                type="submit"
                disabled={readOnly}
                onClick={handleOnSubmit}
                size="md">
                {t(getOrderStepCaption(isSaving, isUpdating))}
              </Button>
            </div>
          </div>
          {trade && (
            <TherapyDetailsWithTabs
              trade={trade}
              channelType={channelType}
              therapy={therapy || trade}
              onSelect={handleOnDrawerSelect}
              onClose={handleOnClose}
              buyAndBillTherapyConstants={TherapyDetailsConstantsForBB(false)}
              spTherapyConstants={TherapyDetailsConstantsForSP}
              heading={t('manageMaterial.drawer.details.heading')}
              readOnly={readOnly}
            />
          )}
        </div>
      </div>
      <DiscardChangesModal
        heading={t('messages.confirmation.discardheader')}
        description={t('messages.confirmation.therapy')}
        isOpen={Boolean(modalSuccessCallback)}
        onClose={() => setModalSuccessCallback(null)}
        onConfirm={handleNavigate}
      />
    </div>
  );
}
export default withPermissions(TherapySelection, ORDER_STAGES.THERAPY_SELECTION);
