import React, { useContext, useMemo, useState } from 'react';
import { Heading, Button } from '@mckesson/mcp-component-library';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './AccountSelection.module.scss';
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
import useAlert from '@src/hooks/useAlert';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import useOrder from '../../../orders/useOrder';
import { Loader } from '@mckesson/mcp-component-library';
import { useOrderPrice } from '../additional-details/useOrderPrice';
import { CGAT_IDENTIFIER, CHANNEL_TYPE } from '../Constants';
import { FooterContext } from '@src/components/footer/FooterContext';

const AccountSelection = () => {
  const { t } = useTranslate();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const [accountConfig, setAccountConfig] = React.useState(null);
  const { controlRef } = useContext(FooterContext);
  const { isEdit = false, isApprover = false, alertState, isTherapyChanged = false } = location.state || {};
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [accountError, setAccountError] = useState({
    isError: false,
    message: ''
  });
  const { data: orderDetails = {}, isFetching: isFetchingOrderDetails, isError, error, isLoader } = useOrder(orderId);

  const [selectedSoldToAccount, setSelectedSoldToAccount] = React.useState(null);
  const [selectedShipToAccount, setSelectedShipToAccount] = React.useState(null);

  React.useEffect(() => {
    if (!isTherapyChanged) {
      setSelectedSoldToAccount(orderDetails.accountDetails?.soldToAccount);
      setSelectedShipToAccount(orderDetails.accountDetails?.shipToAccount);
    }
  }, [orderDetails]);

  const tradeDetails = orderDetails.tradeDetails;

  const { data: priceDetails } = useOrderPrice({
    trade: tradeDetails,
    soldToAccountId: selectedSoldToAccount?.accountNumber,
    shipToAccountId: selectedShipToAccount?.accountNumber,
    channelType: selectedSoldToAccount?.channelType || CHANNEL_TYPE.BUY_AND_BILL
  });

  const alertContainerId = 'accountSelection-alert-Container';
  const { showAlert } = useAlert();

  React.useEffect(() => {
    const { paporder: isPapOrder } = orderDetails || {};
    if (isPapOrder) navigate('/orders');
  }, [orderDetails]);

  const { isLoading: isSaving, mutate: saveAccount } = useMutation(async (data) => OrderService.saveAccount(orderId, data), {
    onSuccess: async (result) => {
      const { id } = result;
      try {
        navigate(`../${id}/patient`, {
          state: { alertState, isEdit: false, isApprover: isApprover }
        });
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
  });

  const handleOnClose = () => {
    setOpen(false);
  };
  const handleOnClick = () => {
    setAccountError({ isError: false, message: '' });
    setOpen(true);
  };

  const isDirty = useMemo(() => {
    return (
      JSON.stringify(selectedSoldToAccount) !== JSON.stringify(orderDetails.accountDetails?.soldToAccount) ||
      JSON.stringify(selectedShipToAccount) !== JSON.stringify(orderDetails.accountDetails?.shipToAccount)
    );
  }, [selectedSoldToAccount, selectedShipToAccount]);

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
    if (!selectedShipToAccount || !selectedSoldToAccount || isSaving) {
      if (!selectedShipToAccount && selectedSoldToAccount) {
        setAccountError({
          isError: true,
          message: t('messages.selectshippingAddress')
        });
      } else if (!selectedSoldToAccount) {
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
    if (selectedSoldToAccount && selectedShipToAccount) {
      const payload = {
        program: accountConfig.channelType === CHANNEL_TYPE.BUY_AND_BILL ? CGAT_IDENTIFIER[accountConfig.program] : '',
        soldToAccountId: selectedSoldToAccount.id,
        shipToAccountId: selectedShipToAccount.id
      };
      setAccountError({ isError: false, message: '' });

      saveAccount(payload);
    } else {
      if (!selectedSoldToAccount) {
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
      navigate(RoutePaths.pathOrderManagement, {
        state: { activeTab: location?.state?.fromTab }
      });
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
    return [acc.houseNumber, acc.street, acc.district, acc.city, acc.state, acc.zipCode].filter(Boolean).join(', ');
  };

  const handleOnAccountSelection = (selectedAccount, config) => {
    setSelectedShipToAccount('');
    setSelectedSoldToAccount(selectedAccount);
    setAccountConfig(config);
    setOpen(false);
  };

  if (isLoader) {
    return isLoader;
  }
  if (isSaving) {
    return <Loader type={'screen'} />;
  }

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')} />

      <div className="MCP-module-body">
        <OrderStepper
          status={orderDetails?.currentStage}
          patientDetailsRequired={orderDetails?.patientDetailsRequired}
          channelType={orderDetails.channelType}
        />
        <div className={`MCP-module-wrapper`}>
          <OrderHeaderDetails
            orderDetails={orderDetails}
            priceDetails={priceDetails}
            selectedAccount={{
              shipToAccount: selectedShipToAccount,
              soldToAccount: selectedSoldToAccount
            }}
          />
          {accountError.isError && <div id={alertContainerId} />}
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
              <div className="MCP-CardContainer">
                <div className={'grid grid-gap-12 sm:grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'}>
                  <div className={styles.account}>
                    <div className={styles.accountDetails}>
                      {selectedSoldToAccount ? (
                        <React.Fragment>
                          <p className={styles.name}>
                            <b>{selectedSoldToAccount.accountName}</b>
                          </p>
                          <p className={styles.address}>{getAddress(selectedSoldToAccount.address)}</p>
                          <p className={styles.address}>
                            <span>
                              {t('Distribution Channel')} - {t(`labels.${selectedSoldToAccount?.channelType}`)}
                            </span>
                          </p>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <Heading as="h3">{t('labels.pleaseSelectAccount')}</Heading>
                          <div className={styles.btnAccount}>
                            <Button size="md" onClick={handleOnClick} variant="secondary">
                              {t('captions.btnSelectYourAccount')}
                            </Button>
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                  {selectedSoldToAccount && (
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
            {selectedSoldToAccount && (
              <ShippingAddressProvider accountDetails={{ trade: tradeDetails, selectedAccount: selectedSoldToAccount }}>
                <ShippingAddress selectedShippingAddress={selectedShipToAccount} setSelectedShippingAddress={setSelectedShipToAccount} />
              </ShippingAddressProvider>
            )}
          </div>
          <div className="footer-wrapper" ref={controlRef}>
            <div className="controls footer-controls">
              <Button size="md" onClick={handleOnBack} variant="secondary">
                {t('captions.btnBack')}
              </Button>
              <Button size="md" onClick={handleOnSubmit} variant="primary" type="submit">
                {t('captions.btnSaveAndContinue')}
              </Button>
            </div>
          </div>
          {open && (
            <AccountSelectionUserGuide
              openDrawer={open}
              trade={tradeDetails}
              onSubmit={handleOnAccountSelection}
              onClose={handleOnClose}
              channelType={tradeDetails?.channelType}
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
