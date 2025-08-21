import React, { useContext, useState } from 'react';
import { Button, Loader } from '@mckesson/mcp-component-library';
import styles from './TherapySelection.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TherapyDataTable from './TherapyDataTable';
import { useTherapy } from '../../../../context/TherapyContext';
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
import useOrder from '../../../orders/useOrder';
import TherapyDetailsWithTabs from '@src/components/therapyDetails/TherapyDetailsWithTabs';
import { FooterContext } from '@src/components/footer/FooterContext';
import Alert from '@src/components/cgat-alert/Alert';
import CommonUtils from '@src/util/CommonUtils';
import ModuleHeader from '@src/components/module-header';
import { ORDER_STATUS } from '../../../orders/config';
import { hasUnsavedChanges } from '@src/store/reducer/orderReducer';
import { useDispatch } from 'react-redux';

function TherapySelection() {
  const { t } = useTranslate();
  const { controlRef } = useContext(FooterContext);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location?.state || {};
  const { search, pathname } = location || {};
  const [prevSearchState, setPrevSearchState] = React.useState(null);
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { clearFilters, applyFilters } = useTherapy();
  const { data: orderDetails = {}, isFetching } = useOrder(orderId);
  const [tradeDetails, setTradeDetails] = useState(orderDetails?.tradeDetails);
  const [isDirty, setIsDirty] = React.useState(false);
  const searchParams = new URLSearchParams(search);
  const trade = searchParams.get('trade');
  const channelType = searchParams.get('channelType');
  const therapy = searchParams.get('therapy');
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const { isEdit = pathname === '/edit-order', isApprover = false, isBack = false } = locationState || {};
  const [therapySelectionMessage, setTherapySelectionMessage] = React.useState(null);
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    const { paporder: isPapOrder } = orderDetails || {};
    const prevSearch = locationState.__prevSearch || '';
    if (isPapOrder) navigate(`/orders${prevSearch}`);
    if (orderDetails.status === ORDER_STATUS.REVIEW) navigate(`${RoutePaths.pathOrderManagement}`, { replace: true });
  }, [orderDetails]);

  React.useEffect(() => {
    const isDirty = JSON.stringify(tradeDetails) !== JSON.stringify(orderDetails?.tradeDetails);
    setIsDirty(isDirty);
    dispatch(hasUnsavedChanges(isDirty));
    return () => dispatch(hasUnsavedChanges(false));
  }, [tradeDetails]);

  React.useEffect(() => {
    if (locationState && locationState.__prevSearch) setPrevSearchState(locationState.__prevSearch);
  }, [location.search]);

  React.useEffect(() => {
    const { tradeDetails, therapyDetails = {} } = orderDetails || {};
    if (tradeDetails) {
      setTradeDetails({ ...tradeDetails, ...therapyDetails });
    }
  }, [orderDetails]);

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

  const { isLoading: isSaving, mutate: createNewOrder } = useMutation(async (data) => OrderService.createOrder(data), {
    onSuccess: (result) => {
      const { id } = result;
      navigate(`${RoutePaths.pathOrderManagement}/${id}/accounts`, {
        state: {
          ...locationState,
          ...(prevSearchState && { __prevSearch: prevSearchState }),
          isEdit: false,
          isApprover: isApprover
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

  const { isLoading: isUpdating, mutate: updateTherapy } = useMutation(
    async ({ orderId, payload }) => {
      return await OrderService.updateTherapy(orderId, payload);
    },
    {
      onSuccess: (result) => {
        const { id } = result;
        navigate(`${RoutePaths.pathOrderManagement}/${id}/accounts`, {
          state: {
            ...locationState,
            ...(prevSearchState && { __prevSearch: prevSearchState }),
            isEdit: false,
            isApprover: isApprover,
            isTherapyChanged: Number(tradeDetails?.tradeName) !== Number(orderDetails?.tradeDetails.tradeName)
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
    }
  );

  const handleOnSubmit = () => {
    if (!tradeDetails) {
      setTherapySelectionMessage({
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
        updateTherapy({ orderId, payload });
      } else {
        createNewOrder(payload);
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
          isEdit: true,
          isApprover: isApprover
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
          isEdit: true,
          isApprover: isApprover
        }
      });
    }
  };

  const handleOnDrawerSelect = (details) => {
    setTradeDetails(details);
  };

  React.useEffect(() => {}, [tradeDetails]);

  return (
    <div className="MCP-module-wrapper">
      {(isSaving || isFetching || isUpdating) && <Loader type={'screen'} />}
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <ModuleHeader heading={<PageHeader heading={isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')} />} controls={null} />

      <div className="MCP-module-body">
        <OrderStepper
          status={orderDetails?.currentStage}
          patientDetailsRequired={orderDetails?.patientDetailsRequired}
          channelType={orderDetails.channelType}
        />
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <div className={styles.wrapper}>
          <div className="MCP-panel-container">
            <div className="MCP-CardContainer">
              <CommonFilters
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
                additionalFilters={[]}
                searchPlaceholder={t('controls.placeholder.therapySelection.search')}
              />
            </div>
            <TableHeading heading={t('labels.therapySelection')} />
            {therapySelectionMessage && (
              <Alert description={therapySelectionMessage.description} type={therapySelectionMessage.type} onClose={() => setTherapySelectionMessage(null)} />
            )}
            <TherapyDataTable trade={tradeDetails} onChange={setTradeDetails} location={location} />
          </div>
          <div className="footer-wrapper" ref={controlRef}>
            <div className="controls footer-controls">
              <Button size="md" variant="secondary" onClick={handleCancel}>
                {t('captions.btnCancel')}
              </Button>
              <Button size="md" variant="primary" type="submit" onClick={handleOnSubmit}>
                {t('captions.btnSaveAndContinue')}
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
export default TherapySelection;
