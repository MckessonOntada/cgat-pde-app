import React, { useState } from 'react';
import { Button, Alert } from '@mckesson/mcp-component-library';
import styles from './TherapySelection.module.scss';
import TherapyDetails from '@src/components/therapyDetails/TherapyDetails';
import FloatingDrawer from '@src/components/floating-drawer';
import ModuleHeader from '@src/components/module-header';
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
import { TherapyDetailsConstants } from './assets/constants/TherapyDetailsConstants';
import useAlert from '@src/hooks/useAlert';
import { handleApiError } from '@src/util/ApiUtils';
import TableHeading from '@src/components/tableHeading/TableHeading';
import useOrder from '../../../orders/useOrder';

function TherapySelection() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const { clearFilters, applyFilters } = useTherapy();
  const [initialSelectedThearpy, setInitialSelectedTherapy] = React.useState(null);
  const { data: orderDetails } = useOrder(orderId);
  const [therapy, setTherapy] = useState(orderDetails?.therapy);
  const searchParams = new URLSearchParams(location.search);
  const therapyDetails = searchParams.get('therapy-details');
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const { isEdit = false, isApprover = false, isBack = false } = location.state || {};
  const alertContainerId = 'alert-container';
  const [therapySelectionMessage, setTherapySelectionMessage] = React.useState(null);
  const { showAlert } = useAlert();
  console.log(orderDetails);
  React.useEffect(() => {
    const { paporder: isPapOrder } = orderDetails || {};
    if (isPapOrder) navigate('/orders');
  }, [orderDetails]);

  React.useEffect(() => {
    const { therapy } = orderDetails || {};
    if (therapy) {
      setTherapy(therapy);
      setInitialSelectedTherapy(therapy);
    } else {
      console.log('Could not set therapy');
    }
  }, [orderDetails]);

  const handleOnClose = () => {
    searchParams.delete('therapy-details');
    navigate({
      pathname: '',
      search: searchParams.toString() ? `?${searchParams.toString()}` : ''
    });
  };

  const { isLoading: isSaving, mutate: createNewOrder } = useMutation(async (data) => OrderService.createOrder(data), {
    onSuccess: (result) => {
      const { id } = result;
      navigate(`../${id}/accounts`, { state: { isEdit: false, isApprover: isApprover } });
    },
    onError: (err) => {
      const errorKey = handleApiError(err);
      showAlert({ description: t(errorKey), type: 'error', anchorEl: alertContainerId });
    }
  });

  const { isLoading: isUpdating, mutate: updateTherapy } = useMutation(
    async ({ orderId, payload }) => {
      return await OrderService.updateTherapy(orderId, payload);
    },
    {
      onSuccess: (result) => {
        const { id } = result;
        navigate(`../${id}/accounts`, { state: { isEdit: false, isApprover: isApprover } });
      },
      onError: (err) => {
        const errorKey = handleApiError(err);
        showAlert({ description: t(errorKey), type: 'error', anchorEl: alertContainerId });
      }
    }
  );

  const handleOnSubmit = () => {
    if (!therapy || isSaving) {
      setTherapySelectionMessage({ description: 'Select therapy to create order', type: 'error' });
      return;
    }

    if (therapy) {
      const payload = {
        id: therapy.id
      };
      if (isEdit || isApprover || isBack) {
        updateTherapy({ orderId, payload });
      } else {
        createNewOrder(payload);
      }
    }
  };
  const isDirty = JSON.stringify(therapy) !== JSON.stringify(initialSelectedThearpy);

  const handleOnBackToOrders = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      navigate(RoutePaths.pathOrderManagement);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : 'list');
      return;
    }
    if (isEdit) {
      navigate(`../${orderId}/summary`, { state: { isEdit: true, isApprover: isApprover } });
    } else {
      navigate(RoutePaths.pathOrderManagement);
    }
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(RoutePaths.pathOrderManagement);
    } else if (modalSuccessCallback === 'summary') {
      navigate(`../${orderId}/summary`, { state: { isEdit: true, isApprover: isApprover } });
    }
  };

  const handleOnDrawerSelect = (therapy) => {
    setTherapy(therapy);
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')} />

      <div className="MCP-module-body">
        <OrderStepper status={orderDetails?.currentStage} patientDetailsRequired={orderDetails?.patientDetailsRequired} />
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
              <Alert
                description={therapySelectionMessage.description}
                type={therapySelectionMessage.type}
                duration={10000}
                onClose={() => setTherapySelectionMessage(null)}
              />
            )}
            <TherapyDataTable therapy={therapy} onChange={setTherapy} />
          </div>
          <ModuleHeader
            controls={
              <div className="controls">
                <Button size="md" variant="secondary" onClick={handleCancel}>
                  {t('captions.btnCancel')}
                </Button>
                <Button size="md" variant="primary" type="submit" onClick={handleOnSubmit}>
                  {isSaving ? 'Saving' : t('captions.btnSaveAndContinue')}
                </Button>
              </div>
            }
          />
          {therapyDetails && (
            <FloatingDrawer open={true} anchor="right" onClose={handleOnClose}>
              <TherapyDetails
                therapyId={therapyDetails}
                onSelect={handleOnDrawerSelect}
                onClose={handleOnClose}
                therapyData={TherapyDetailsConstants}
              />
            </FloatingDrawer>
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
