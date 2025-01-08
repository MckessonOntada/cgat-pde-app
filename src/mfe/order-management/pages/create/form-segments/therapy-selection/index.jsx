import React, { useState, useMemo } from 'react';
import { Button, Heading } from '@mckesson/mcp-component-library';
import styles from './TherapySelection.module.scss';
import TherapyDetails from './TherapyDetails';
import FloatingDrawer from '@src/components/floating-drawer';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TherapyDataTable from './TherapyDataTable';
import { useTherapy } from '../../../../context/TherapyContext';
import { FormList } from '../Constants';
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
  const { isEdit = false, isReview = false } = location.state || {};
  const isReviewandEdit = isReview && isEdit;

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

  const additionalFiltersConfig = useMemo(() => {
    let config = [];
    config.push(
      {
        type: 'multiSelectDropdown',
        name: 'customerIdentifier',
        label: t('labels.customerIndicator'),
        options: CUSTOMER_INDICATORS
      },
      {
        type: 'multiSelectDropdown',
        name: 'salesOrg',
        label: t('labels.salesOrganization'),
        options: [
          { label: 'MPB', value: 'so76' },
          { label: 'Specialty', value: 1000 },
          { label: '3PL', value: 1100 }
        ]
      }
    );

    return config;
  }, []);
  const { setActiveRecord, setCurrentOrder } = useManageOrder();

  const { isLoading: isSaving, mutate: createNewOrder } = useMutation(async (data) => OrderService.createOrder(data), {
    onSuccess: (result) => {
      setActiveRecord(result);
      const { id } = result;
      navigate(`../${id}/accounts`, { state: { isReview: isReview, isEdit: isEdit } });
    },
    onError: console.log
  });

  const handleOnSubmit = () => {
    if (therapy) {
      const payload = {
        id: therapy.id
      };

      createNewOrder(payload);
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
      navigate(`../${orderId}/summary`, { state: { isEdit: true, isReview: isReview } });
    } else {
      navigate(RoutePaths.pathOrderManagement);
    }
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(RoutePaths.pathOrderManagement);
    } else if (modalSuccessCallback === 'summary') {
      navigate(`../${orderId}/summary`, { state: { isEdit: true, isReview: isReview } });
    }
  };

  const handleOnDrawerSelect = (therapy) => {
    setTherapy(therapy);
  };

  const forms = FormList(t);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader
        heading={
          <Heading as="h1">
            {isReviewandEdit ? t('headings.reviewOrder') : isEdit ? t('headings.editOrder') : t('headings.createNewOrder')}
          </Heading>
        }
      />

      <div className="MCP-module-body">
        <OrderStepper />
        <div className={styles.wrapper}>
          <div className="MCP-panel-container">
            <ModuleHeader heading={<Heading as="h2">{t('labels.therapySelection')}</Heading>} />
            <div className="MCP-panel-container">
              <CommonFilters
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
                additionalFilters={[]}
                searchPlaceholder={t('controls.placeholder.therapySelection.search')}
              />
            </div>
            <TherapyDataTable therapy={therapy} onChange={setTherapy} />
          </div>
          <ModuleHeader
            controls={
              <div className="controls">
                <Button size="md" variant="secondary" onClick={handleCancel}>
                  {t('captions.btnCancel')}
                </Button>
                <Button size="md" variant="primary" type="submit" onClick={handleOnSubmit} disabled={!therapy || isSaving}>
                  {isSaving ? 'Saving' : t('captions.btnSaveAndContinue')}
                </Button>
              </div>
            }
          />
          {therapyDetails && (
            <FloatingDrawer open={true} anchor="right" onClose={handleOnClose}>
              <TherapyDetails therapyId={therapyDetails} onSelect={handleOnDrawerSelect} onClose={handleOnClose} />
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
