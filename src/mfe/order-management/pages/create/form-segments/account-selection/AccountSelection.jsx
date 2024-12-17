import React, { useMemo } from 'react';
import { Heading, Button, Stepper } from '@mckesson/mcp-component-library';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './AccountSelection.module.scss';
import FloatingDrawer from '@src/components/floating-drawer';
import AccountSelectionUserGuide from './AccountSelectionUserGuide';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { ShippingAddressProvider } from '../../../../context/ShippingAddressContext';
import PageHeader from '@src/components/pageHeader';
import { FormList } from '../Constants';
import { useMutation, useQuery } from 'react-query';
import { ReactComponent as TickIcon } from '@src/assets/svg/tick-circle-filled.svg';
import MultiSelectDropdown from '@src/components/form/MultiSelectDropdown';
import CommonUtils from '@src/util/CommonUtils';
import OrderService from '@src/api/commonService/OrderService';
import ShippingAddress from './ShippingAddress';

const DetailField = ({ label, value, className }) => (
  <div className={className}>
    <div className={'fieldName'}>{label}</div>
    <div className={'fieldValue'}>{value}</div>
  </div>
);

const AccountSelection = () => {
  const { t } = useTranslate();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [selectedAccount, setSelectedAccount] = React.useState(null);
  const [accountSearchString, setAccountSearchString] = React.useState('');
  const [selectedShippingAddress, setSelectedShippingAddress] = React.useState('');
  const therapyId = 3; //temp

  const { isLoading, data: accountsListData = {} } = useQuery({
    queryKey: ['order', 'therapy', therapyId, accountSearchString],
    queryFn: async () => OrderService.getSoldToAccounts(therapyId, accountSearchString),
    enabled: !!therapyId,
    refetchOnWindowFocus: false
  });

  const accountListOptions = useMemo(() => {
    if (!CommonUtils.isNonEmptyObject(accountsListData)) {
      return;
    }
    const accArr = [];
    accountsListData.content?.forEach((acc) => {
      const label = `(${acc.accountNumber}) ` + acc.accountName;
      const value = acc.accountNumber;
      const subLabel = [acc.houseNumber, acc.street, acc.city, acc.state, acc.zipCode].join(', ');
      accArr.push({ label, value, subLabel });
    });

    return accArr;
  }, [accountsListData]);

  const { isLoading: isSaving, mutate: saveAccount } = useMutation(async (data) => OrderService.saveAccount(orderId, data), {
    onSuccess: ({ id }) => navigate(`../${orderId}/patient`),
    onError: console.log
  });

  const handleOnClose = () => {
    setOpen(false);
  };
  const handleOnClick = () => {
    setOpen(true);
  };
  const handleOnSubmit = () => {
    if (selectedAccount) {
      const payload = {
        soldToAccountId: selectedAccount.id,
        shipToAccountId: selectedShippingAddress.id
      };
      saveAccount(payload);
    }
  };
  const handleOnBackButtonClick = () => {
    //compare data change, display modal for confirmation
    navigate(`../edit-order/${orderId}`);
  };
  const handleOnCancel = () => {
    //compare data change, display modal for confirmation
    navigate('/orders');
  };

  const getAddress = (acc) => {
    return [acc.houseNumber, acc.street, acc.district, acc.city, acc.state, acc.zipCode].join(', ');
  };

  const forms = FormList(t);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={handleOnBackButtonClick}
          size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={t('headings.createNewOrder')} />

      <div className="MCP-module-body">
        <Stepper activeIndex={2} dividerText="of" mobileLabel={t('labels.steps')} stepHeaders={forms.map((f) => ({ label: f.label }))} />

        <div className={`MCP-module-wrapper`}>
          <div className="MCP-panel-container">
            <div className="row-space-between-center">
              <DetailField
                label={t('labels.therapyDescription')}
                value={
                  <React.Fragment>
                    <span>Therapy value</span>
                    <TickIcon width="16px" height="16px" />
                  </React.Fragment>
                }
              />
              <DetailField label={t('labels.price')} value={'$----'} />
            </div>
          </div>
          <div className="MCP-panel-container">
            <div className={`MCP-module-body`}>
              <ModuleHeader
                heading={
                  <div>
                    <Heading as="h2">{t('labels.accountSelection')}</Heading>
                    <p className="dull-text">{t('messages.selectAccountToBuyTherapy')}</p>
                  </div>
                }
              />
              <div className="MCP-panel-container">
                <div className={styles.account}>
                  <div className={styles.accountDetails}>
                    {selectedAccount ? (
                      <React.Fragment>
                        <p className={styles.name}>
                          <b>{selectedAccount.accountName}</b>
                        </p>
                        <p className={styles.address}>{getAddress(selectedAccount)}</p>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Heading as="h3">{t('labels.pleaseSelectAccount')}</Heading>
                      </React.Fragment>
                    )}
                  </div>
                  <div className={styles.controls}>
                    <div className={styles.controlWrapper}>
                      <MultiSelectDropdown
                        id={'targetAccount'}
                        label={' '}
                        isMultiSelect={false}
                        placeholder={'Select Account'}
                        onChange={(val) => setSelectedAccount(accountsListData.content?.filter((acc) => acc.accountNumber === val)[0])}
                        options={accountListOptions}
                        variant={'async'}
                        onSearch={(e) => {
                          setAccountSearchString(() => e);
                        }}
                        recordsCountToEnableSearch={5}
                        size="lg"
                      />
                    </div>
                    {/* <Link to="#" onClick={handleOnClick} className="action-link">
                      {t('labels.needAssistanceSelectingAccount')}
                    </Link> */}
                  </div>
                </div>
              </div>
            </div>
            <ShippingAddressProvider accountDetails={{ therapyId, selectedAccount }}>
              <ShippingAddress selectedShippingAddress={selectedShippingAddress} setSelectedShippingAddress={setSelectedShippingAddress} />
            </ShippingAddressProvider>
          </div>
          <div className="controls">
            <Button size="md" onClick={() => navigate('../')} variant="secondary">
              {t('captions.btnCancel')}
            </Button>
            <Button size="md" onClick={handleOnCancel} variant="secondary">
              {t('captions.btnInventorySelection')}
            </Button>
            <Button size="md" onClick={handleOnSubmit} disabled={!selectedShippingAddress || isSaving} variant="primary" type="submit">
              {isSaving ? 'Saving' : t('captions.btnSaveAndContinue')}
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
