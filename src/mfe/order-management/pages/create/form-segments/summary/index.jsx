import { Badge, Button, CheckboxGroup, Heading, Label, Loader, Tooltip, Modal } from '@mckesson/mcp-component-library';
import { CUSTOMER_CENTRE, SYSTEM_ADMIN } from '@src/api/commonService/CommonService';
import OrderService from '@src/api/commonService/OrderService';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as IconEditField } from '@src/assets/svg/edit-field.svg';
import Alert from '@src/components/cgat-alert/Alert';
import DetailSegment from '@src/components/DetailSegment';
import FloatingDrawer from '@src/components/floating-drawer';
import { FooterContext } from '@src/components/footer/FooterContext';
import InfoModel from '@src/components/InfoModel/indix';
import ModuleHeader from '@src/components/module-header';
import PageHeader from '@src/components/pageHeader';
import PermittedComponent from '@src/components/permitted-component';
import TherapyDetailsWithTabs from '@src/components/therapyDetails/TherapyDetailsWithTabs';
import FormRenderer from '@src/mfe/core-config/admin/manage-providers/forms/FormRenderer';
import { REQUIREMENT } from '@src/mfe/core-config/system-admin/manage-material/assets/constants/MaterialConstants';
import withPermissions from '@src/mfe/order-management/routes/OrderPermissions';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import { RoutePaths } from '@src/routes/constants';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { hasUnsavedChanges } from '@src/store/reducer/orderReducer';
import { useTranslate } from '@src/translations/useTranslation';
import AuthUtils from '@src/util/AuthUtils';
import CommonUtils from '@src/util/CommonUtils';
import { renderModal } from '@src/util/ModalUtil';
import { useCustomPrint } from '@src/util/printUtils';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import React, { useContext, useRef } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ORDER_STATUS } from '../../../orders/config';
import { SAP_ORDER_STATUS } from '../../../orders/constants';
import useOrder from '../../../orders/useOrder';
import Collaborator from '../Collaborator';
import { CGAT_IDENTIFIER, CHANNEL_TYPE, MANUFACTURER, ORDER_STAGES } from '../Constants';
import { InventoryIndicator } from '../InventoryIndicator';
import ManufacturerLogo from '../ManufacturerLogo';
import OrderStepper from '../OrderStepper';
import { getOrderStepCaption, normalizeOrderResponse, NotifyAlert, showEditAlert } from '../OrderUtil';
import AttachmentCard from './AttachmentCard';
import CommentPanel from './CommentPanel';
import { BUTTON_ACTIONS } from './constants';
import { additionalDetailsValidationSchema, getUpdateFormConfig, patientDetailsValidationSchema } from './EditConfig';
import PayerDetailsSegment from './Segments/PayerDetailSegment';
import ProviderDetailsSegment from './Segments/ProviderDetailsSegment';
import styles from './Summary.module.scss';
import useSapOrder from './useSapOrder';
import useTimedArray from './useTimedArray';
import { TrackingDetails } from './tracking-details';
import { scrollToTopUtil } from '@src/components/scrollToTop/scrollUtils';
import { useWidgetContext } from '@src/context/WidgetContext';
import CancelOrderPanel from './CancelOrderPanel';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';
import OrderStatus from '../../../orders/status/OrderStatus';

