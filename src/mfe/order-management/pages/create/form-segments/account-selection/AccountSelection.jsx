import React, { useContext, useState } from 'react';
import { Heading, Button, Loader } from '@mckesson/mcp-component-library';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './AccountSelection.module.scss';
import AccountSelectionUserGuide from './AccountSelectionUserGuide';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { ShippingAddressProvider } from '../../../../context/ShippingAddressContext';
import PageHeader from '@src/components/pageHeader';
import { useMutation } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';
import ShippingAddress from './ShippingAddress';
import OrderHeaderDetails from '../OrderHeaderDetails';
import OrderStepper from '../OrderStepper';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import useOrder from '../../../orders/useOrder';
import { useOrderPrice } from '../additional-details/useOrderPrice';
import { CGAT_IDENTIFIER, CHANNEL_TYPE, ORDER_STAGES } from '../Constants';
import { FooterContext } from '@src/components/footer/FooterContext';
import Alert from '@src/components/cgat-alert/Alert';
import CommonUtils from '@src/util/CommonUtils';
import ManufacturerLogo from '../ManufacturerLogo';
import { ORDER_STATUS } from '../../../orders/config';
import { NotifyAlert } from '../OrderUtil';
import Collaborator from '../Collaborator';
import withPermissions from '@src/mfe/order-management/routes/OrderPermissions';
import { useDispatch } from 'react-redux';
import { hasUnsavedChanges } from '@src/store/reducer/orderReducer';
import { openModal } from '@src/store/reducer/modalReducer';

