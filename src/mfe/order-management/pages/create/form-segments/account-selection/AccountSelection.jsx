import React, { useMemo } from 'react';
import { Heading, Button } from '@mckesson/mcp-component-library';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './AccountSelection.module.scss';
import FloatingDrawer from '@src/components/floating-drawer';
import AccountSelectionUserGuide from './AccountSelectionUserGuide';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { ShippingAddressProvider } from '../../../../context/ShippingAddressContext';
import PageHeader from '@src/components/pageHeader';
import { useMutation, useQuery } from 'react-query';
import MultiSelectDropdown from '@src/components/form/MultiSelectDropdown';
import CommonUtils from '@src/util/CommonUtils';
import OrderService from '@src/api/commonService/OrderService';
import ShippingAddress from './ShippingAddress';
import { useManageOrder } from '@src/mfe/order-management/context/ManageOrderContext';
import OrderHeaderDetails from '../OrderHeaderDetails';
import OrderStepper from '../OrderStepper';
import { ORDER_STAGES } from '@src/mfe/order-management/routes/constants';
import { serializeParams } from '@src/util/ApiUtils';

const AccountSelection = () => {
  const { t } = useTranslate();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const { isEdit = false } = location.state || {};
  const [selectedAccount, setSelectedAccount] = React.useState(null);
  const [accountSearchString, setAccountSearchString] = React.useState('');
  const [selectedShippingAddress, setSelectedShippingAddress] = React.useState('');
  const { formState, setActiveRecord, setCurrentOrder, editByStage } = useManageOrder();
  const therapyId = formState.activeRecord?.therapy?.materialNumber;

  React.useEffect(() => {
    orderId && setCurrentOrder(orderId, ORDER_STAGES.ACCOUNT_DETAILS);
  }, []);

  const { isLoading, data: accountsListData = {} } = useQuery({
    queryKey: ['order', 'therapy', therapyId, accountSearchString],
    queryFn: async () => OrderService.getSoldToAccounts(therapyId, serializeParams({ query: accountSearchString })),
    enabled: !!therapyId,
    refetchOnWindowFocus: false
  });

  const accountListOptions = useMemo(() => {
    if (!CommonUtils.isNonEmptyObject(accountsListData)) {
      return [];
    }
    const accArr = [];
    accountsListData.content?.forEach((acc) => {
      const label = `(${acc.accountNumber}) ` + acc.accountName;
      const value = acc.accountNumber;
      const subLabel = [acc.houseNumber, acc.street, acc.city, acc.state, acc.zipCode].join(', ');
      accArr.push({ label, value, subLabel });
    });

    return accArr;
  }, [accountsListData, formState.activeRecord]);

  const { isLoading: isSaving, mutate: saveAccount } = useMutation(async (data) => OrderService.saveAccount(orderId, data), {
    onSuccess: (result) => {
      const { id } = result;
      setActiveRecord(result);
      if (result.patientDetailsRequired) navigate(`../${id}/patient`);
      else navigate(`../${id}/additional-details`);
    },
    onError: console.log
  });

  const handleOnClose = () => {
    setOpen(false);
  };
  const handleOnClick = () => {
    setOpen(true);
  };

  const handleOnBack = () => {
    //check for data change
    if (isEdit) {
      navigate(`../${orderId}/summary`);
    } else {
      editByStage(ORDER_STAGES.THERAPY_SELECTION);
      navigate(`../edit-order/${orderId}`);
    }
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

  const handleOnBackToOrders = () => {
    //compare data change, display modal for confirmation
    navigate(-1);
  };

  const getAddress = (acc) => {
    return [acc.houseNumber, acc.street, acc.district, acc.city, acc.state, acc.zipCode].join(', ');
  };

  const handleOnAccountSelection = (selectedAccount) => {
    setSelectedAccount(selectedAccount);
    setOpen(false);
  };

  React.useEffect(() => {
    if (CommonUtils.isNonEmptyObject(accountsListData) && formState.activeRecord) {
      const { accountDetails } = formState.activeRecord;
      if (accountDetails) {
        const { soldToAccount, shipToAccount } = accountDetails;
        if (soldToAccount) {
          const originalSelectedAccount = accountsListData.content?.filter((acc) => acc.accountNumber === soldToAccount.accountNumber)[0];
          if (originalSelectedAccount) setSelectedAccount(originalSelectedAccount);
        }
        if (shipToAccount) {
          setSelectedShippingAddress(shipToAccount);
        }
      } else {
        console.log('Could not set account');
      }
    }
  }, [formState?.activeRecord, accountsListData]);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={<Heading as="h1">{isEdit ? t('headings.editOrder') : t('headings.createNewOrder')}</Heading>} />

      <div className="MCP-module-body">
        <OrderStepper />
        <div className={`MCP-module-wrapper`}>
          <OrderHeaderDetails />
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
                <div className={'grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3'}>
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
                  </div>
                  <div></div>
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
                        value={selectedAccount?.accountNumber || ''}
                      />
                    </div>
                    <Link to="#" onClick={handleOnClick} className="action-link">
                      {t('labels.needAssistanceSelectingAccount')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <ShippingAddressProvider accountDetails={{ therapyId, selectedAccount }}>
              <ShippingAddress selectedShippingAddress={selectedShippingAddress} setSelectedShippingAddress={setSelectedShippingAddress} />
            </ShippingAddressProvider>
          </div>
          <div className="controls">
            <Button size="md" onClick={handleOnBack} variant="secondary">
              {t('captions.btnBack')}
            </Button>
            <Button size="md" onClick={() => {}} variant="secondary">
              {t('captions.btnInventorySelection')}
            </Button>
            <Button size="md" onClick={handleOnSubmit} disabled={!selectedShippingAddress || isSaving} variant="primary" type="submit">
              {isSaving ? 'Saving' : t('captions.btnSaveAndContinue')}
            </Button>
          </div>
          {open && (
            <FloatingDrawer open={open} anchor="right" onClose={handleOnClose}>
              <AccountSelectionUserGuide therapyId={therapyId} onSubmit={handleOnAccountSelection} onClose={handleOnClose} />
            </FloatingDrawer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSelection;