const Summary = ({ readOnly, hasPermission, checkEditPermission }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const locationState = location?.state ?? {};
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get('orgId');
  const isCustomerCentreUser = AuthUtils.isCustomerCenterView();
  const [alert, setAlert] = React.useState(null);
  const { controlRef } = useContext(FooterContext);
  const { state, setValue } = useWidgetContext();
  const { orderDetails = {}, isApprover } = state;
  const isError = false;
  const { isSimulate = false, backToInvoiceListing = false, backToInvoiceDetails = false } = locationState || {};
  const [orderAgreementCheckboxError, setOrderAgreementCheckboxError] = React.useState(null);
  const [isCommentPanelOpen, setIsCommentPanelOpen] = React.useState(false);
  const [isCancelOrderPanelOpen, setIsCancelOrderPanelOpen] = React.useState(false);
  const [isCancelOrderConfirmationOpen, setIsCancelOrderConfirmationOpen] = React.useState(false);
  const [isCancellingOrder, setIsCancellingOrder] = React.useState(false);
  const [cancelOrderReason, setCancelOrderReason] = React.useState(null);
  const { items: notifications, add: addNotification, remove: removeNotification } = useTimedArray(10000);
  const [sapStatus, setSapStatus] = React.useState(SAP_ORDER_STATUS.OPEN);
  const [inventoryStatus, setInventoryStatus] = React.useState(null);
  const hasFetchedInventory = useRef(false);
  const [drawerElement, setDrawerElement] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const [draftChanges, setDraftChanges] = React.useState({});
  const [allowedSubmission, setAllowedSubmission] = React.useState(false);
  const {
    therapy = {},
    catalog = {},
    orderCost,
    accountDetails = {},
    patient = {},
    additionalDetails = {},
    patientDetailsRequired = false,
    rejectionDetails,
    paporder: isPapOrder,
    backendOrderId,
    id,
    status,
    payerDetails,
    provider,
    submittedBy,
    isCoiIdRequired,
    spTherapyConfig,
    therapyConfig = {}
  } = orderDetails;
  const { orcaPatient, isVerified: isOrcaPatientVerified } = state;
  const patientData = orcaPatient && Object.keys(orcaPatient).length > 0 ? orcaPatient : patient;
  const isSpOrder = orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA;
  const manufacturer = isSpOrder ? orderDetails.spTherapyConfig?.config?.manufacturerName : orderDetails.therapyConfig?.config?.manufacturerName;
  const isImpersonatedAdminWithPhiPermission = AuthUtils.isImpersonatedAdminWithPhiPermission();
  React.useEffect(() => {
    if (manufacturer === MANUFACTURER.ORCA) {
      setDraftChanges({
        additionalDetailsRequestDTO: { ...orderDetails.additionalDetails },
        patientIdentifier: patientData?.patientIdentifier,
        medicalRecordNumber: patientData?.medicalRecordNumber,
        manufacturerOrderId: patientData.manufacturerOrderId,
        coiId: orderDetails.patient?.coiId,
        patientDTO: { patient: { ...patientData } }
      });
    } else {
      setDraftChanges({
        additionalDetailsRequestDTO: { ...orderDetails.additionalDetails },
        patientIdentifier: orderDetails.patient?.patientIdentifier,
        medicalRecordNumber: orderDetails.patient?.medicalRecordNumber,
        coiId: orderDetails.patient?.coiId,
        patientDTO: null
      });
    }
  }, [orderDetails.id]);

  React.useEffect(() => {
    return () => dispatch(hasUnsavedChanges(false));
  }, []);

  // React.useEffect(() => {
  //   if (isError) {
  //     addNotification({
  //       type: 'error',
  //       description: error.message || 'Something went wrong please try again.'
  //     });
  //   }
  // }, [isError]);

  React.useEffect(() => {
    const { isChangeOnPreviousStep } = state;
    if (isChangeOnPreviousStep && !hasPermission) {
      navigate(location.pathname, { state: location.state });
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

  const [openDetails, setOpenDetails] = React.useState(false);
  const shouldShowIdentifierSection =
    isSpOrder &&
    (spTherapyConfig?.config?.fields ?? []).some(
      (field) => ['patientIdentifier', 'medicalRecordNumber', 'coiId'].includes(field?.fieldName) && field?.properties?.displayOnForm === true
    );

  const {
    data: sapOrderDetails,
    isLoading: isLoadingSapOrderStatus,
    refetch: retrySapOrderStatus
  } = useSapOrder(
    {
      sapOrderId: backendOrderId,
      salesOrgId: accountDetails.soldToAccount?.salesOrg,
      status,
      isSPOrder: isSpOrder,
      isCustomerCentreUser
    },
    (status) => setSapStatus(status),
    (error) => {
      setSapStatus(SAP_ORDER_STATUS.OPEN);
      addNotification({
        description: 'Something went wrong while checking SAP order status. Please try again later.',
        type: 'error',
        kind: 'SAP_ORDER_STATUS'
      });
    }
  );

  const getInventoryStatus = async () => {
    try {
      const response = await OrderService.getInventoryStatus(orderDetails.id);
      if (response.status === 200) {
        handleInventoryDetailsResponse(response.data);
      }
    } catch (error) {
      addNotification({
        description: 'Something went wrong while checking inventory. Please try again later.',
        type: 'error',
        isSticky: true
      });
      setInventoryStatus('PENDING');
    }
  };

  React.useState(() => {
    setAllowedSubmission(state.isVerified);
  }, [state.isVerified]);

  React.useEffect(() => {
    const { id, status, patient = {} } = orderDetails;
    const invalidStatuses = [ORDER_STATUS.SUBMITTED, ORDER_STATUS.REJECTED, 'DELETED'];

    if (!id || invalidStatuses.includes(status)) {
      return;
    }

    if (manufacturer === MANUFACTURER.ORCA && patient.patientInfo) {
      const patientInfo = patient.patientInfo;
      const isVerified = !!(patientInfo.firstName && patientInfo.lastName);
      setAllowedSubmission(isVerified);
      setValue('isVerified', isVerified);
    }

    if (catalog.inventoryType === 'T') {
      setInventoryStatus('DROP_SHIP');
    } else if (catalog.inventoryType === 'S' || catalog.inventoryType === 'I') {
      setInventoryStatus('CHECKING');
      if (hasFetchedInventory.current === false) {
        getInventoryStatus();
        hasFetchedInventory.current = true;
      }
    } else {
      console.log('Inventory type not supported');
    }
    if (orderDetails.id) {
      setPapOrderOptions((prevState) => ({
        ...prevState,
        isChecked: Boolean(orderDetails.paporder)
      }));
    }
  }, [orderDetails.id]);

  const handleInventoryDetailsResponse = (data = {}) => {
    const { erroredItems, warningMessages } = data.inventoryCheckResponse || {};
    if (erroredItems?.length > 0 || warningMessages?.length > 0) {
      if (erroredItems && erroredItems.length > 0) {
        erroredItems.forEach((err) => {
          addNotification({
            description: err.errorMessage,
            type: 'error',
            isSticky: true
          });
        });
      }
      if (warningMessages && warningMessages.length > 0) {
        warningMessages.forEach((warn) => {
          addNotification({
            description: warn.value,
            type: 'warning',
            isSticky: true
          });
        });
      }
      setInventoryStatus('OUT_OF_STOCK');
    } else {
      setInventoryStatus('AVAILABLE');
    }
  };

  const handleRetrySAPOrderStatus = () => {
    const sapOrderStatusAlerts = notifications.filter((item) => item.kind === 'SAP_ORDER_STATUS');
    if (sapOrderStatusAlerts && sapOrderStatusAlerts.length > 0) {
      sapOrderStatusAlerts.forEach((item) => removeNotification(item.id));
    }
    retrySapOrderStatus();
  };

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const isRejected = status === 'REJECTED';
  const isDeleted = status === 'DELETED';
  const isSubmitted = status === ORDER_STATUS.SUBMITTED;
  const isApprovalPending = status === ORDER_STATUS.APPROVAL_PENDING;
  const isCSReview = status === ORDER_STATUS.CS_REVIEW;

  const contentRef = useRef(null);
  const printPage = useCustomPrint(
    contentRef,
    `
    .MCP-module-wrapper{
      gap:8px !important;
    }
    .agreement-checkbox-control{
      display: none !important;
    }
    .MCP-CardContainer{
      page-break-inside: avoid;
      page-break-after: auto;
    }
    .MCP-CardContainer .print-div{
      display: flex;
    }
    .MCP-CardContainer > div{
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .price-wrapper {
      justify-content: flex-start !important;
    }
    .price-wrapper .fieldValue.normal {
      justify-content: flex-start !important;
    }
    #summary-alert-container{
      display: none !important;
    }
    .alert-container{
      display: none !important;
    }
    .alert-container-print{
      display: none !important;
    }
    .price-wrapper .fieldName {
      justify-content: flex-start !important;
    }`
  );

  const { isLoading: isSimulationLoading, data: simulationData = {} } = useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: async () => {
      return await OrderService.simulateOrder(orderId);
    },
    // enabled:
    //   isSpOrder || readOnly
    //     ? false
    //     : !status
    //     ? false
    //     : !([ORDER_STATUS.REJECTED, ORDER_STATUS.CANCELLED].includes(status) || isSubmitted || status === 'DELETED'),
    enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (result) => {
      const warningMessages = result.warningMessages?.map((msg) => msg.value) || [];
      const infoMessages = result.infoMessages?.map((msg) => msg.value) || [];

      if (warningMessages.length > 0) {
        warningMessages.forEach((msg) => {
          addNotification({
            description: msg,
            type: 'warning',
            isSticky: true
          });
        });
      }

      if (infoMessages.length > 0) {
        infoMessages.forEach((msg) => {
          addNotification({
            description: msg,
            type: 'info'
          });
        });
      }
    },
    onError: (error) => {
      const statusCode = error?.response?.status;
      let description = t('error.default');
      if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

      // setAlert({
      //   description,
      //   type: 'error'
      // });
    }
  });

  const { isLoading: isSaving, mutate: submitOrder } = useMutation(
    async ({ action, isPAPOrder, isInternalOrder }) => await OrderService.submitOrder(orderId, isPAPOrder, isInternalOrder),
    {
      onSuccess: (result, { action }) => {
        const beautifiedOrderDetails = normalizeOrderResponse(result);
        setValue('orderDetails', beautifiedOrderDetails);
        if (action === BUTTON_ACTIONS.SUBMIT) {
          navigate(`${RoutePaths.pathOrderManagement}/${orderId}/status`, { state: { ...locationState } });
        } else {
          navigate(`${RoutePaths.pathOrderManagement}/${orderId}/status`, {
            state: { ...locationState, isApproved: true }
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
      },
      retry: false
    }
  );

  const { isLoading: isResubmitting, mutate: reSubmitOrder } = useMutation(
    async (draftChanges) => {
      if (isCustomerCentreUser) {
        await OrderService.reSubmitOrderCsUser(orderId, draftChanges, orgId);
      } else {
        await OrderService.reSubmitOrder(orderId, draftChanges);
      }
    },
    {
      onSuccess: (_result) => {
        setValue('orcaPatient', null);
        setValue('isVerified', false);
        navigate(`${isCustomerCentreUser ? RoutePaths.pathCSUserOrder : RoutePaths.pathOrderManagement}`, {
          state: { ...locationState, isApproved: true, alert: { type: 'success', description: 'Order has been Resubmitted Successfully.' } }
        });
      },
      onError: (error) => {
        const statusCode = error?.response?.status;
        let description = t('error.default');
        if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

        setAlert({
          description,
          type: 'error'
        });
      },
      retry: false
    }
  );

  const [agreeCheckboxOptions, setAgreeCheckboxOptions] = React.useState({
    isDisabled: false,
    isChecked: false,
    label: t('messages.orderPlacementAcknowledgement'),
    value: false
  });

  const [papOrderOptions, setPapOrderOptions] = React.useState({
    isDisabled: false,
    isChecked: isPapOrder,
    label: t('messages.papOrderPlacementAcknowledgement'),
    value: false
  });

  const [spRemainInInspiroLink, setSpRemainInInspiroLink] = React.useState({
    isDisabled: false,
    isChecked: false,
    label: t('messages.orderPlacementAcknowledgementSPInspiroLink'),
    value: false
  });

  const handleChange = () => {
    setOrderAgreementCheckboxError(null);
    setAgreeCheckboxOptions({
      ...agreeCheckboxOptions,
      isChecked: !agreeCheckboxOptions.isChecked
    });
  };

  const handlePapOrderSelectionChange = () => {
    setPapOrderOptions({
      ...papOrderOptions,
      isChecked: !papOrderOptions.isChecked
    });
  };
  const handleSpInspiroLinkChange = () => {
    setSpRemainInInspiroLink({
      ...spRemainInInspiroLink,
      isChecked: !spRemainInInspiroLink.isChecked
    });
  };

  const handleOnBackButtonClick = () => {
    setValue('orcaPatient', null);
    setValue('isVerified', false);
    const prevSearch = locationState.__prevSearch || '';
    navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
  };

  const isImpersonatedAdmin = () => {
    const impersonatedByUser = AuthUtils.getImpersonatedByUser();
    if (impersonatedByUser && (impersonatedByUser.role?.name === SYSTEM_ADMIN || impersonatedByUser.role?.name === CUSTOMER_CENTRE)) {
      return true;
    }
    return false;
  };

  const isImpersonatedCSAdmin = () => {
    const impersonatedByUser = AuthUtils.getImpersonatedByUser();
    if (impersonatedByUser && impersonatedByUser.role?.name === CUSTOMER_CENTRE) {
      return true;
    }
    return false;
  };

  const handleOnSubmit = () => {
    if (status === ORDER_STATUS.REVIEW && AuthUtils.isPhysician()) {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/review`, { state: { ...locationState } });
    } else {
      if (!agreeCheckboxOptions.isChecked) {
        setOrderAgreementCheckboxError('Please acknowledge to submit order');
        return;
      }
      if (agreeCheckboxOptions.isChecked) {
        if (!isSpOrder && isImpersonatedAdmin()) {
          submitOrder({
            action: BUTTON_ACTIONS.SUBMIT,
            isPAPOrder: papOrderOptions.isChecked
          });
        } else {
          submitOrder({ action: BUTTON_ACTIONS.SUBMIT, isInternalOrder: spRemainInInspiroLink.isChecked });
        }
      }
    }
  };

  const removeKeyFromPayload = (obj, keyToRemove) => {
    if (Array.isArray(obj)) {
      return obj.map((item) => removeKeyFromPayload(item, keyToRemove));
    } else if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([key]) => key !== keyToRemove)
          .map(([key, value]) => [key, removeKeyFromPayload(value, keyToRemove)])
      );
    }
    return obj;
  };

  const handleOnReSubmit = () => {
    if (AuthUtils.isSystemAdminView()) {
      const finalPayload = removeKeyFromPayload(draftChanges, 'medicalRecordNumber');
      reSubmitOrder(finalPayload);
    } else {
      reSubmitOrder(draftChanges);
    }
  };

  const handleApprove = () => {
    submitOrder({ action: BUTTON_ACTIONS.APPROVE });
  };

  const handleReject = () => {
    if (!agreeCheckboxOptions.isChecked) {
      setOrderAgreementCheckboxError('Please acknowledge to reject order');
      return;
    }
    setIsCommentPanelOpen(true);
  };

  const handleOnApprove = () => {
    if (!agreeCheckboxOptions.isChecked) {
      setOrderAgreementCheckboxError('Please acknowledge to approve order');
      return;
    }

    if (agreeCheckboxOptions.isChecked) {
      renderModal({
        title: t('messages.header.confirmation'),
        bodyContent: (
          <div className="MCP-modal-body">
            <p>{t('messages.confirmation.approve')}</p>
          </div>
        ),
        footerActions: {
          cancel: {
            label: t('label.no')
          },
          confirm: {
            label: t('label.yes'),
            action: () => {
              handleApprove();
            }
          }
        }
      });
    }
  };

  const handleOnBackToOrders = () => {
    if (backToInvoiceListing || backToInvoiceDetails) {
      setValue('orcaPatient', null);
      setValue('isVerified', false);
      navigate(-1);
    } else {
      if (!isDirty || isCustomerCentreUser) {
        setValue('orcaPatient', null);
        setValue('isVerified', false);
        const prevSearch = locationState?.__prevSearch || '';
        navigate(`${isCustomerCentreUser ? RoutePaths.pathCSUserOrder : RoutePaths.pathOrderManagement}${prevSearch}`);
      } else {
        handleOnDiscardChanges('back');
      }
    }
  };

  const handleOnDiscardChanges = (action) => {
    const state = {};
    state.title = `${t(t('messages.confirmation.discardheader'))}`;
    state.body = (
      <div className="MCP-modal-body">
        <p>{t('message.discardChangesConfirmation')}</p>
      </div>
    );
    state.footer = (
      <div className="controls">
        <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
          {t('button.caption.cancel')}
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            dispatch(hasUnsavedChanges(false));
            if (action === 'back') {
              dispatch(closeModal());
              const prevSearch = locationState?.__prevSearch || '';
              navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
            } else {
              dispatch(closeModal());
              setValue('orcaPatient', null);
              setValue('isVerified', false);
              if (manufacturer === MANUFACTURER.ORCA) {
                setDraftChanges({
                  additionalDetailsRequestDTO: { ...orderDetails.additionalDetails },
                  patientIdentifier: orderDetails.patient?.patientIdentifier,
                  medicalRecordNumber: orderDetails.patient?.medicalRecordNumber,
                  manufacturerOrderId: orderDetails.patient?.manufacturerOrderId,
                  coiId: orderDetails.patient?.coiId,
                  patientDTO: { patient: { ...patient } }
                });
              } else {
                setDraftChanges({
                  additionalDetailsRequestDTO: { ...orderDetails.additionalDetails },
                  patientIdentifier: orderDetails.patient?.patientIdentifier,
                  medicalRecordNumber: orderDetails.patient?.medicalRecordNumber,
                  coiId: orderDetails.patient?.coiId,
                  patientDTO: null
                });
              }
            }
          }}>
          {t('button.caption.confirm')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };
  const stripPrefixSuffixFromData = (data, config) => {
    const newData = { ...data };
    config.forEach(({ fieldName, properties }) => {
      const value = data[fieldName];
      if (value === undefined || value === null) return;
      const validationFormat = properties?.fieldFormat?.validationFormat;
      if ((typeof value === 'string' && validationFormat && validationFormat.includes('prefix')) || validationFormat.includes('suffix')) {
        let updatedValue = value;
        const prefixMatch = validationFormat.match(/prefix\('([^']+)'\)/);
        if (prefixMatch && updatedValue.startsWith(prefixMatch[1])) {
          updatedValue = updatedValue.slice(prefixMatch[1].length);
        }
        const suffixMatch = validationFormat.match(/suffix\('([^']+)'\)/);
        if (suffixMatch && updatedValue.endsWith(suffixMatch[1])) {
          updatedValue = updatedValue.slice(0, -suffixMatch[1].length);
        }
        newData[fieldName] = updatedValue;
      }
    });
    return newData;
  };

  const addPrefixSuffixToData = (data, config) => {
    const newData = { ...data };
    config.forEach(({ fieldName, properties }) => {
      const value = data[fieldName];

      if (value === undefined || value === null || value === '') return;
      const validationFormat = properties?.fieldFormat?.validationFormat;
      if (typeof value === 'string' && validationFormat && (validationFormat.includes('prefix') || validationFormat.includes('suffix'))) {
        let updatedValue = value;
        const prefixMatch = validationFormat.match(/prefix\('([^']+)'\)/);
        if (prefixMatch && !updatedValue.startsWith(prefixMatch[1])) {
          updatedValue = `${prefixMatch[1]}${updatedValue}`;
        }
        const suffixMatch = validationFormat.match(/suffix\('([^']+)'\)/);
        if (suffixMatch && !updatedValue.endsWith(suffixMatch[1])) {
          updatedValue = `${updatedValue}${suffixMatch[1]}`;
        }

        newData[fieldName] = updatedValue;
      }
    });
    return newData;
  };
  const getDisplayNameByFieldName = (fieldName) => {
    const materialConfig = isSpOrder ? orderDetails.spTherapyConfig?.config?.fields : orderDetails.therapyConfig?.config?.fields;
    return materialConfig?.find((field) => field.fieldName === fieldName)?.properties?.displayName || '';
  };
  const { mutate: patientIdCoiIdValidation, isLoading: patientIdCoiIdValidationLoading } = useMutation(
    async ({ patientId, coiId }) => {
      const res = await OrderService.regeneronCoiIdVerification(patientId, coiId);
      return res.data;
    },
    {
      onSuccess: (res, variables) => {
        if (res) {
          if (variables.patientId && variables.coiId) {
            setAlert({
              description: t('orderManagement.coiId.verificationSuccess', {
                patientID: getDisplayNameByFieldName('patientIdentifier'),
                coiId: getDisplayNameByFieldName('coiId')
              }),
              type: 'success'
            });
            setAllowedSubmission(true);
          } else {
            setAlert({
              description: t('orderManagement.patientID.verificationSuccess', {
                patientID: getDisplayNameByFieldName('patientIdentifier')
              }),
              type: 'success'
            });
            setAllowedSubmission(false);
          }
        } else {
          if (variables.patientId && variables.coiId) {
            setAlert({
              description: t('orderManagement.patientID.CoiId.verificationFailedSubmitPage', {
                patientID: getDisplayNameByFieldName('patientIdentifier'),
                coiId: getDisplayNameByFieldName('coiId')
              }),
              type: 'error'
            });
            setAllowedSubmission(false);
          } else {
            setAlert({
              description: t('orderManagement.patientID.verificationFailedSubmitPage', {
                patientID: getDisplayNameByFieldName('patientIdentifier'),
                coiId: getDisplayNameByFieldName('coiId')
              }),
              type: 'error'
            });
            setAllowedSubmission(false);
          }
        }
      },
      onError: () => {
        setAlert({
          type: 'error',
          description: t('errors.default')
        });
      }
    }
  );

  const handleOnEditSection = (stage) => {
    if (
      (isSubmitted || isCSReview) &&
      !isCustomerCentreUser &&
      stage === ORDER_STAGES.PATIENT_DETAILS &&
      orderDetails.therapyConfig?.config?.manufacturerName === 'ORCA'
    ) {
      navigate(`../verification/orca${isCustomerCentreUser ? `?orgId=${orgId}` : ''}`);
    }
    if (isSubmitted || isCSReview) {
      if (![ORDER_STAGES.ADDITIONAL_DETAILS, ORDER_STAGES.PATIENT_DETAILS].includes(stage)) return;
      if (!isCustomerCentreUser && !checkEditPermission(stage)) {
        setAlert({
          description: t('labels.summaryEditMessage'),
          type: 'error'
        });
        return;
      }

      let formConfig = getUpdateFormConfig(stage, therapyConfig, spTherapyConfig, orderDetails.channelType, isCustomerCentreUser, manufacturer);
      let initialValues = {};
      let validationSchema = null;
      if (stage === ORDER_STAGES.ADDITIONAL_DETAILS) {
        validationSchema = additionalDetailsValidationSchema(t, therapyConfig);
        if (CommonUtils.isNonEmptyObject(draftChanges?.additionalDetailsRequestDTO)) {
          initialValues = {
            ...stripPrefixSuffixFromData(draftChanges.additionalDetailsRequestDTO, therapyConfig.config.fields)
          };
        } else {
          initialValues = {
            coiId: additionalDetails.coiId || '',
            dateOfAdministration: additionalDetails.dateOfAdministration || '',
            poNumber: additionalDetails.poNumber || '',
            shipToPONumber: additionalDetails.shipToPONumber || '',
            dateOfApheresis: additionalDetails.dateOfApheresis || '',
            timeOfApheresis: additionalDetails.timeOfApheresis || '',
            timeOfAdministration: additionalDetails.timeOfAdministration || ''
          };
        }
      } else if (stage === ORDER_STAGES.PATIENT_DETAILS) {
        if (orderDetails.channelType === CHANNEL_TYPE.BUY_AND_BILL) {
          initialValues = {
            ...stripPrefixSuffixFromData(draftChanges, therapyConfig.config.fields)
          };
          validationSchema = patientDetailsValidationSchema(t, therapyConfig, orderDetails.channelType, isCustomerCentreUser.valueOf, manufacturer);
        } else {
          initialValues = {
            ...stripPrefixSuffixFromData(draftChanges, spTherapyConfig.config.fields)
          };
          validationSchema = patientDetailsValidationSchema(t, spTherapyConfig, orderDetails.channelType);
        }
      }
      setDrawerElement(
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            let tempValue = addPrefixSuffixToData(values, isSpOrder ? spTherapyConfig.config.fields : therapyConfig.config.fields);
            if (stage === ORDER_STAGES.ADDITIONAL_DETAILS) {
              setDraftChanges((prev) => ({
                ...prev,
                additionalDetailsRequestDTO: tempValue
              }));
            } else {
              isSpOrder
                ? setDraftChanges((prev) => ({
                    ...prev,
                    ...tempValue
                  }))
                : AuthUtils.isSystemAdminView()
                ? setDraftChanges((prev) => ({
                    ...prev,
                    ...tempValue,
                    patientDTO: {
                      ...tempValue.patientDTO,
                      patient: {
                        ...tempValue.patientDTO?.patient,
                        manufacturerOrderId: tempValue.manufacturerOrderId
                      }
                    }
                  }))
                : setDraftChanges((prev) => ({
                    ...prev,
                    ...tempValue
                  }));
            }
            if (!isCustomerCentreUser) {
              if (manufacturer === 'REGENERON' && stage === ORDER_STAGES.PATIENT_DETAILS && tempValue.patientIdentifier) {
                patientIdCoiIdValidation({
                  patientId: tempValue.patientIdentifier,
                  coiId: !isSpOrder ? draftChanges.additionalDetailsRequestDTO.coiId || '' : tempValue?.coiId || ''
                });
                scrollToTopUtil();
              } else if (manufacturer === 'REGENERON' && stage === ORDER_STAGES.ADDITIONAL_DETAILS && tempValue.coiId) {
                if (draftChanges.patientIdentifier) {
                  patientIdCoiIdValidation({
                    patientId: draftChanges.patientIdentifier,
                    coiId: tempValue.coiId
                  });
                  scrollToTopUtil();
                } else {
                  setAlert({
                    description: t('orderManagement.CoiId.verificationFailedSubmitPage', {
                      patientId: getDisplayNameByFieldName('patientIdentifier'),
                      coiId: getDisplayNameByFieldName('coiId')
                    }),
                    type: 'error'
                  });
                  setAllowedSubmission(false);
                  scrollToTopUtil();
                }
              } else {
                setAllowedSubmission(true);
              }
            } else {
              setAllowedSubmission(true);
            }
            setDrawerElement(null);
          }}>
          {({ dirty, values }) => {
            React.useEffect(() => {
              setIsDirty(dirty);
              dispatch(hasUnsavedChanges(dirty));
            }, [dirty, values]);
            return (
              <Form>
                <FloatingDrawer
                  open={true}
                  anchor="right"
                  onClose={() => setDrawerElement(null)}
                  heading={stage === ORDER_STAGES.ADDITIONAL_DETAILS ? 'Additional Details' : 'Patient Details'}
                  controls={
                    <div className="controls">
                      <Button
                        label={t('captions.btnCancel')}
                        onClick={() => setDrawerElement(null)}
                        variant="secondary"
                        size="md"
                        aria-label={t('captions.cancel')}
                      />
                      <Button
                        label={t('captions.btnSaveChanges')}
                        type="submit"
                        variant="primary"
                        size="md"
                        aria-label={t('captions.selectAccount')}
                        disabled={!dirty}
                      />
                    </div>
                  }>
                  <FormRenderer sections={formConfig} />
                </FloatingDrawer>
              </Form>
            );
          }}
        </Formik>
      );
    } else {
      if (isPapOrder) {
        console.log('This is a No Cost Therapy Order, Hence can not be edited.');
        showEditAlert(t('prompt.title.alert'), t('prompt.message.editRestriction'), t('label.ok'));
        return;
      }
      const basePath = RoutePaths.pathOrderManagement;
      const stageRoutes = {
        [ORDER_STAGES.THERAPY_SELECTION]: `${basePath}/edit/${orderId}`,
        [ORDER_STAGES.ACCOUNT_DETAILS]: `${basePath}/create/${orderId}/account-details`,
        [ORDER_STAGES.PATIENT_DETAILS]: `${basePath}/create/${orderId}/patient-details`,
        [ORDER_STAGES.PAYER_DETAILS]: `${basePath}/create/${orderId}/payer-details`,
        [ORDER_STAGES.ADDITIONAL_DETAILS]: `${basePath}/create/${orderId}/additional-details`
      };

      const route = stageRoutes[stage] || basePath;
      navigate(route, {
        state: { ...locationState, isEdit: true }
      });
      return;
    }
  };

  React.useEffect(() => {
    const { alert, ...rest } = location.state || {};
    if (alert) {
      setAlert({ ...alert });
      navigate(location.pathname, { ...rest });
    }
  }, [location]);

  const handleAfterRejectOrder = (data) => {
    setIsCommentPanelOpen(false);
    navigate(0, { state: { ...locationState } });
  };

  const handleOnCancelOrder = () => {
    setIsCancelOrderPanelOpen(true);
  };

  const cancelOrder = () => {
    setIsCancellingOrder(true);
    OrderService.cancelOrder(orderId, orderDetails.practiceId, cancelOrderReason)
      .then((response) => {
        const beautifiedOrderDetails = normalizeOrderResponse(result);
        setValue('orderDetails', beautifiedOrderDetails);
        // refreshOrderDetails();
        setAlert({
          type: 'success',
          description: 'Your order has been successfully cancelled.'
        });
      })
      .catch((error) => {
        setAlert({
          type: 'error',
          description: 'Something went wrong. Please try again.'
        });
      })
      .finally(() => {
        setCancelOrderReason(null);
        setIsCancelOrderConfirmationOpen(false);
        setIsCancellingOrder(false);
      });
  };

  const getAllowedControls = () => {
    const controls = [];
    const draftChangesInitialValue =
      manufacturer === MANUFACTURER.ORCA
        ? {
            additionalDetailsRequestDTO: { ...orderDetails.additionalDetails },
            patientIdentifier: orderDetails.patient?.patientIdentifier,
            medicalRecordNumber: orderDetails.patient?.medicalRecordNumber,
            manufacturerOrderId: orderDetails.patient?.manufacturerOrderId,
            coiId: orderDetails.patient?.coiId,
            patientDTO: { patient: { ...patient } }
          }
        : {
            additionalDetailsRequestDTO: { ...orderDetails.additionalDetails },
            patientIdentifier: orderDetails.patient?.patientIdentifier,
            medicalRecordNumber: orderDetails.patient?.medicalRecordNumber,
            coiId: orderDetails.patient?.coiId,
            patientDTO: null
          };

    const isOrderChanged = !CommonUtils.deepEqual(draftChanges, draftChangesInitialValue);
    const controlPrintSummary = (
      <Button size={'md'} variant="secondary" onClick={() => printPage()}>
        {t('captions.btnPrintSummary')}
      </Button>
    );

    const controlCancel = (
      <Button size={'md'} disabled={isSaving} variant="secondary" onClick={handleOnBackButtonClick}>
        {t('captions.btnCancel')}
      </Button>
    );

    const controlCancelOrder = (
      <Button size={'md'} disabled={isSaving} variant="secondary" onClick={handleOnCancelOrder}>
        Cancel Order
      </Button>
    );

    const controlDiscardChanges = (
      <Button size={'md'} disabled={isSaving || !isOrderChanged} variant="secondary" onClick={handleOnDiscardChanges}>
        {t('captions.btnDiscardChanges')}
      </Button>
    );

    const controlBack = (
      <Button size={'md'} disabled={isSaving} variant="secondary" onClick={handleOnBackButtonClick}>
        {t('captions.btnBack')}
      </Button>
    );

    const controlSubmitOrder = (
      <PermittedComponent permissions={[PERMISSIONS_ENUM.CREATE_NEW_ORDER.SUBMIT_ORDER]}>
        <Button
          variant="primary"
          isLoadingState={isSaving}
          Icon={isSaving && ButtonLoadingIcon}
          iconPosition="left"
          onClick={handleOnSubmit}
          disabled={isSaving}
          size="md">
          {isSaving ? 'Saving' : t(isSpOrder ? 'captions.btnSubmitPrescription' : 'captions.btnSubmitOrder')}
        </Button>
      </PermittedComponent>
    );

    const controlReSubmitOrder = isCustomerCentreUser ? (
      <Button
        variant="primary"
        isLoadingState={isResubmitting}
        Icon={isResubmitting && ButtonLoadingIcon}
        iconPosition="left"
        onClick={handleOnReSubmit}
        disabled={isResubmitting || !allowedSubmission || !isOrderChanged}
        size="md">
        {isResubmitting ? 'Submitting' : t('captions.btnSubmitOrder')}
      </Button>
    ) : (
      <PermittedComponent permissions={[PERMISSIONS_ENUM.CREATE_NEW_ORDER.SUBMIT_ORDER]}>
        <Button size="md" disabled={isResubmitting || !isOrderChanged || !allowedSubmission} variant="primary" type="submit" onClick={handleOnReSubmit}>
          {t('captions.btnSubmitOrder')}
        </Button>
      </PermittedComponent>
    );

    const controlRejectOrder = (
      <PermittedComponent permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.REJECT_ORDER]}>
        <Button size={'md'} variant="secondary" type="submit" onClick={handleReject}>
          {t(isSpOrder ? 'captions.btnRejectPrescription' : 'captions.btnRejectOrder')}
        </Button>
      </PermittedComponent>
    );

    const controlApproveOrder = (
      <PermittedComponent permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.APPROVE_ORDERS]}>
        <Button size={'md'} variant="primary" type="submit" onClick={handleOnApprove}>
          {t('captions.btnApproveOrder')}
        </Button>
      </PermittedComponent>
    );

    const controlFinalizeOrder = (
      <PermittedComponent permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.REVIEW_ORDER]}>
        <Button size={'md'} variant="primary" type="submit" onClick={handleOnSubmit}>
          {t('captions.btnFinalizePrescription')}
        </Button>
      </PermittedComponent>
    );
    if ([ORDER_STATUS.REJECTED, ORDER_STATUS.DELETED, ORDER_STATUS.CANCELLED].includes(status) || (isSpOrder && status === ORDER_STATUS.SUBMITTED)) {
      controls.push(controlPrintSummary);
    } else if (status === ORDER_STATUS.REVIEW && isPhysician) {
      controls.push(controlPrintSummary, controlFinalizeOrder);
    } else if (
      !isApprover &&
      status !== ORDER_STATUS.SUBMITTED &&
      status !== ORDER_STATUS.CS_REVIEW &&
      status !== ORDER_STATUS.APPROVAL_PENDING &&
      status !== ORDER_STATUS.REVIEW
    ) {
      controls.push(controlPrintSummary, controlCancel, controlSubmitOrder);
    } else if (isCustomerCentreUser || isCSReview || isSubmitted) {
      controls.push(controlDiscardChanges);
      if (!isApprover && isCSReview) {
        controls.push(controlCancelOrder);
      }
      controls.push(controlPrintSummary, controlReSubmitOrder);
    } else if (isApprover) {
      controls.push(controlBack, controlRejectOrder, controlApproveOrder);
    } else if (
      (allowUpdateBnBAfterSubmit && isPhysician) ||
      (CommonUtils.isNonEmptyObject(draftChanges) && isApprover && (isCustomerCentreUser || !isSpOrder))
    ) {
      controls.push(controlDiscardChanges, controlPrintSummary, controlReSubmitOrder);
    }

    return controls;
  };

  if (patient.patientInfo) patient.fullName = CommonUtils.getUSFullName(patient.patientInfo);
  const showControls = React.useMemo(() => {
    if (isRejected || isDeleted || status === ORDER_STATUS.CANCELLED) return false;
    else if (isSubmitted || isCSReview || status === ORDER_STATUS.REVIEW) return false;
    // else if (isSpOrder && isSubmitted) return false;
    else if (sapStatus === SAP_ORDER_STATUS.COMPLETED) return false;
    else if (status === ORDER_STATUS.APPROVAL_PENDING && !orderDetails.approver) return false;
    else if (status === ORDER_STATUS.APPROVAL_PENDING && orderDetails.approver && !isApprover) return false;
    else if (status === ORDER_STATUS.APPROVAL_PENDING && isApprover && orderDetails.approver) {
      return true;
    }
    return true;
  }, [isRejected, isDeleted, isSubmitted, isCSReview, isApprover, status, sapStatus, orderDetails]);
  const allowUpdateBnBAfterSubmit =
    orderDetails.channelType === CHANNEL_TYPE.BUY_AND_BILL && (isSubmitted || isCSReview) && sapStatus === SAP_ORDER_STATUS.OPEN;
  let variantAttachment = null,
    configuredQuestionnaires = [];

  if (additionalDetails.variantDetails?.variantDocumentPath) {
    try {
      variantAttachment = JSON.parse(additionalDetails.variantDetails.variantDocumentPath);
    } catch (error) {}
  }

  if (additionalDetails.configuredQuestionnaires && additionalDetails.configuredQuestionnaires.length > 0) {
    additionalDetails.configuredQuestionnaires.forEach((template) => {
      const { sectionsDetails = [] } = template;
      if (CommonUtils.isNonEmptyArray(sectionsDetails)) {
        sectionsDetails.forEach((section) => {
          const { questions = [] } = section;
          if (CommonUtils.isNonEmptyArray(questions)) {
            questions.forEach((question) => {
              if (question.value) {
                const details = {
                  text: question.text.en,
                  value: question.value
                };
                if (question.document) {
                  details.attachment = {
                    name: question.document.name,
                    size: question.document.size,
                    url: question.document.url
                  };
                }
                configuredQuestionnaires.push(details);
              }
            });
          }
        });
      }
    });
  }

  const askForPapOrder = Boolean(!isSpOrder && isImpersonatedAdmin() && !['APPROVAL_PENDING', 'SUBMITTED'].includes(status));
  const askForSpRemainInInspiroLink = Boolean(isSpOrder && isImpersonatedCSAdmin());
  const primaryPolicyHolderName = CommonUtils.getUSFullName({
    firstName: payerDetails?.primaryMedicalInsurance?.policyHolderFirstName,
    lastName: payerDetails?.primaryMedicalInsurance?.policyHolderLastName
  });
  const secondaryPolicyHolderName = CommonUtils.getUSFullName({
    firstName: payerDetails?.secondaryMedicalInsurance?.policyHolderFirstName,
    lastName: payerDetails?.secondaryMedicalInsurance?.policyHolderLastName
  });

  const showPapBadge = isPapOrder && (
    <span className={styles.pap}>
      <Badge customStyle={{ color: '#005483', backgroundColor: '#F2F6FA' }} text={t('label.noCostTherapy')} />
    </span>
  );

  const getDiagnosisCodesDisplayLabel = (diagnosisCodeString) => {
    try {
      const diagnosisCode = JSON.parse(diagnosisCodeString);
      return diagnosisCode.map((item) => `${item.code} ${item.description}`).join(', ');
    } catch (error) {
      return '-';
    }
  };
  const isPhysician = AuthUtils.isPhysician();

  const backTextKey = backToInvoiceListing
    ? 'orderManagement.backToInvoiceDetails'
    : backToInvoiceDetails
    ? 'paymentInvoices.Details.backToInvoiceDetails'
    : isPhysician
    ? 'captions.btnBackToPrescriptions'
    : 'captions.btnBackToManageOrder';

  const unitAmount = CommonUtils.formatNumberWithoutSymbol(papOrderOptions.isChecked ? 0 : catalog.netPrice);
  const netAmount = CommonUtils.formatNumberWithoutSymbol(papOrderOptions.isChecked ? 0 : orderDetails.totalNetPrice);
  const taxAmount = CommonUtils.formatNumberWithoutSymbol(papOrderOptions.isChecked ? 0 : orderDetails.taxAmount);
  const totalCost = CommonUtils.formatNumberWithoutSymbol(papOrderOptions.isChecked ? 0 : orderCost);

  return (
    <div className="MCP-module-wrapper order-summary-container">
      {patientIdCoiIdValidationLoading && <Loader type={'screen'} />}

      {!isError && (
        <React.Fragment>
          <div>
            <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
              {t(backTextKey)}
            </Button>
          </div>
          <ModuleHeader
            heading={
              <React.Fragment>
                {isApprover && (
                  <div className={styles.pageHeadingReview}>
                    <PageHeader heading={t('headings.reviewOrder')} />
                    {showPapBadge}
                  </div>
                )}

                {!isApprover && orderDetails?.status === ORDER_STATUS.IN_DRAFT && (
                  <PageHeader
                    heading={
                      orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
                        ? t('headings.createNewPrescriptionSummary')
                        : t('headings.createNewOrderSummary')
                    }
                  />
                )}
                {!isApprover &&
                (isPhysician || isSubmitted || isApprovalPending || isRejected || orderDetails?.status === ORDER_STATUS.REVIEW || isDeleted || isCSReview) ? (
                  <Heading className={styles.orderSummaryHeading} as="h2">
                    <span>{t(isSpOrder ? 'headings.prescriptionSummary' : 'labels.summary')}</span>
                    {showPapBadge}
                  </Heading>
                ) : null}
              </React.Fragment>
            }
            className={!isApprover ? styles.orderSummary : undefined}
            controls={
              <div className={styles['order-header-options']}>
                {isRejected && (
                  <div className="row-space-between-center">
                    <Badge text={t(`labels.status.${status.toLowerCase()}`)} type="error" />
                    <Button size="md" variant="tertiary" onClick={() => setIsCommentPanelOpen(true)}>
                      {t('captions.btnViewComments')}
                    </Button>
                  </div>
                )}
                {status === ORDER_STATUS.CANCELLED && (
                  <div className="row-space-between-center">
                    <Badge text={'Cancelled'} type="error" />
                    <Button size="md" variant="tertiary" onClick={() => setIsCancelOrderPanelOpen(true)}>
                      See Cancelled Reason
                    </Button>
                  </div>
                )}

                {isSubmitted && !isCSReview && !isSpOrder && (
                  <div className="row-space-between-center">
                    <Label className={styles.lblProcessing}>{t('labels.OrderProcesing')}</Label>

                    {isLoadingSapOrderStatus ? (
                      <InventoryIndicator status="CHECKING" />
                    ) : sapOrderDetails?.finalStatus ? (
                      (() => {
                        const finalStatus = sapOrderDetails.finalStatus.toLowerCase();
                        const statusMap = {
                          [SAP_ORDER_STATUS.OPEN.toLowerCase()]: {
                            text: t('labels.OrderProcesing.SAPOrderStatus.Open'),
                            type: 'info'
                          },
                          [SAP_ORDER_STATUS.CANCELLED.toLowerCase()]: {
                            text: t('labels.OrderProcesing.SAPOrderStatus.Cancelled'),
                            type: 'error'
                          },
                          [SAP_ORDER_STATUS.COMPLETED.toLowerCase()]: {
                            text: t('labels.OrderProcesing.SAPOrderStatus.Completed'),
                            type: 'success'
                          }
                        };

                        const badgeProps = statusMap[finalStatus];

                        return badgeProps ? <Badge text={badgeProps.text} type={badgeProps.type} /> : null;
                      })()
                    ) : (
                      <div className={styles.orderProcessing}>
                        <InventoryIndicator status="OUT_OF_STOCK" />
                        <div className="styled-icon-button">
                          <Button variant="tertiary" size="lg" onClick={handleRetrySAPOrderStatus}>
                            {t('captions.btnRetry')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {orderDetails?.collaborators && (
                  <Collaborator
                    currentStage={orderDetails?.currentStage}
                    collaborators={orderDetails?.collaborators}
                    orderId={orderId}
                    channelType={orderDetails.channelType}
                    showControls={false}
                    isCustomerCentreUser={isCustomerCentreUser}
                  />
                )}
                {orderDetails?.therapy?.manufacturerName && <ManufacturerLogo therapyId={orderDetails.therapy?.id} />}
              </div>
            }
          />
        </React.Fragment>
      )}

      <div className="MCP-module-body" ref={contentRef}>
        {!isError && (
          <React.Fragment>
            {showControls && status && ![ORDER_STATUS.CANCELLED, ORDER_STATUS.REJECTED].includes(status) && (
              <div className="order-stepper-wrapper">
                <OrderStepper
                  status={orderDetails?.currentStage}
                  patientDetailsRequired={orderDetails?.patientDetailsRequired}
                  channelType={orderDetails.channelType}
                />
              </div>
            )}
          </React.Fragment>
        )}
        {readOnly && status === ORDER_STATUS.IN_DRAFT && (
          <NotifyAlert stage={ORDER_STAGES.ORDER_SUMMARY} OnEdit={false} orderId={orderId} setAlert={setAlert} />
        )}
        {isCustomerCentreUser && status === ORDER_STATUS.CS_REVIEW && (
          <Alert
            type="info"
            description="Please review and update the order details to proceed with submission. Follow work instructions if needed."
            showCloseIcon={false}
          />
        )}
        {alert && <Alert className="alert-container-print" {...alert} onClose={() => setAlert(null)} />}
        {notifications?.length > 0 && (
          <div className="alert-container-print">
            <div className="MCP-module-body">
              {notifications.map((item, index) => (
                <Alert key={`${item.id}`} description={item.description} onClose={() => removeNotification(item.id)} type={item.type} />
              ))}
            </div>
          </div>
        )}

        {!isError && (
          <React.Fragment>
            <div className={'MCP-module-wrapper'}>
              <div className={'MCP-module-body'}>
                {isSubmitted && <TrackingDetails orderDetails={orderDetails} />}

                {(isSubmitted || isCSReview || status === ORDER_STATUS.APPROVAL_PENDING) &&
                  ((isSpOrder && (submittedBy?.name || orderDetails?.submittedOn)) ||
                    (!isSpOrder && (orderDetails?.approver || orderDetails?.submittedOn))) && (
                    <div className="MCP-CardContainer">
                      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-4">
                        {isSpOrder || !orderDetails?.approver ? (
                          <>
                            <DetailSegment label={t('labels.SubmittedBy')} value={submittedBy?.name || '-'} />
                            <DetailSegment
                              label={t('labels.SubmittedOn')}
                              value={orderDetails?.submittedOn ? dayjs.utc(orderDetails.submittedOn).tz(dayjs.tz.guess()).format('MM/DD/YYYY') : '-'}
                            />
                          </>
                        ) : (
                          <>
                            {orderDetails?.approver && <DetailSegment label={t('labels.Approver_Name')} value={orderDetails.approver.name || '-'} />}
                            {orderDetails?.submittedOn && (
                              <DetailSegment
                                label={t('labels.Approval_Date_and_Time')}
                                value={dayjs.utc(orderDetails.submittedOn).tz(dayjs.tz.guess()).format('MM/DD/YYYY')}
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                <div className="MCP-CardContainer">
                  <ModuleHeader
                    className={styles.panelHeader}
                    heading={<Heading as="h3">{t(isSpOrder ? 'labels.orderDetails' : 'labels.priceDetails')}</Heading>}
                  />
                  <div
                    className={`grid grid-gap-16 grid-cols-1 md:grid-cols-1 ${
                      isSubmitted || isCSReview
                        ? !isSpOrder
                          ? 'lg:grid-cols-6 xl:grid-cols-6'
                          : 'lg:grid-cols-2 xl:grid-cols-2'
                        : 'lg:grid-cols-5 xl:grid-cols-5'
                    }`}>
                    {(orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ||
                      ((isSubmitted || isCSReview) && orderDetails.channelType === CHANNEL_TYPE.BUY_AND_BILL)) && (
                      <DetailSegment
                        label={t('labels.orderId')}
                        value={orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? id : backendOrderId || orderDetails.id}
                      />
                    )}
                    <DetailSegment
                      label={t('labels.therapy')}
                      noTooltip={true}
                      value={
                        <div className={styles.materialDescription}>
                          <div className="overflowing">
                            <Tooltip body={therapy?.tradeName}>
                              <Link
                                className="MCP-table-link"
                                aria-label={t('labels.therapyDescription')}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleOpenDetails(therapy);
                                }}>
                                {therapy?.tradeName}
                              </Link>
                            </Tooltip>
                          </div>
                          {!isSpOrder && inventoryStatus && (
                            <Tooltip isDisabled={!inventoryStatus} body={t(`tooltip.material.status.${inventoryStatus}`)}>
                              <span>
                                <InventoryIndicator status={inventoryStatus} />
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      }
                    />
                    {!isSpOrder && (
                      <>
                        <div className="price-wrapper">
                          <DetailSegment
                            label={t('labels.unitAmount')}
                            value={
                              <span className="dollarSign ">
                                {isSimulationLoading ? (
                                  '-'
                                ) : (
                                  <>
                                    <span>$</span>
                                    {unitAmount}
                                  </>
                                )}
                              </span>
                            }
                          />
                        </div>
                        <div className="price-wrapper">
                          <DetailSegment
                            label={t('labels.netAmount')}
                            value={
                              <span className="dollarSign ">
                                {isSimulationLoading ? (
                                  '-'
                                ) : (
                                  <>
                                    <span>$</span>
                                    {netAmount}
                                  </>
                                )}
                              </span>
                            }
                          />
                        </div>
                        <div className="price-wrapper">
                          <DetailSegment
                            label={t('labels.taxAmount')}
                            value={
                              <span className="dollarSign ">
                                {isSimulationLoading ? (
                                  '-'
                                ) : (
                                  <>
                                    <span>$</span>
                                    {taxAmount}
                                  </>
                                )}
                              </span>
                            }
                          />
                        </div>
                        <div className="price-wrapper">
                          <DetailSegment
                            label={t('labels.totalAmount')}
                            value={
                              <span className="dollarSign ">
                                {isSimulationLoading ? (
                                  '-'
                                ) : (
                                  <>
                                    <span>$</span>
                                    {totalCost}
                                  </>
                                )}
                              </span>
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div
                  className={`equal-height-grid grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1'
                  }`}>
                  <div className="MCP-module-body">
                    <div className="MCP-CardContainer">
                      <ModuleHeader
                        className={styles.panelHeader}
                        heading={<Heading as="h3">{t('labels.therapy')}</Heading>}
                        controls={
                          showControls && (
                            <Button
                              size="md"
                              variant="tertiary"
                              onClick={() => handleOnEditSection(ORDER_STAGES.THERAPY_SELECTION)}
                              Icon={() => <IconEditField />}>
                              {t('captions.btnEdit')}
                            </Button>
                          )
                        }
                      />
                      <div className={` grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5`}>
                        <DetailSegment label={t('labels.genericName')} value={therapy.genericName || '-'} />
                        <DetailSegment label={t('labels.manufacturer')} value={therapy.manufacturerName || '-'} />
                        <DetailSegment label={t('labels.productForm')} value={!isSpOrder ? therapy.productForm || '-' : '-'} />
                        <DetailSegment label={t('labels.Dosage')} value={`${therapy.strength || ''} ${therapy.dosage || ''}`.trim() || '-'} />
                        <DetailSegment label={t('labels.nationalDrugCode')} value={therapy.ndcNumber || '-'} />
                      </div>
                    </div>
                  </div>
                  <div className="MCP-module-body">
                    <div className="MCP-CardContainer">
                      <ModuleHeader
                        className={styles.panelHeader}
                        heading={<Heading as="h3">{t('labels.accountDetails')}</Heading>}
                        controls={
                          showControls && (
                            <Button
                              size="md"
                              variant="tertiary"
                              onClick={() => handleOnEditSection(ORDER_STAGES.ACCOUNT_DETAILS)}
                              Icon={() => <IconEditField />}>
                              {t('captions.btnEdit')}
                            </Button>
                          )
                        }
                      />
                      <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3`}>
                        <DetailSegment
                          label={t('labels.soldToAccountAddress')}
                          value={CommonUtils.getDetailedAddress(accountDetails?.soldToAccount?.address)}
                        />
                        <DetailSegment label={t('labels.soldToAccountName')} value={accountDetails?.soldToAccount?.accountName} />
                        <DetailSegment
                          label={t('labels.shipToAccountAddress')}
                          value={CommonUtils.getDetailedAddress(accountDetails?.shipToAccount?.address)}
                        />
                        <DetailSegment label={t('labels.shipToAccountName')} value={accountDetails?.shipToAccount?.accountName} />
                        <DetailSegment
                          label={t(isSpOrder ? 'labels.prescriptionChannel' : 'labels.orderChannel')}
                          value={t(`labels.${accountDetails?.soldToAccount?.channelType}`)}
                        />
                        {!isSpOrder && <DetailSegment label={t('labels.program')} value={CGAT_IDENTIFIER[accountDetails?.soldToAccount?.cgatIdentifier]} />}
                      </div>
                    </div>
                  </div>
                </div>

                {(patientDetailsRequired || orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) && (
                  <div className="MCP-CardContainer">
                    <ModuleHeader
                      className={styles.panelHeader}
                      heading={<Heading as="h3">{t('labels.patientDetails')}</Heading>}
                      controls={
                        (showControls || allowUpdateBnBAfterSubmit) && (
                          <Button
                            size="md"
                            variant="tertiary"
                            disabled={
                              (isSubmitted || isCSReview) &&
                              !(therapyConfig?.config?.fields ?? []).some(
                                (field) => ['patientIdentifier', 'medicalRecordNumber'].includes(field?.fieldName) && field?.properties?.displayOnForm === true
                              )
                            }
                            onClick={() => handleOnEditSection(ORDER_STAGES.PATIENT_DETAILS)}
                            Icon={() => <IconEditField />}>
                            {t('captions.btnEdit')}
                          </Button>
                        )
                      }
                    />
                    <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 ${isSpOrder ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
                      {!isSpOrder &&
                        therapyConfig?.config?.fields
                          ?.filter((field) => field?.properties?.displayOnForm && ['patientIdentifier'].includes(field.fieldName))
                          ?.map((field) => {
                            return <DetailSegment key={field.fieldName} label={field.properties.displayName} value={draftChanges?.[field.fieldName] || '-'} />;
                          })}
                      <DetailSegment
                        label={t('labels.patientName')}
                        value={
                          (!isImpersonatedAdminWithPhiPermission && patient?.patientInfo?.firstName === '******') || isCustomerCentreUser ? (
                            patient?.patientInfo?.firstName
                          ) : patient.fullName || patientData?.patientInfo?.firstName ? (
                            <Tooltip body={CommonUtils.getUSFullName(patientData?.patientInfo)}>
                              <span className="overflowing">{CommonUtils.getUSFullName(patientData?.patientInfo)}</span>
                            </Tooltip>
                          ) : (
                            '-'
                          )
                        }
                      />
                      <DetailSegment
                        label={t('labels.DOB')}
                        value={
                          !isSpOrder && (!isImpersonatedAdminWithPhiPermission || isCustomerCentreUser)
                            ? '******'
                            : patientData?.patientInfo?.dateOfBirth || '-'
                        }
                      />
                      {isSpOrder && (
                        <DetailSegment
                          label={t('labels.emailId')}
                          value={
                            patient?.contact?.emailId ? (
                              <Tooltip body={patient.contact.emailId}>
                                <span className="overflowing">{patient.contact.emailId}</span>
                              </Tooltip>
                            ) : (
                              '-'
                            )
                          }
                        />
                      )}
                      <DetailSegment
                        label={t('labels.gender')}
                        value={
                          !isSpOrder && (!isImpersonatedAdminWithPhiPermission || isCustomerCentreUser) ? '******' : patientData?.patientInfo?.gender || '-'
                        }
                      />
                      {!isSpOrder &&
                        therapyConfig?.config?.fields
                          ?.filter((field) => field?.properties?.displayOnForm && ['medicalRecordNumber'].includes(field.fieldName))
                          ?.map((field) => {
                            return <DetailSegment key={field.fieldName} label={field.properties.displayName} value={draftChanges?.[field.fieldName] || '-'} />;
                          })}
                      {!isSpOrder && isCustomerCentreUser && manufacturer === MANUFACTURER.ORCA && (
                        <DetailSegment label={'Orca Therapy Id'} value={draftChanges?.manufacturerOrderId || '-'} />
                      )}
                    </div>
                  </div>
                )}

                {shouldShowIdentifierSection && (
                  <div className="MCP-CardContainer">
                    <ModuleHeader
                      className={styles.panelHeader}
                      heading={<Heading as="h3">{t('orderManagement.patientDetails.identifier_details')}</Heading>}
                      controls={
                        (showControls || isCSReview) && (
                          <Button size="md" variant="tertiary" onClick={() => handleOnEditSection(ORDER_STAGES.PATIENT_DETAILS)} Icon={() => <IconEditField />}>
                            {t('captions.btnEdit')}
                          </Button>
                        )
                      }
                    />
                    <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                      {spTherapyConfig?.config?.fields
                        ?.filter((field) => field?.properties?.displayOnForm && ['medicalRecordNumber', 'patientIdentifier', 'coiId'].includes(field.fieldName))
                        ?.map((field) => {
                          const value = draftChanges?.[field.fieldName] || '-';
                          return <DetailSegment key={field.fieldName} label={field.properties.displayName} value={value} />;
                        })}
                    </div>
                  </div>
                )}
                {orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && (
                  <>
                    {provider && <ProviderDetailsSegment provider={provider} showControls={showControls} onEdit={handleOnEditSection} />}
                    {payerDetails && <PayerDetailsSegment payerDetails={payerDetails} showControls={showControls} onEdit={handleOnEditSection} />}
                  </>
                )}

                <div className="MCP-CardContainer">
                  <ModuleHeader
                    className={styles.panelHeader}
                    heading={<Heading as="h3">{t('labels.additionalDetails')}</Heading>}
                    controls={
                      (showControls || allowUpdateBnBAfterSubmit || (isCSReview && !isSpOrder)) && (
                        <Button
                          size="md"
                          variant="tertiary"
                          disabled={
                            (isSubmitted || isCSReview) &&
                            !isSpOrder &&
                            !(therapyConfig?.config?.fields ?? []).some(
                              (field) =>
                                [
                                  'coiId',
                                  'poNumber',
                                  'shipToPONumber',
                                  'dateOfAdministration',
                                  'dateOfApheresis',
                                  'timeOfApheresis',
                                  'timeOfAdministration'
                                ].includes(field?.fieldName) && field?.properties?.displayOnForm === true
                            )
                          }
                          onClick={() => handleOnEditSection(ORDER_STAGES.ADDITIONAL_DETAILS)}
                          Icon={() => <IconEditField />}>
                          {t('captions.btnEdit')}
                        </Button>
                      )
                    }
                  />
                  <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3`}>
                    {!isSpOrder && (
                      <>
                        {therapyConfig?.config?.fields
                          ?.filter((field) => field?.properties?.displayOnForm && !['medicalRecordNumber', 'patientIdentifier'].includes(field.fieldName))
                          ?.map((field) => {
                            const value = draftChanges?.additionalDetailsRequestDTO?.[field.fieldName] ?? draftChanges?.patient?.[field.fieldName] ?? '-';

                            return <DetailSegment key={field.fieldName} label={field.properties.displayName} value={value || '-'} />;
                          })}

                        {additionalDetails?.orderQuantity && (
                          <DetailSegment label={t('labels.orderQuantity')} value={String(additionalDetails.orderQuantity) || '-'} />
                        )}
                        {additionalDetails?.slotNumber && <DetailSegment label={t('labels.slotNo')} value={additionalDetails.slotNumber} />}
                      </>
                    )}

                    {isSpOrder && (
                      <>
                        {additionalDetails?.orderQuantity && (
                          <DetailSegment label={t('labels.orderQuantity')} value={String(additionalDetails.orderQuantity) || '-'} />
                        )}
                        <DetailSegment label={t('label.diagnosisCode')} value={getDiagnosisCodesDisplayLabel(additionalDetails?.diagnosisCode)} />
                        {additionalDetails?.clinicalDetails?.hasAllergies && (
                          <DetailSegment label={t('label.allergies')} value={additionalDetails.clinicalDetails.allergiesSpecification || '-'} />
                        )}
                      </>
                    )}
                  </div>
                </div>
                {therapyConfig?.config?.secondLegShipInfoRequired && (
                  <div className="MCP-module-body">
                    <div className="MCP-CardContainer">
                      <ModuleHeader
                        className={styles.panelHeader}
                        heading={<Heading as="h3">{t('label.secondLegShipmentInfo')}</Heading>}
                        controls={
                          showControls && (
                            <Button
                              size="md"
                              variant="tertiary"
                              onClick={() => handleOnEditSection(ORDER_STAGES.ADDITIONAL_DETAILS)}
                              Icon={() => <IconEditField />}>
                              {t('captions.btnEdit')}
                            </Button>
                          )
                        }
                      />
                      <div className={` grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3`}>
                        <DetailSegment label={t('label.uniqueTransactionID')} value={additionalDetails?.secondLegShipInfo?.transactionId || '-'} />
                        <DetailSegment label={t('label.name')} value={additionalDetails?.secondLegShipInfo?.name || '-'} />
                        <DetailSegment label={t('label.address')} value={CommonUtils.getAddress(additionalDetails?.secondLegShipInfo?.address) || '-'} />
                      </div>
                    </div>
                  </div>
                )}

                {spTherapyConfig?.isPrescriptionDetailsRequired && (
                  <div className="MCP-CardContainer">
                    <ModuleHeader
                      className={styles.panelHeader}
                      heading={<Heading as="h3">{t('labels.prescriptionDetails')}</Heading>}
                      controls={
                        showControls && (
                          <Button
                            size="md"
                            variant="tertiary"
                            onClick={() => handleOnEditSection(ORDER_STAGES.ADDITIONAL_DETAILS)}
                            Icon={() => <IconEditField />}>
                            {t('captions.btnEdit')}
                          </Button>
                        )
                      }
                    />
                    <div className="MCP-module-body">
                      <div className={'grid grid-gap-16 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4'}>
                        <DetailSegment label={t('label.drugName')} value={therapy?.materialDescription} />
                        <DetailSegment label={t('labels.therapy.strength')} value={therapy?.strength} />
                        <DetailSegment label={t('label.quantity')} value={spTherapyConfig?.quantity} />
                        <DetailSegment label={t('label.daysSupply')} value={spTherapyConfig?.daysSupply} />
                        <DetailSegment label={t('label.refill')} value={spTherapyConfig?.refills} />
                        <DetailSegment label={t('label.instructions')} value={spTherapyConfig?.instructions} />
                      </div>
                    </div>
                  </div>
                )}

                {additionalDetails.variantDetails && (
                  <div className="MCP-CardContainer">
                    <ModuleHeader
                      className={styles.panelHeader}
                      heading={<Heading as="h3">{t('labels.variant')}</Heading>}
                      controls={
                        showControls && (
                          <Button
                            size="md"
                            variant="tertiary"
                            onClick={() => handleOnEditSection(ORDER_STAGES.ADDITIONAL_DETAILS)}
                            Icon={() => <IconEditField />}>
                            {t('captions.btnEdit')}
                          </Button>
                        )
                      }
                    />
                    <div className="MCP-module-body">
                      <div className={'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'}>
                        <DetailSegment label={'Variant'} value={additionalDetails?.variantDetails?.variant} />
                        {variantAttachment && (
                          <AttachmentCard
                            url={variantAttachment.url}
                            fileName={variantAttachment.name}
                            fileSize={variantAttachment.size}
                            isCustomerCentreUser={isCustomerCentreUser}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {additionalDetails.configuredQuestionnaires?.length > 0 && (
                  <>
                    {additionalDetails.configuredQuestionnaires.map((template) => {
                      const validSections = template.sectionsDetails.filter(
                        (section) =>
                          Array.isArray(section.questions) &&
                          section.questions.some((questions) => questions.value && (Array.isArray(questions.value) ? questions.value.length > 0 : true))
                      );

                      return validSections.map((section) => {
                        const validQuestions = section.questions.filter(
                          (question) => question.value && (Array.isArray(question.value) ? question.value.length > 0 : true)
                        );

                        return (
                          <div className="MCP-CardContainer" key={`${template.templateId}-${section.sectionName}`}>
                            <ModuleHeader
                              className={styles.panelHeader}
                              heading={<Heading as="h3">{section.sectionName}</Heading>}
                              controls={
                                showControls && (
                                  <Button
                                    size="md"
                                    variant="tertiary"
                                    onClick={() => handleOnEditSection(ORDER_STAGES.ADDITIONAL_DETAILS)}
                                    Icon={IconEditField}>
                                    {t('captions.btnEdit')}
                                  </Button>
                                )
                              }
                            />

                            <div className="MCP-module-body">
                              <div className="summary-question-list">
                                {validQuestions.map((question) => (
                                  <div
                                    className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
                                    key={`${section.sectionName}-${question.text.en}`}>
                                    <DetailSegment
                                      label={question.text.en}
                                      value={
                                        Array.isArray(question.value) ? (
                                          <div>
                                            {question.value.map((val, i) => (
                                              <div key={i}>{val.replace(/_/g, ' ')}</div>
                                            ))}
                                          </div>
                                        ) : (
                                          question.value ?? '-'
                                        )
                                      }
                                    />

                                    {question.document && (
                                      <AttachmentCard
                                        url={question.document.url}
                                        fileName={question.document.name}
                                        fileSize={question.document.size}
                                        isCustomerCentreUser={isCustomerCentreUser}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })}
                  </>
                )}

                {additionalDetails.additionalDocuments && additionalDetails.additionalDocuments?.length > 0 && (
                  <div className="MCP-CardContainer">
                    <ModuleHeader className={styles.panelHeader} heading={<Heading as="h3">{t('labels.additionalDocuments')}</Heading>} />
                    <div className="MCP-module-body">
                      <div className="summary-question-list">
                        {additionalDetails.additionalDocuments?.map((documentSegment) => {
                          return (
                            <div className={'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'}>
                              <div className="MCP-module-body">
                                {documentSegment.comment && <DetailSegment maxLength={60} label={'Comment'} value={documentSegment.comment} />}
                                <div>
                                  <DetailSegment direction="row" label={'Uploaded by:'} value={documentSegment.uploadedBy} />
                                  <DetailSegment
                                    direction="row"
                                    label={'Uploaded on:'}
                                    value={
                                      documentSegment.uploadedDate
                                        ? dayjs.utc(documentSegment.uploadedDate).tz(dayjs.tz.guess()).format('MM/DD/YYYY, HH:mm')
                                        : '-'
                                    }
                                  />
                                </div>
                              </div>
                              {documentSegment.name && documentSegment.url && (
                                <AttachmentCard
                                  url={documentSegment?.url}
                                  fileName={documentSegment.name}
                                  fileSize={documentSegment.size}
                                  isCustomerCentreUser={isCustomerCentreUser}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {showControls && !readOnly && (
                <div className="MCP-module-body agreement-checkbox-control">
                  <CheckboxGroup
                    id={'default'}
                    name="order-agreement"
                    error={Boolean(orderAgreementCheckboxError)}
                    errorMessage={orderAgreementCheckboxError}
                    items={[
                      {
                        ...agreeCheckboxOptions,
                        onChange: () => handleChange()
                      }
                    ]}
                    size="md"
                  />
                  {askForSpRemainInInspiroLink && (
                    <div>
                      <CheckboxGroup
                        id={'sp-remain-in-inspiro-link'}
                        name="sp-remain-in-inspiro-link"
                        items={[
                          {
                            ...spRemainInInspiroLink,
                            onChange: () => handleSpInspiroLinkChange()
                          }
                        ]}
                        size="md"
                      />
                    </div>
                  )}
                  {askForPapOrder && (
                    <div className={styles['pap-order-selection-control']}>
                      <CheckboxGroup
                        id={'pap-order'}
                        name="pap-order"
                        items={[
                          {
                            ...papOrderOptions,
                            onChange: () => handlePapOrderSelectionChange()
                          }
                        ]}
                        size="md"
                      />
                      <InfoModel title={t('messages.papOrderPlacementAcknowledgement')}>
                        <div className="MCP-modal-body">{t('order.no.cost.therapy.info')}</div>
                      </InfoModel>
                    </div>
                  )}
                </div>
              )}

              <div className="footer-wrapper" ref={controlRef}>
                <div className="controls footer-controls">{getAllowedControls()}</div>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
      {!isError && isCommentPanelOpen && (
        <CommentPanel
          readOnly={isRejected}
          meta={{ orderId, rejectionDetails, isSpOrder }}
          onSuccess={handleAfterRejectOrder}
          onClose={() => setIsCommentPanelOpen(false)}
          openDrawer={isCommentPanelOpen}
        />
      )}

      {isCancelOrderPanelOpen && (
        <CancelOrderPanel
          readOnly={status === ORDER_STATUS.CANCELLED}
          meta={{ orderId, rejectionDetails: orderDetails.cancellationDetails, isSpOrder }}
          onSuccess={(reason) => {
            setIsCancelOrderPanelOpen(false);
            setIsCancelOrderConfirmationOpen(true);
            setCancelOrderReason(reason);
          }}
          onClose={() => {
            setIsCancelOrderPanelOpen(false);
          }}
          openDrawer={isCancelOrderPanelOpen}
        />
      )}

      {isCancelOrderConfirmationOpen && (
        <Modal
          id="cancel-order-confirmation-modal"
          isOpen={isCancelOrderConfirmationOpen}
          onClose={() => setIsCancelOrderConfirmationOpen(false)}
          modalTitle={'Cancel Order'}
          modalBody={
            <div className="MCP-modal-body">
              <p>Are you sure you want to cancel this order?</p>
            </div>
          }
          modalFooter={
            <div className="controls">
              <Button size="md" variant="secondary" onClick={() => setIsCancelOrderConfirmationOpen(false)}>
                No
              </Button>
              <Button
                variant="primary"
                onClick={cancelOrder}
                isLoadingState={isSaving}
                Icon={isSaving && ButtonLoadingIcon}
                iconPosition="left"
                type="submit"
                size="md">
                {isCancellingOrder ? 'Cancelling' : 'Yes'}
              </Button>
            </div>
          }
          modalSize="md"
        />
      )}

      {drawerElement}

      {!isError && openDetails && (
        <TherapyDetailsWithTabs
          trade={therapy?.tradeName}
          channelType={therapy?.channelType}
          therapy={therapy.id || therapy?.tradeName}
          heading={t('labels.therapyDetails')}
          showFooter={false}
          onClose={() => setOpenDetails(!openDetails)}
          hideTab={true}
          isCustomerCentreUser={isCustomerCentreUser}
          createdById={orderDetails?.createdBy?.id}
        />
      )}
    </div>
  );
};

export default withPermissions(Summary, ORDER_STAGES.ORDER_SUMMARY);
