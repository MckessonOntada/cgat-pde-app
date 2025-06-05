import React, { useContext, useRef, useState } from 'react';
import { Button } from '@mckesson/mcp-component-library';
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
import useAlert from '@src/hooks/useAlert';
import { handleApiError } from '@src/util/ApiUtils';
import TableHeading from '@src/components/tableHeading/TableHeading';
import useOrder from '../../../orders/useOrder';
import { Loader } from '@mckesson/mcp-component-library';
import TherapyDetailsWithTabs from '@src/components/therapyDetails/TherapyDetailsWithTabs';
import { FooterContext } from '@src/components/footer/FooterContext';
import Alert from '@src/components/cgat-alert/Alert';

function TherapySelection() {
  const { t } = useTranslate();
  const { controlRef } = useContext(FooterContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const { clearFilters, applyFilters } = useTherapy();
  const { data: orderDetails = {} } = useOrder(orderId);
  const [tradeDetails, setTradeDetails] = useState(orderDetails?.tradeDetails);
  const searchParams = new URLSearchParams(location.search);
  const trade = searchParams.get('trade');
  const channelType = searchParams.get('channelType');
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const { isEdit = false, isApprover = false, isBack = false } = location.state || {};
  const alertContainerId = 'alert-container';
  const [therapySelectionMessage, setTherapySelectionMessage] = React.useState(null);
  const { showAlert } = useAlert();
  const preservedStateRef = useRef(location.state);

  React.useEffect(() => {
    const { paporder: isPapOrder } = orderDetails || {};
    if (isPapOrder)
      navigate(`/orders?${searchParams.toString()}`, {
        state: { activeTab: preservedStateRef.current?.fromTab, fromOrderView: preservedStateRef.current?.fromOrderView }
      });
  }, [orderDetails]);

  React.useEffect(() => {
    const { tradeDetails, therapyDetails = {} } = orderDetails || {};
    if (tradeDetails) {
      setTradeDetails({ ...tradeDetails, ...therapyDetails });
    }
  }, [orderDetails]);

  const handleOnClose = () => {
    searchParams.delete('trade');
    searchParams.delete('channelType');
    navigate({
      pathname: '',
      search: searchParams.toString() ? `?${searchParams.toString()}` : '', 
      state: { fromTab: preservedStateRef.current?.fromTab, fromOrderView: preservedStateRef.current?.fromOrderView } 
    });
  };

  const { isLoading: isSaving, mutate: createNewOrder } = useMutation(async (data) => OrderService.createOrder(data), {
    onSuccess: (result) => {
      const { id } = result;
      navigate(`../${id}/accounts?${searchParams.toString()}`, {
        state: { isEdit: false, isApprover: isApprover, fromTab: preservedStateRef.current?.fromTab, fromOrderView: preservedStateRef.current?.fromOrderView }
      });
    },
    onError: (err) => {
      const errorKey = handleApiError(err);
      showAlert({
        description: t(errorKey),
        type: 'error',
        anchorEl: alertContainerId
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
        navigate(`../${id}/accounts?${searchParams.toString()}`, {
          state: {
            isEdit: false,
            isApprover: isApprover,
            isTherapyChanged: Number(tradeDetails?.tradeName) !== Number(orderDetails?.tradeDetails.tradeName),
            fromTab: preservedStateRef.current?.fromTab,
            fromOrderView: preservedStateRef.current?.fromOrderView
          }
        });
      },
      onError: (err) => {
        const errorKey = handleApiError(err);
        showAlert({
          description: t(errorKey),
          type: 'error',
          anchorEl: alertContainerId
        });
      }
    }
  );

  const handleOnSubmit = () => {
    if (!tradeDetails || isSaving) {
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
  const isDirty = JSON.stringify(tradeDetails) !== JSON.stringify(orderDetails?.tradeDetails);

  const handleOnBackToOrders = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      navigate(`${RoutePaths.pathOrderManagement}?${searchParams.toString()}`, {
        state: {
          activeTab: preservedStateRef.current?.fromTab,
          fromOrderView: preservedStateRef.current?.fromOrderView
        }
      });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : 'list');
      return;
    }
    if (isEdit) {
      navigate(`../${orderId}/summary?${searchParams.toString()}`, {
        state: {
          isEdit: true,
          isApprover: isApprover,
          fromTab: preservedStateRef.current?.fromTab,
          fromOrderView: preservedStateRef.current?.fromOrderView
        }
      });
    } else {
      navigate(`${RoutePaths.pathOrderManagement}?${searchParams.toString()}`, {
        state: {
          activeTab: preservedStateRef.current?.fromTab,
          fromOrderView: preservedStateRef.current?.fromOrderView
        }
      });
    }
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(`${RoutePaths.pathOrderManagement}?${searchParams.toString()}`, {
        state: {
          activeTab: preservedStateRef.current?.fromTab,
          fromOrderView: preservedStateRef.current?.fromOrderView
        }
      });
    } else if (modalSuccessCallback === 'summary') {
      navigate(`../${orderId}/summary?${searchParams.toString()}`, {
        state: {
          isEdit: true,
          isApprover: isApprover,
          fromTab: preservedStateRef.current?.fromTab,
          fromOrderView: preservedStateRef.current?.fromOrderView
        }
      });
    }
  };

  const handleOnDrawerSelect = (details) => {
    setTradeDetails(details);
  };
  if (isSaving) {
    return <Loader type={'screen'} />;
  }
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')} />

      <div className="MCP-module-body">
        <OrderStepper
          status={orderDetails?.currentStage}
          patientDetailsRequired={orderDetails?.patientDetailsRequired}
          channelType={orderDetails.channelType}
        />
        <div id={alertContainerId} />
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
              onSelect={handleOnDrawerSelect}
              onClose={handleOnClose}
              buyAndBillTherapyConstants={TherapyDetailsConstantsForBB}
              spTherapyConstants={TherapyDetailsConstantsForSP}
              heading={t('manageMaterial.drawer.heading')}
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
