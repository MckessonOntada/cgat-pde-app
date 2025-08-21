import React, { useContext, useMemo, useState } from 'react';
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
import OrderAttestation from '../OrderAttestation';
import { NotifyAlert, showSaveAsDraftConfirm } from '../OrderUtil';
import Collaborator from '../Collaborator';
import withPermissions from '@src/mfe/order-management/routes/OrderPermissions';
import { useDispatch } from 'react-redux';
import { hasUnsavedChanges } from '@src/store/reducer/orderReducer';

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
  const { data: orderDetails = {}, isFetching } = useOrder(orderId);

  const [selectedSoldToAccount, setSelectedSoldToAccount] = React.useState(null);
  const [selectedShipToAccount, setSelectedShipToAccount] = React.useState(null);
  const [isSelfAttested, setIsSelfAttested] = React.useState(false);

  const handleConfirmChange = (checked) => {
    setIsSelfAttested(checked);
  };

  React.useEffect(() => {
    const stage = orderDetails?.currentStage;
    if (stage == null) {
      setIsSelfAttested(false);
    } else if (stage !== ORDER_STAGES.ACCOUNT_DETAILS) {
      setIsSelfAttested(true);
    } else {
      setIsSelfAttested(isSelfAttested);
    }
  }, [orderDetails?.currentStage]);

  React.useEffect(() => {
    const { paporder: isPapOrder } = orderDetails || {};
    if (isPapOrder) navigate(`${RoutePaths.pathOrderManagement}${updatedLocationState?.__prevSearch}`);
    if (orderDetails.status === ORDER_STATUS.REVIEW) navigate(`${RoutePaths.pathOrderManagement}`, { replace: true });
  }, [orderDetails]);

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

  React.useEffect(() => {
    if (orderDetails.accountDetails && orderDetails.accountDetails.shipToAccount) {
      setAccountConfig({
        program: CGAT_IDENTIFIER[orderDetails.accountDetails.shipToAccount.cgatIdentifier],
        channelType: orderDetails.accountDetails.shipToAccount.channelType
      });
    }
  }, [orderDetails]);
  React.useEffect(() => {
    if (orderDetails.accountDetails && orderDetails.accountDetails.shipToAccount) {
      setAccountConfig({
        program: CGAT_IDENTIFIER[orderDetails.accountDetails.shipToAccount.cgatIdentifier],
        channelType: orderDetails.accountDetails.shipToAccount.channelType
      });
    }
  }, [orderDetails]);

  const { isLoading: isSaving, mutate: saveAccount } = useMutation(async ({ isDraft, ...data }) => OrderService.saveAccount(orderId, data, isDraft), {
    onSuccess: async (result) => {
      const { id } = result;
      if (isSelfAttested) {
        try {
          navigate(`${RoutePaths.pathOrderManagement}/${id}/patient`, {
            state: { ...updatedLocationState, alertState, isEdit: false, isApprover: isApprover }
          });
        } catch (err) {
          console.error(err);
        }
      } else {
        setAlert({
          description: 'Order Saved In Draft Successfully',
          type: 'success'
        });
      }
    },
    onError: (error) => {
      const statusCode = error?.response?.status;
      let description = t('error.default');
      if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

      setAlert({
        description,
        type: 'error'
      });
    }
  });

  const handleOnClose = () => {
    setOpen(false);
  };
  const handleOnClick = () => {
    setAlert(null);
    setIsSelfAttested(false);
    setOpen(true);
  };
  const [isDirty, setIsDirty] = React.useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const isDirty =
      JSON.stringify(selectedSoldToAccount) !== JSON.stringify(orderDetails.accountDetails?.soldToAccount) ||
      JSON.stringify(selectedShipToAccount) !== JSON.stringify(orderDetails.accountDetails?.shipToAccount);

    setIsDirty(isDirty);
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

  const handleOnSubmit = async () => {
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
    if (isSaving) return;

    const payload = {
      program: accountConfig?.channelType === CHANNEL_TYPE.BUY_AND_BILL ? CGAT_IDENTIFIER[accountConfig.program] : '',
      soldToAccountId: selectedSoldToAccount.id,
      shipToAccountId: selectedShipToAccount.id
    };

    if (!isSelfAttested) {
      showSaveAsDraftConfirm({
        t,
        onOk: () => {
          saveAccount({ ...payload, isDraft: true });
        }
      });
    } else {
      setAlert(null);
      if (isDirty) {
        saveAccount(payload);
      } else {
        navigate(`${RoutePaths.pathOrderManagement}/${orderId}/patient`, {
          state: { ...updatedLocationState, alertState, isEdit: false, isApprover }
        });
      }
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
    setSelectedShipToAccount('');
    setSelectedSoldToAccount(selectedAccount);
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
            {orderDetails?.collaborators && <Collaborator collaborators={orderDetails?.collaborators} />}
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
        {/* <div className={`MCP-module-wrapper ${readOnly ? 'disabled-div' : ''}`}> */}
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
          <OrderAttestation stage={ORDER_STAGES?.ACCOUNT_DETAILS} onCheck={handleConfirmChange} isChecked={isSelfAttested} disabled={readOnly} />
          <div className="footer-wrapper" ref={controlRef}>
            <div className="controls footer-controls">
              <Button size="md" onClick={handleOnBack} variant="secondary">
                {t('captions.btnBack')}
              </Button>
              <Button size="md" onClick={handleOnSubmit} variant="primary" type="submit" disabled={readOnly}>
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

//export default AccountSelection;
export default withPermissions(AccountSelection, ORDER_STAGES.ACCOUNT_DETAILS);