const AccountSelection = ({ readOnly, hasPermission }) => {
  const { t } = useTranslate();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const locationState = location?.state ?? {};
  const [accountConfig, setAccountConfig] = React.useState(null);
  const { controlRef } = useContext(FooterContext);
  const { isEdit = false, isApprover = false, alertState, isTherapyChanged = false } = locationState;
  const updatedLocationState = { ...locationState, isTherapyChanged: false };
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [alert, setAlert] = useState(null);
  const { data: orderDetails = {}, isFetching, refetch: refreshOrderDetails } = useOrder(orderId);
  const isStageInDraft = orderDetails.isDraft;
  const [selectedSoldToAccount, setSelectedSoldToAccount] = React.useState(null);
  const [selectedShipToAccount, setSelectedShipToAccount] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const [tradeDetails, setTradeDetails] = React.useState(null);
  const dispatch = useDispatch();
  const alertContainerId = 'accountSelection-alert-Container';

  React.useEffect(() => {
    if (!orderDetails?.id) return;

    const { isPapOrder, status, tradeDetails, accountDetails: { soldToAccount, shipToAccount } = {} } = orderDetails;

    if (isPapOrder) {
      navigate(`${RoutePaths.pathOrderManagement}${updatedLocationState?.__prevSearch}`);
      return;
    }

    if (status === ORDER_STATUS.REVIEW) {
      navigate(RoutePaths.pathOrderManagement, { replace: true });
      return;
    }

    if (!isTherapyChanged) {
      setSelectedSoldToAccount(soldToAccount);
      setSelectedShipToAccount(shipToAccount);
    }
    if (tradeDetails) setTradeDetails(tradeDetails);

    if (!soldToAccount) return;

    setAccountConfig({
      program: CGAT_IDENTIFIER[soldToAccount.cgatIdentifier],
      channelType: soldToAccount.channelType
    });
  }, [orderDetails]);

  React.useEffect(() => {
    if (isTherapyChanged && !hasPermission) {
      const { isTherapyChanged, ...newState } = location.state;
      navigate(location.pathname, { state: newState });
      const state = {};
      state.title = t('title.stepSuccessfulCompletionByUnAuthorizedUser');
      state.body = (
        <div className="MCP-modal-body">
          <p>{t('message.stepSuccessfulCompletionByUnAuthorizedUser')}</p>
        </div>
      );
      dispatch(openModal(state));
    }
  }, []);

  const { data: priceDetails } = useOrderPrice({
    trade: tradeDetails,
    soldToAccountId: selectedSoldToAccount?.accountNumber,
    shipToAccountId: selectedShipToAccount?.accountNumber,
    channelType: selectedSoldToAccount?.channelType || CHANNEL_TYPE.BUY_AND_BILL
  });

  const handleSaveSuccess = (result, variables) => {
    const { id } = result;

    if (variables.isDraft) {
      handleDraftSaveSuccess();
      return;
    }

    navigateToPatient(id);
  };

  const handleDraftSaveSuccess = () => {
    refreshOrderDetails();
    const { isTherapyChanged, ...rest } = location.state || {};
    setIsDirty(false);
    setAlert({
      description: 'Order Saved In Draft Successfully',
      type: 'success'
    });
    navigate(location.pathname, { state: rest });
  };

  const navigateToPatient = (orderId) => {
    navigate(`${RoutePaths.pathOrderManagement}/${orderId}/patient`, {
      state: {
        ...updatedLocationState,
        alertState,
        isEdit: false,
        isApprover,
        changeOnPreviousStep: true
      }
    });
  };

  const handleSaveError = (error) => {
    const statusCode = error?.response?.status;
    const description = statusCode >= 400 && statusCode < 600 ? t('error.default') : CommonUtils.getAxiosErrorMessage(error);

    setAlert({
      description,
      type: 'error'
    });
  };

  const { isLoading: isSaving, mutate: saveAccount } = useMutation(
    ({ isDraft, isSendNotification, ...payload }) => OrderService.saveAccount(orderId, payload, isDraft, isSendNotification),
    {
      onSuccess: handleSaveSuccess,
      onError: handleSaveError
    }
  );

  const handleOnClick = () => {
    setAlert(null);
    setOpen(true);
  };

  React.useEffect(() => {
    const isDirty =
      selectedSoldToAccount?.accountNumber !== orderDetails.accountDetails?.soldToAccount?.accountNumber ||
      selectedShipToAccount?.id !== orderDetails.accountDetails?.shipToAccount?.id;
    if (isTherapyChanged && !CommonUtils.isNonEmptyObject(selectedShipToAccount) && !CommonUtils.isNonEmptyObject(selectedSoldToAccount)) {
      setIsDirty(false);
    } else {
      setIsDirty(Boolean(isDirty));
    }
    dispatch(hasUnsavedChanges(isDirty));
    return () => dispatch(hasUnsavedChanges(false));
  }, [selectedSoldToAccount, selectedShipToAccount]);

  const handleOnBack = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : 'details');
      return;
    }
    if (isEdit) {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/summary`, {
        state: { ...updatedLocationState, isEdit: isEdit, isApprover: isApprover }
      });
    } else {
      navigate(`${RoutePaths.pathOrderManagement}/edit-order/${orderId}`, {
        state: { ...updatedLocationState, isEdit: false, isApprover: isApprover, isBack: true }
      });
    }
  };

  const handleOnSaveAsDraft = () => {
    handleOnSubmit(true);
  };

  const handleOnSaveAndContinue = () => {
    if (!selectedShipToAccount) {
      setAlert({
        type: 'error',
        description: t('messages.selectshippingAddress')
      });
      return;
    }
    if (!selectedSoldToAccount) {
      setAlert({
        type: 'error',
        description: t('messages.selectAccount'),
        anchorEl: alertContainerId
      });
      return;
    }
    handleOnSubmit();
  };

  const handleOnSubmit = async (isDraft) => {
    if (isSaving) return;

    const payload = {
      program: accountConfig?.channelType === CHANNEL_TYPE.BUY_AND_BILL ? CGAT_IDENTIFIER[accountConfig.program] : '',
      soldToAccountId: selectedSoldToAccount.id,
      shipToAccountId: selectedShipToAccount?.id || ''
    };
    setAlert(null);
    if (isStageInDraft || isDirty) {
      saveAccount({ ...payload, isDraft, isSendNotification: !isDraft });
    } else {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/patient`, {
        state: { ...updatedLocationState, alertState, isEdit: false, isApprover }
      });
    }
  };

  const handleOnBackToOrders = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      const prevSearch = updatedLocationState?.__prevSearch || '';
      navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    }
  };

  const handleNavigate = () => {
    const prevSearch = updatedLocationState?.__prevSearch || '';
    if (modalSuccessCallback === 'list') {
      navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    } else if (modalSuccessCallback === 'details') {
      navigate(`${RoutePaths.pathOrderManagement}/edit-order/${orderId}`, {
        state: { ...updatedLocationState, isEdit: false, isApprover: isApprover, isBack: true }
      });
    } else if (modalSuccessCallback === 'summary') {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/summary`, {
        state: { ...updatedLocationState, isEdit: false, isApprover: isApprover }
      });
    }
  };

  const getAddress = (acc) => {
    return [acc.houseNumber, acc.street, acc.district, acc.city, acc.state, acc.zipCode].filter(Boolean).join(', ');
  };

  const handleOnAccountSelection = (selectedAccount, config) => {
    setSelectedSoldToAccount(selectedAccount);
    setSelectedShipToAccount(null);
    setAccountConfig(config);
    setOpen(false);
  };

  return (
    <div className="MCP-module-wrapper">
      {(isSaving || isFetching) && <Loader type={'screen'} />}
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <ModuleHeader
        heading={<PageHeader heading={isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')} />}
        controls={
          <div className="controls">
            {orderDetails?.collaborators && (
              <Collaborator
                collaborators={orderDetails?.collaborators}
                channelType={orderDetails.channelType}
                currentStage={orderDetails?.currentStage}
                orderId={orderId}
              />
            )}
            {orderDetails?.therapy?.manufacturerName ? <ManufacturerLogo therapyId={orderDetails.therapy?.id} /> : null}
          </div>
        }
      />

      <div className="MCP-module-body">
        <OrderStepper
          status={orderDetails?.currentStage}
          patientDetailsRequired={orderDetails?.patientDetailsRequired}
          channelType={orderDetails.channelType}
        />
        {readOnly && (
          <NotifyAlert
            stage={ORDER_STAGES.ACCOUNT_DETAILS}
            OnEdit={readOnly && orderDetails?.currentStage !== ORDER_STAGES.ACCOUNT_DETAILS ? true : false}
            orderId={orderId}
            setAlert={setAlert}
          />
        )}
        <OrderHeaderDetails
          orderDetails={orderDetails}
          priceDetails={priceDetails}
          selectedAccount={{
            shipToAccount: selectedShipToAccount,
            soldToAccount: selectedSoldToAccount
          }}
          channelType={selectedSoldToAccount?.channelType}
        />
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        <div className={`MCP-module-wrapper`}>
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
                            <Button size="md" onClick={handleOnClick} variant="secondary" disabled={readOnly}>
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
                        <Button variant="tertiary" onClick={handleOnClick} disabled={readOnly}>
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
                <ShippingAddress selectedShippingAddress={selectedShipToAccount} readOnly={readOnly} setSelectedShippingAddress={setSelectedShipToAccount} />
              </ShippingAddressProvider>
            )}
          </div>
          <div className="footer-wrapper" ref={controlRef}>
            <div className="controls footer-controls">
              <Button size="md" onClick={handleOnBack} variant="secondary">
                {t('captions.btnBack')}
              </Button>
              <Button size="md" onClick={handleOnSaveAsDraft} variant="primary" type="submit" disabled={readOnly || !isDirty}>
                {t('button.caption.saveAsDraft')}
              </Button>
              <Button size="md" onClick={handleOnSaveAndContinue} variant="primary" type="submit" disabled={readOnly}>
                {t('captions.btnSaveAndContinue')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <React.Fragment>
        <DiscardChangesModal
          heading={t('messages.confirmation.discardheader')}
          description={t('messages.confirmation.account')}
          isOpen={Boolean(modalSuccessCallback)}
          onClose={() => setModalSuccessCallback(null)}
          onConfirm={handleNavigate}
        />
        {open && (
          <AccountSelectionUserGuide
            openDrawer={open}
            trade={tradeDetails}
            onSubmit={handleOnAccountSelection}
            onClose={() => setOpen(false)}
            channelType={tradeDetails?.channelType}
          />
        )}
      </React.Fragment>
    </div>
  );
};

export default withPermissions(AccountSelection, ORDER_STAGES.ACCOUNT_DETAILS);
