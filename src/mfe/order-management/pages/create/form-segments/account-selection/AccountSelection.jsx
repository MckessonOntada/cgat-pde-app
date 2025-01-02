import React, { useMemo, useState } from 'react';
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
import useAlert from '@src/hooks/useAlert';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';

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
  const [initialSelectedAccount, setInitialSelectedAccount] = React.useState(null);
  const [initialSelectedShippingAddress, setInitialSelectedShippingAddress] = React.useState('');
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const { formState, setActiveRecord, setCurrentOrder, editByStage } = useManageOrder();
  const [acccountError, setAccountError] = useState({ isError: false, message: '' });
  const [alertState, setAlertState] = useState(null);
  const therapyId = formState.activeRecord?.therapy?.materialNumber;
  const [netPriceData, setNetPriceData] = useState(null);

  const alertContainerId = 'accountSelection-alert-Container';
  const { showAlert } = useAlert();

  React.useEffect(() => {
    orderId && setCurrentOrder(orderId, ORDER_STAGES.ACCOUNT_DETAILS);
  }, []);

  const { isLoading: isPriceApiLoading, data: priceDetails = {} } = useQuery({
    queryKey: ['order', 'therapy', 'price', therapyId, selectedAccount?.accountNumber, selectedShippingAddress?.accountNumber],
    queryFn: async () => {
      return OrderService.getPriceDetails(therapyId, selectedAccount.accountNumber, selectedShippingAddress.accountNumber);
    },
    enabled: !!therapyId && !!selectedAccount?.accountNumber && !!selectedShippingAddress?.accountNumber,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setNetPriceData(data.netPrice);
    }
  });

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
      const subLabel = [acc.houseNumber, acc.street, acc.city, acc.state, acc.zipCode].filter(Boolean).join(', ');
      accArr.push({ label, value, subLabel });
    });

    return accArr;
  }, [accountsListData, formState.activeRecord]);

  const { isLoading: isSaving, mutate: saveAccount } = useMutation(async (data) => OrderService.saveAccount(orderId, data), {
    onSuccess: async (result) => {
      const { id } = result;
      setActiveRecord(result);
      try {
        const alertState = await handleInventoryCheck();
        if (result.patientDetailsRequired) {
          navigate(`../${id}/patient`, { state: { alertState } });
        } else {
          navigate(`../${id}/additional-details`, { state: { alertState } });
        }
      } catch (err) {
        console.error(err);
      }
    },
    onError: console.log
  });

  const handleInventoryCheck = async () => {
    const selectedAccountDetails = accountsListData.content.find((acc) => acc.accountNumber === selectedAccount?.accountNumber);
    const requestPayload = {
      customerNumber: selectedShippingAddress?.accountNumber,
      shipTo: selectedAccount?.accountNumber,
      salesOrg: selectedAccountDetails.salesOrg,
      distChannel: selectedAccountDetails.distributionChannel,
      division: selectedAccountDetails.division,
      companyCode: selectedAccountDetails.companyCode,
      orderId,
      items: null
    };

    try {
      const res = await OrderService.getInventoryStatus(requestPayload);
      if (res.status === 200) {
        showAlert({
          description: t('messages.inventoryCheck.success'),
          type: 'success',
          anchorEl: alertContainerId
        });
      }
    } catch (err) {
      if (err.status === 400) {
        showAlert({
          description: t('messages.inventoryCheck.error'),
          type: 'warning',
          anchorEl: alertContainerId
        });
        return {
          description: t('messages.inventoryCheck.error'),
          type: 'warning'
        };
      } else {
        showAlert({ description: err.message, type: 'error', anchorEl: alertContainerId });
      }
    }
  };

  const handleOnClose = () => {
    setOpen(false);
  };
  const handleOnClick = () => {
    setOpen(true);
  };

  const isDirty =
    JSON.stringify(selectedAccount) !== JSON.stringify(initialSelectedAccount) ||
    JSON.stringify(selectedShippingAddress) !== JSON.stringify(initialSelectedShippingAddress);

  const handleOnBack = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : 'details');
      return;
    }

    if (isEdit) {
      navigate(`../${orderId}/summary`, { state: { isEdit: true } });
    } else {
      editByStage(ORDER_STAGES.THERAPY_SELECTION);
      navigate(`../edit-order/${orderId}`);
    }
  };

  const handleOnSubmit = async () => {
    if (selectedAccount && selectedShippingAddress) {
      const payload = {
        soldToAccountId: selectedAccount.id,
        shipToAccountId: selectedShippingAddress.id
      };
      setAccountError({ isError: false, message: '' });

      saveAccount(payload);
    } else {
      if (!selectedAccount) {
        setAccountError({ isError: true, message: 'Please select an account before proceeding.' });
        return;
      }
    }
  };

  const handleOnBackToOrders = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      navigate(RoutePaths.pathOrderManagement);
    }
  };
  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(RoutePaths.pathOrderManagement);
    } else if (modalSuccessCallback === 'details') {
      editByStage(ORDER_STAGES.THERAPY_SELECTION);
      navigate(`../edit-order/${orderId}`);
    } else if (modalSuccessCallback === 'summary') {
      navigate(`../${orderId}/summary`, { state: { isEdit: true } });
    }
  };

  const getAddress = (acc) => {
    return [acc.houseNumber, acc.street, acc.district, acc.city, acc.state, acc.zipCode].filter(Boolean).join(', ');
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

          setInitialSelectedAccount(originalSelectedAccount); // Set initial value;
        }
        if (shipToAccount) {
          setSelectedShippingAddress(shipToAccount);
          setInitialSelectedShippingAddress(shipToAccount); // Set initial value
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
          <OrderHeaderDetails netPriceData={netPriceData} />
          <div id={alertContainerId} />
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
                        value={selectedAccount?.accountNumber || ''}
                        onChange={(val) => setSelectedAccount(accountsListData.content?.filter((acc) => acc.accountNumber === val)[0])}
                        options={accountListOptions}
                        forcedValue={selectedAccount?.accountNumber}
                        variant={'async'}
                        onSearch={(e) => {
                          setAccountSearchString(() => e);
                        }}
                        recordsCountToEnableSearch={5}
                        error={acccountError.isError && acccountError.message}
                        size="lg"
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
              {isEdit ? t('captions.btnBack') : t('captions.btnBacktoTherapySelection')}
            </Button>
            <Button
              size="md"
              onClick={() => {
                handleInventoryCheck();
              }}
              variant="secondary">
              {t('captions.btnInventoryCheck')}
            </Button>
            <Button
              size="md"
              onClick={handleOnSubmit}
              disabled={!selectedShippingAddress || !selectedAccount || isSaving}
              variant="primary"
              type="submit">
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
      <DiscardChangesModal
        heading={t('messages.confirmation.discardheader')}
        description={t('messages.confirmation.account')}
        isOpen={Boolean(modalSuccessCallback)}
        onClose={() => setModalSuccessCallback(null)}
        onConfirm={handleNavigate}
      />
    </div>
  );
};

export default AccountSelection;
