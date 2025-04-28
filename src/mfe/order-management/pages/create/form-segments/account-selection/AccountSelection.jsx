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
import OrderService from '@src/api/commonService/OrderService';
import ShippingAddress from './ShippingAddress';
import OrderHeaderDetails from '../OrderHeaderDetails';
import OrderStepper from '../OrderStepper';
import { serializeParams } from '@src/util/ApiUtils';
import useAlert from '@src/hooks/useAlert';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import useOrder from '../../../orders/useOrder';
import { Loader } from '@mckesson/mcp-component-library';
import { useOrderPrice } from '../additional-details/useOrderPrice';

const AccountSelection = () => {
  const { t } = useTranslate();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const {
    isEdit = false,
    isApprover = false,
    alertState,
    isTherapyChanged = false
  } = location.state || {};
  const [updateState, setUpdateState] = useState({ isTherapyChanged });
  const [selectedAccount, setSelectedAccount] = React.useState(null);
  const [accountSearchString, setAccountSearchString] = React.useState('');
  const [selectedShippingAddress, setSelectedShippingAddress] =
    React.useState('');
  const [initialSelectedAccount, setInitialSelectedAccount] =
    React.useState(null);
  const [initialSelectedShippingAddress, setInitialSelectedShippingAddress] =
    React.useState('');
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [accountError, setAccountError] = useState({
    isError: false,
    message: ''
  });
  const {
    data: orderDetails,
    isFetching: isFetchingOrderDetails,
    isError,
    error,
    isLoader
  } = useOrder(orderId);
  const therapyId = orderDetails?.therapy?.materialNumber;
  const { data: priceDetails } = useOrderPrice({
    therapyId: therapyId,
    soldToAccountId: selectedAccount?.accountNumber,
    shipToAccountId: selectedShippingAddress?.accountNumber
  });

  const alertContainerId = 'accountSelection-alert-Container';
  const { showAlert } = useAlert();

  React.useEffect(() => {
    const { paporder: isPapOrder } = orderDetails || {};
    if (isPapOrder) navigate('/orders');
  }, [orderDetails]);

  const { isLoading, data: accountsListData = {} } = useQuery({
    queryKey: ['order', 'therapy', therapyId, accountSearchString],
    queryFn: async () =>
      OrderService.getSoldToAccounts(
        therapyId,
        serializeParams({ query: accountSearchString })
      ),
    enabled: !!therapyId && !!orderDetails.accountDetails.soldToAccount,
    refetchOnWindowFocus: false,
    onError: (error) => {
      showAlert({
        description: error.message,
        type: 'error',
        anchorEl: alertContainerId
      });
    }
  });

  const isSPAccountSelected = true;
  const { isLoading: isSaving, mutate: saveAccount } = useMutation(
    async (data) => OrderService.saveAccount(orderId, data),
    {
      onSuccess: async (result) => {
        const { id } = result;
        try {
          if (result.patientDetailsRequired || isSPAccountSelected) {
            navigate(`../${id}/patient`, {
              state: { alertState, isEdit: false, isApprover: isApprover }
            });
          } else {
            navigate(`../${id}/additional-details`, {
              state: { alertState, isEdit: false, isApprover: isApprover }
            });
          }
        } catch (err) {
          console.error(err);
        }
      },
      onError: (error) => {
        showAlert({
          description: error.message,
          type: 'error',
          anchorEl: alertContainerId
        });
      }
    }
  );

  const handleOnClose = () => {
    setOpen(false);
  };
  const handleOnClick = () => {
    setAccountError({ isError: false, message: '' });
    setUpdateState({ isTherapyChanged: false });
    setOpen(true);
  };

  const isDirty = useMemo(() => {
    return (
      JSON.stringify(selectedAccount) !==
        JSON.stringify(initialSelectedAccount) ||
      JSON.stringify(selectedShippingAddress) !==
        JSON.stringify(initialSelectedShippingAddress)
    );
  }, [
    selectedAccount,
    initialSelectedAccount,
    selectedShippingAddress,
    initialSelectedShippingAddress
  ]);

  const handleOnBack = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : 'details');
      return;
    }

    if (isEdit) {
      navigate(`../${orderId}/summary`, {
        state: { isEdit: isEdit, isApprover: isApprover }
      });
    } else {
      navigate(`../edit-order/${orderId}`, {
        state: { isEdit: false, isApprover: isApprover, isBack: true }
      });
    }
  };

  React.useEffect(() => {
    showAlert({
      description: accountError.message,
      type: 'error',
      anchorEl: alertContainerId
    });
  }, [accountError]);

  const handleOnSubmit = async () => {
    if (!selectedShippingAddress || !selectedAccount || isSaving) {
      if (!selectedShippingAddress && selectedAccount) {
        setAccountError({
          isError: true,
          message: t('messages.selectshippingAddress')
        });
      } else if (!selectedAccount) {
        setAccountError({
          isError: true,
          message: t('messages.selectAccount')
        });
      } else
        setAccountError({
          isError: true,
          message: t('messages.selectAccount')
        });

      return;
    }

    if (selectedAccount && selectedShippingAddress) {
      const payload = {
        soldToAccountId: selectedAccount.id,
        shipToAccountId: selectedShippingAddress.id
      };
      setAccountError({ isError: false, message: '' });

      saveAccount(payload);
    } else {
      if (!selectedAccount) {
        setAccountError({
          isError: true,
          message: 'Please select an account before proceeding.'
        });
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
      navigate(`../edit-order/${orderId}`, {
        state: { isEdit: false, isApprover: isApprover, isBack: true }
      });
    } else if (modalSuccessCallback === 'summary') {
      navigate(`../${orderId}/summary`, {
        state: { isEdit: false, isApprover: isApprover }
      });
    }
  };

  const getAddress = (acc) => {
    return [
      acc.houseNumber,
      acc.street,
      acc.district,
      acc.city,
      acc.state,
      acc.zipCode
    ]
      .filter(Boolean)
      .join(', ');
  };

  const handleOnAccountSelection = (selectedAccount) => {
    setSelectedShippingAddress('');
    setUpdateState({ isTherapyChanged: false });
    setSelectedAccount(selectedAccount);
    setOpen(false);
  };

  React.useEffect(() => {
    if (accountsListData && orderDetails) {
      const { accountDetails } = orderDetails;
      if (accountDetails) {
        const { soldToAccount, shipToAccount } = accountDetails;
        if (soldToAccount) {
          const originalSelectedAccount = accountsListData?.content?.filter(
            (acc) => acc.accountNumber === soldToAccount.accountNumber
          )[0];
          if (originalSelectedAccount)
            setSelectedAccount(originalSelectedAccount);

          setInitialSelectedAccount(originalSelectedAccount); // Set initial value;
        } else {
          if (updateState.isTherapyChanged) {
            setSelectedAccount('');
            setInitialSelectedAccount('');
          }
        }
        if (shipToAccount) {
          setSelectedShippingAddress(shipToAccount);
          setInitialSelectedShippingAddress(shipToAccount); // Set initial value
        } else {
          if (updateState.isTherapyChanged) {
            setSelectedShippingAddress('');
            setInitialSelectedShippingAddress('');
          }
        }
      } else {
        console.log('Could not set account');
      }
    }
  }, [orderDetails?.accountDetails, accountsListData, therapyId]);

  if (isLoader) {
    return isLoader;
  }
  if (isSaving) {
    return <Loader type={'screen'} />;
  }
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={handleOnBackToOrders}
          size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader
        heading={
          isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')
        }
      />

      <div className="MCP-module-body">
        <OrderStepper
          status={orderDetails?.currentStage}
          patientDetailsRequired={orderDetails?.patientDetailsRequired}
        />
        <div className={`MCP-module-wrapper`}>
          <OrderHeaderDetails
            orderDetails={orderDetails}
            priceDetails={priceDetails}
          />
          {accountError.isError && <div id={alertContainerId} />}
          <div className="MCP-panel-container">
            <div className={`MCP-module-body`}>
              <ModuleHeader
                heading={
                  <div>
                    <Heading as="h2">{t('labels.accountSelection')}</Heading>
                    <p className="dull-text">
                      {t('messages.selectAccountToBuyTherapy')}
                    </p>
                  </div>
                }
              />
              <div className="MCP-CardContainer">
                <div
                  className={
                    'grid grid-gap-12 sm:grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'
                  }>
                  <div className={styles.account}>
                    <div className={styles.accountDetails}>
                      {selectedAccount ? (
                        <React.Fragment>
                          <p className={styles.name}>
                            <b>{selectedAccount.accountName}</b>
                          </p>
                          <p className={styles.address}>
                            {getAddress(selectedAccount)}
                          </p>
                          <p className={styles.address}>
                            <span>
                              {t('labels.program')} -{' '}
                              {selectedAccount?.cgatIdentifier}
                            </span>
                          </p>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <Heading as="h3">
                            {t('labels.pleaseSelectAccount')}
                          </Heading>
                          <div className={styles.btnAccount}>
                            <Button
                              size="md"
                              onClick={handleOnClick}
                              variant="secondary">
                              {t('captions.btnSelectYourAccount')}
                            </Button>
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                  {selectedAccount && (
                    <div className={`${styles.controls} left-floating-control`}>
                      <div className="styled-icon-button">
                        <Button variant="tertiary" onClick={handleOnClick}>
                          {t('button.caption.change')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {selectedAccount && (
              <ShippingAddressProvider
                accountDetails={{ therapyId, selectedAccount }}>
                <ShippingAddress
                  selectedShippingAddress={selectedShippingAddress}
                  setSelectedShippingAddress={setSelectedShippingAddress}
                />
              </ShippingAddressProvider>
            )}
          </div>
          <div className="footer-wrapper">
            <div className="controls footer-controls">
              <Button size="md" onClick={handleOnBack} variant="secondary">
                {t('captions.btnBack')}
              </Button>
              <Button
                size="md"
                onClick={handleOnSubmit}
                variant="primary"
                type="submit">
                {t('captions.btnSaveAndContinue')}
              </Button>
            </div>
          </div>
          {open && (
            <AccountSelectionUserGuide
              openDrawer={open}
              therapyId={therapyId}
              onSubmit={handleOnAccountSelection}
              onClose={handleOnClose}
            />
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
