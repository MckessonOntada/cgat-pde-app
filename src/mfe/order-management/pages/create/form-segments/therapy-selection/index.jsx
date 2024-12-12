import React, { useState, useMemo } from 'react';
import { Button, Stepper, Heading } from '@mckesson/mcp-component-library';
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
import { routesConfig } from '@src/mfe/order-management/routes/constants';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';

function TherapySelection() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRowId, setSelectedRowId] = useState(null);
  const { clearFilters, applyFilters } = useTherapy();
  const searchParams = new URLSearchParams(location.search);
  const therapyDetails = searchParams.get('therapy-details');

  const handleOnClose = () => {
    searchParams.delete('therapy-details');
    navigate({
      pathname: '',
      search: searchParams.toString() ? `?${searchParams.toString()}` : ''
    });
  };

  const SALES_ORGANIZATIONS = ['ORG1', 'MPB', 'US East', 'US West', 'Global Health', 'EMEA', 'APAC', 'LATAM', 'Canada', 'Retail Division', 'Wholesale Division'].map((i) => ({ label: i, value: i.replace(' ', '_').toLowerCase() }));

  const CUSTOMER_INDICATORS = ['Preferred Customer', 'New Customer', 'VIP Customer', 'Loyalty Member', 'Inactive Customer', 'High-Value Customer', 'Discount Eligible', 'First-Time Buyer', 'Recurring Buyer', 'Potential Lead'].map((i) => ({
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
        options: SALES_ORGANIZATIONS
      }
    );

    return config;
  }, []);

  const { mutate } = useMutation(
    async (data) => {
      const payload = {};
      const url = `${ApiRoutes.ORDER}/POST_URL`;
      const res = await HttpResourceService.callRest(`${url}`, httpVerb.POST, payload);
      return res;
    },
    {
      onSuccess: ({ orderId }) => navigate(`../${orderId}/accounts`),
      onError: console.log
    }
  );

  const handleOnSubmit = () => {
    mutate();
  };

  const handleOnBackButtonClick = () => {
    //compare data change, display modal for confirmation
    navigate('/orders');
  };

  const handleOnCancel = () => {
    //compare data change, display modal for confirmation
    navigate('/orders');
  };

  const forms = FormList(t);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackButtonClick} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={<Heading as="h1">{t('headings.createNewOrder')}</Heading>} />

      <div className="MCP-module-body">
        <Stepper activeIndex={1} dividerText="of" mobileLabel={t('labels.steps')} stepHeaders={forms.map((f) => ({ label: f.label }))} />

        <div className={styles.wrapper}>
          <div className="MCP-panel-container">
            <ModuleHeader heading={<Heading as="h2">{t('labels.therapySelection')}</Heading>} />
            <div className="MCP-panel-container">
              <CommonFilters onApplyFilters={applyFilters} onClearFilters={clearFilters} additionalFilters={additionalFiltersConfig} searchPlaceholder={t('userManagement.searchFilter.label')} />
            </div>
            <TherapyDataTable selectedRowId={selectedRowId} setSelectedRowId={setSelectedRowId} />
          </div>
          <ModuleHeader
            controls={
              <div className="controls">
                <Button size="md" variant="secondary" onClick={handleOnCancel}>
                  {t('captions.btnCancel')}
                </Button>
                <Button size="md" variant="primary" type="submit" onClick={handleOnSubmit} disabled={!selectedRowId}>
                  {t('captions.btnSaveAndContinue')}
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
