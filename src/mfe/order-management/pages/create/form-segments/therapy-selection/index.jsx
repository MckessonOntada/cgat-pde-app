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

function TherapySelection() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const [therapy, setTherapy] = useState(null);
  const { clearFilters, applyFilters } = useTherapy();
  const { formState } = useManageOrder();
  const searchParams = new URLSearchParams(location.search);
  const therapyDetails = searchParams.get('therapy-details');

  const { orderId } = useParams();

  React.useEffect(() => {
    orderId && setCurrentOrder(orderId, ORDER_STAGES.THERAPY_SELECTION);
  }, []);

  React.useEffect(() => {
    const { therapy } = formState.activeRecord || {};
    if (therapy) {
      setTherapy(therapy);
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
      navigate(`../${id}/accounts`);
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

  const handleOnBackToOrders = () => {
    //compare data change, display modal for confirmation
    navigate('/orders');
  };

  const forms = FormList(t);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={<Heading as="h1">{t('headings.createNewOrder')}</Heading>} />

      <div className="MCP-module-body">
        <OrderStepper />
        <div className={styles.wrapper}>
          <div className="MCP-panel-container">
            <ModuleHeader heading={<Heading as="h2">{t('labels.therapySelection')}</Heading>} />
            <div className="MCP-panel-container">
              <CommonFilters
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
                additionalFilters={additionalFiltersConfig}
                searchPlaceholder={t('controls.placeholder.therepySelection.search')}
              />
            </div>
            <TherapyDataTable therapy={therapy} onChange={setTherapy} />
          </div>
          <ModuleHeader
            controls={
              <div className="controls">
                <Button size="md" variant="secondary" onClick={handleOnBackToOrders}>
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
              <TherapyDetails therapyId={therapyDetails} onClose={handleOnClose} />
            </FloatingDrawer>
          )}
        </div>
      </div>
    </div>
  );
}
export default TherapySelection;
