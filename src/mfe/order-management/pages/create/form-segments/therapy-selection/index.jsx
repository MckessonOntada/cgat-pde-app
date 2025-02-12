import React, { useState, useMemo } from 'react';
import { Button, Heading } from '@mckesson/mcp-component-library';
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
import { useManageOrder } from '@src/mfe/order-management/context/ManageOrderContext';
import OrderStepper from '../OrderStepper';
import { ORDER_STAGES } from '@src/mfe/order-management/routes/constants';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import { TherapyDetailsConstants } from './assets/constants/TherapyDetailsConstants';
import useAlert from '@src/hooks/useAlert';
import { handleApiError } from '@src/util/ApiUtils';
import TableHeading from '@src/components/tableHeading/TableHeading';

function TherapySelection() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const [therapy, setTherapy] = useState(null);
  const { clearFilters, applyFilters } = useTherapy();
  const [initialSelectedThearpy, setInitialSelectedTherapy] = React.useState(null);
  const { formState } = useManageOrder();
  const searchParams = new URLSearchParams(location.search);
  const therapyDetails = searchParams.get('therapy-details');
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const { orderId } = useParams();
  const { isEdit = false, isApprover = false, isBack = false } = location.state || {};
  const alertContainerId = 'alert-container';
  const { showAlert } = useAlert();

  React.useEffect(() => {
    const { paporder: isPapOrder } = formState.activeRecord || {};
    if (isPapOrder) navigate('/orders');
  }, [formState.activeRecord]);

  React.useEffect(() => {
    orderId && setCurrentOrder(orderId, ORDER_STAGES.THERAPY_SELECTION);
  }, []);

  React.useEffect(() => {
    const { therapy } = formState.activeRecord || {};
    if (therapy) {
      setTherapy(therapy);
      setInitialSelectedTherapy(therapy);
    } else {
      console.log('Could not set therapy');
    }
  }, [formState?.activeRecord]);

  const handleOnClose = () => {
    searchParams.delete('therapy-details');
    navigate({
      pathname: '',
      search: searchParams.toString() ? `?${searchParams.toString()}` : ''
    });
  };

  const CUSTOMER_INDICATORS = [
    'Preferred Customer',
    'New Customer',
    'VIP Customer',
    'Loyalty Member',
    'Inactive Customer',
    'High-Value Customer',
    'Discount Eligible',
    'First-Time Buyer',
    'Recurring Buyer',
    'Potential Lead'
  ].map((i) => ({
    label: i,
    value: i.replace(' ', '_').toLowerCase()
  }));

  const { setActiveRecord, setCurrentOrder } = useManageOrder();

  const { isLoading: isSaving, mutate: createNewOrder } = useMutation(async (data) => OrderService.createOrder(data), {
    onSuccess: (result) => {
      setActiveRecord(result);
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
        setActiveRecord(result);
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
      showAlert({ description: 'Select therapy to create order', type: 'error', anchorEl: alertContainerId });
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
        <OrderStepper />
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
