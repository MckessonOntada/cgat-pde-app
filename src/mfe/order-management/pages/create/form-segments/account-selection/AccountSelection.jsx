import React from 'react';
import { Dropdown, Heading, Button, Stepper } from '@mckesson/mcp-component-library';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './AccountSelection.module.scss';
import FloatingDrawer from '@src/components/floating-drawer';
import AccountsTable from './AccountTable';
import AccountSelectionUserGuide from './AccountSelectionUserGuide';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import ShippingAddressDataTable from './ShippingAddressDataTable';
import { ShippingAddressProvider } from '../../../../context/ShippingAddressContext';
import PageHeader from '@src/components/pageHeader';
import { FormList } from '../Constants';
import { useMutation } from 'react-query';

const AccountSelection = () => {
  const { t } = useTranslate();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { orderId, therapyId } = useParams();

  const { mutate } = useMutation(
    async (data) => {
      const res = await Promise.resolve({ id: Math.floor(Math.random() * (1000 - 100 + 1)) + 100 });
      return res;
    },
    {
      onSuccess: ({ id }) => navigate(`../${orderId}/${therapyId}/${id}/patient-details`),
      onError: console.log
    }
  );

  const handleOnClose = () => {
    setOpen(false);
  };
  const handleOnClick = () => {
    setOpen(true);
  };
  const handleOnSubmit = (account) => {
    mutate();
  };
  const handleOnBackButtonClick = () => {
    //compare data change, display modal for confirmation
    navigate(`../edit-order/${therapyId}`);
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

      <PageHeader heading={t('headings.createNewOrder')} />

      <div className="MCP-module-body">
        <Stepper activeIndex={2} dividerText="of" mobileLabel={t('labels.steps')} stepHeaders={forms.map((f) => ({ label: f.label }))} />

        <div className={`MCP-module-wrapper`}>
          <div className="MCP-panel-container">
            <div>
              <p className="fieldName">{t('labels.therapyDescription')}</p>
              <p className="fieldValue">{t('labels.accountSelection')}</p>
            </div>
          </div>
          <div className="MCP-panel-container">
            <div className={`MCP-module-body`}>
              <ModuleHeader
                heading={
                  <div>
                    <Heading as="h2">{t('labels.accountSelection')}</Heading>
                    <Heading as="h3">{t('messages.accountSelect')}</Heading>
                  </div>
                }
              />
              <div className="MCP-panel-container">
                <div className={styles.account}>
                  <div className={styles.accountDetails}>
                    <p className={styles.name}>
                      <b>Revisions Aesthetics Group</b>
                    </p>
                    <p className={styles.address}>6567 S Elizabeth Way, Centennial, CO, 80121</p>
                  </div>
                  <div className={styles.controls}>
                    <div className={styles.controlWrapper}>
                      <Dropdown />
                    </div>
                    <Link to="#" onClick={handleOnClick}>
                      {t('labels.needAssistanceSelectingAccount')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <ShippingAddressProvider>
              <div className="MCP-module-body">
                <ModuleHeader heading={<Heading as="h2">{t('headings.shippingAddress')}</Heading>} />
                <div className="MCP-panel-container"></div>
                <div className="MCP-table-wrapper">
                  <ShippingAddressDataTable />
                </div>
              </div>
            </ShippingAddressProvider>
          </div>
          <div className="controls">
            <Button size="md" onClick={() => navigate('../')} variant="secondary">
              {t('captions.btnCancel')}
            </Button>
            <Button size="md" onClick={handleOnCancel} variant="secondary">
              {t('captions.btnInventorySelection')}
            </Button>
            <Button size="md" onClick={handleOnSubmit} variant="primary" type="submit">
              {t('Save and Continue')}
            </Button>
          </div>
          <FloatingDrawer open={open} anchor="right" onClose={handleOnClose}>
            <AccountSelectionUserGuide onClose={handleOnClose} />
          </FloatingDrawer>
        </div>
      </div>
    </div>
  );
};

export default AccountSelection;
