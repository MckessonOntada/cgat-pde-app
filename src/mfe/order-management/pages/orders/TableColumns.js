import EclipsesTextCss from '@src/components/EclipsesText/EclipsesTextcss';
import { COLUMNS, ORDER_ENTITY_ACTION, ORDER_STATUS, ORDER_TABS, TABLE_COLUMNS } from './config';
import CommonUtils from '@src/util/CommonUtils';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Badge, Tooltip, MenuList } from '@mckesson/mcp-component-library';
import React from 'react';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';
import useAlert from '@src/hooks/useAlert';
import { useOrders } from '../../context/OrderContext';
import usePermission from '@src/hooks/usePermissions';
import OrderService from '@src/api/commonService/OrderService';
import { handleApiError } from '@src/util/ApiUtils';
import { renderModal } from '@src/util/ModalUtil';
import AuthUtils from '@src/util/AuthUtils';
import { useMutation } from 'react-query';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { FormattedNumber } from 'react-intl';
import { CHANNEL_TYPE, ORDER_STAGES } from '../create/form-segments/Constants';

const getColorByStatus = (status) => {
  const statusColors = {
    [ORDER_STATUS.IN_DRAFT]: 'info',
    [ORDER_STATUS.APPROVAL_PENDING]: 'info',
    [ORDER_STATUS.SUBMITTED]: 'success',
    [ORDER_STATUS.DELETED]: 'error',
    [ORDER_STATUS.REJECTED]: 'error'
  };
  return statusColors[status] || 'info';
};

function getOptionsByStatus(props) {
  const { t: translate } = useTranslate();
  const { id, status } = props || {};
  const { tab, alertContainerId } = this.__meta__;
  const navigate = useNavigate();
  const loggedInUserId = AuthUtils.getUserId();
  const { showAlert } = useAlert();
  const { refreshData, assignedGroupsData, orderView } = useOrders();
  const { hasPermission, hasAnyPermission } = usePermission();
  const { search } = useLocation();
  const hasEditPermission = hasAnyPermission([
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.THERAPY_SELECTION,
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.ACCOUNT_SELECTION,
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.UPDATE_PATIENTS_DETAILS,
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.UPDATE_ADDITIONAL_DETAILS,
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.SUBMIT_ORDER
  ]);
  // Mutations
  const { mutate: assignToMe } = useMutation(({ preservedState }) => OrderService.setOrderAssignToMe(id), {
    onSuccess: (_, variables) => navigate(`${id}/summary`, { state: { isApprover: true, ...variables.preservedState } }),
    onError: (err) =>
      showAlert({
        description: t(handleApiError(err)),
        type: 'error',
        anchorEl: alertContainerId
      })
  });

  const { mutate: unassignFromMe } = useMutation(({ preservedState }) => OrderService.setOrderUnassignToMe(id), {
    onSuccess: (_, variables) => {
      refreshData();
      showAlert({
        description: translate('messages.success.release'),
        type: 'success',
        anchorEl: alertContainerId
      });
    },
    onError: (err) =>
      showAlert({
        description: translate(handleApiError(err)),
        type: 'error',
        anchorEl: alertContainerId
      })
  });

  const { mutate: deleteOrder } = useMutation(({ preservedState }) => OrderService.deleteOrder(id), {
    onSuccess: (_, variables) => {
      refreshData();
      showAlert({
        description: translate('messages.success.delete'),
        type: 'success',
        anchorEl: alertContainerId
      });
    },
    onError: (err) =>
      showAlert({
        description: translate(handleApiError(err)),
        type: 'error',
        anchorEl: alertContainerId
      })
  });

  const { mutate: discardVersion } = useMutation(({ orderId, preservedState }) => OrderService.discardCurrentOrderVersion(orderId), {
    onSuccess: (_, variables) => {
      refreshData();
      showAlert({
        description: translate('message.success.discardVersionChanges'),
        type: 'success',
        anchorEl: alertContainerId
      });
    },
    onError: (err) =>
      showAlert({
        description: translate(handleApiError(err)),
        type: 'error',
        anchorEl: alertContainerId
      })
  });

  const handleOnOptionSelection = (value) => {
    const preservedState = { __prevSearch: search };
    switch (value) {
      case ORDER_ENTITY_ACTION.VIEW:
        navigate(`${id}/summary`, {
          state: props.status === ORDER_STATUS.SUBMITTED ? { ...preservedState, isEdit: true } : preservedState
        });
        break;
      case ORDER_ENTITY_ACTION.RESUME:
        navigate(
          {
            pathname: getPathByOrderStage(props)
          },
          {
            state: props.status === ORDER_STATUS.SUBMITTED ? { ...preservedState, isEdit: true } : { ...preservedState, isSimulate: true }
          }
        );
        break;
      case ORDER_ENTITY_ACTION.DELETE:
        renderModal({
          title: translate('labels.confirmation'),
          bodyContent: <h3>{translate('labels.orderActions.deletemessage')}</h3>,
          footerActions: {
            cancel: { label: translate('label.no') },
            confirm: {
              label: translate('label.yes'),
              action: () => deleteOrder({ preservedState })
            }
          }
        });
        break;
      case ORDER_ENTITY_ACTION.CANCEL:
        renderModal({
          title: translate('labels.information'),
          bodyContent: <h3>{translate('labels.orderActions.cancelmessage')}</h3>,
          footerActions: {
            cancel: { label: translate('labels.orderActions.OK') }
          }
        });
        break;
      case ORDER_ENTITY_ACTION.EDIT:
        if (tab === ORDER_TABS.SUBMITTED_BUY_AND_BILL) {
          navigate(`${id}/summary`, {
            state: props.status === ORDER_STATUS.SUBMITTED ? { ...preservedState, isEdit: true } : preservedState
          });
        } else {
          renderModal({
            title: translate('labels.information'),
            bodyContent: <h3>{translate('labels.orderActions.cancelmessage')}</h3>,
            footerActions: {
              cancel: { label: translate('labels.orderActions.OK') }
            }
          });
        }
        break;
      case ORDER_ENTITY_ACTION.REVIEW:
        navigate(`${id}/summary`, {
          state: {
            isEdit: props.approver?.id === loggedInUserId,
            isApprover: props.approver?.id === loggedInUserId,
            __prevSearch: search
          }
        });
        break;
      case ORDER_ENTITY_ACTION.ASSIGN:
        if (props.approver?.id) {
          showAlert({
            description: 'The order is currently in review by another user. Please try again after some time',
            type: 'error',
            anchorEl: alertContainerId
          });
        } else {
          assignToMe({ preservedState });
        }
        break;
      case ORDER_ENTITY_ACTION.UNASSIGN:
        unassignFromMe({ preservedState });
        break;
      case ORDER_ENTITY_ACTION.DISCARD_MY_CHANGES:
        discardVersion({ orderId: props.id, preservedState });
        break;
      case ORDER_ENTITY_ACTION.UPLOAD_DOCUMENT: {
        navigate(`${props.id}/upload-document?`, {
          state: { __prevSearch: search }
        });
        break;
      }
      default:
        break;
    }
  };

  const doesApproverGroupExist = (approverGroupIds, assignedGroups) => {
    return approverGroupIds?.some((id) => assignedGroups?.includes(id)) ?? false;
  };

  let options = [];
  if (tab === ORDER_TABS.PENDING_SUBMISSION) {
    if (status === ORDER_STATUS.IN_DRAFT && hasEditPermission) {
      options.push({
        label: translate(`labels.orderActions.resume`),
        value: ORDER_ENTITY_ACTION.RESUME
      });
      if (hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.DISCARD_ORDER)) {
        options.push({
          label: translate(`labels.orderActions.discard`),
          value: ORDER_ENTITY_ACTION.DELETE
        });
      }
    } else if (status === ORDER_STATUS.REJECTED) {
      options.push({
        label: translate(`labels.orderActions.view`),
        value: ORDER_ENTITY_ACTION.REVIEW
      });
    } else if (status === ORDER_STATUS.DELETED) {
      options.push({
        label: translate(`labels.orderActions.view`),
        value: ORDER_ENTITY_ACTION.VIEW
      });
    }
  } else if (status === ORDER_STATUS.APPROVAL_PENDING) {
    if (!props.approver?.id && doesApproverGroupExist(props.approverGroupIds, assignedGroupsData)) {
      options.push({
        label: translate(`labels.orderActions.assignToMe`),
        value: ORDER_ENTITY_ACTION.ASSIGN
      });
    } else if (props.approver?.id === loggedInUserId) {
      options.push({
        label: translate(`labels.orderActions.unassignToMe`),
        value: ORDER_ENTITY_ACTION.UNASSIGN
      });
      if (props.versionOwner) {
        options.push({
          label: translate(`labels.orderActions.discardChangesByMe`),
          value: ORDER_ENTITY_ACTION.DISCARD_MY_CHANGES
        });
      }
    }
    options.push({
      label: translate(
        `labels.orderActions.${
          options.length && options.at(-1).value === ORDER_ENTITY_ACTION.UNASSIGN
            ? ORDER_ENTITY_ACTION.REVIEW.toLowerCase()
            : ORDER_ENTITY_ACTION.VIEW.toLowerCase()
        }`
      ),
      value: ORDER_ENTITY_ACTION.REVIEW
    });
  } else if (tab === ORDER_TABS.SUBMITTED_BUY_AND_BILL || tab === ORDER_TABS.SUBMITTED_SP) {
    if (hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.VIEW_ORDERS)) {
      options.push({
        label: translate(`labels.orderActions.view`),
        value: ORDER_ENTITY_ACTION.VIEW
      });
    }
    if (hasEditPermission) {
      options.push({
        label: translate(`labels.orderActions.edit`),
        value: ORDER_ENTITY_ACTION.EDIT
      });
    }
    if (hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.CANCEL_ORDER)) {
      options.push({
        label: translate(`labels.orderActions.cancel`),
        value: ORDER_ENTITY_ACTION.CANCEL
      });
    }
    if (status === ORDER_STATUS.SUBMITTED && hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.UPLOAD_ORDER_DOCUMENTS)) {
      options.push({
        label: translate(`labels.orderActions.uploadDocument`),
        value: ORDER_ENTITY_ACTION.UPLOAD_DOCUMENT
      });
    }
  }

  return (
    <MenuList menuIcon={<IconEllipsis key={'menu-list-order-table'} />} handleSelect={handleOnOptionSelection} options={options} aria-label="Order options" />
  );
}

const getPathByOrderStage = ({ currentStage, id, patientDetailsRequired }) => {
  switch (currentStage) {
    case ORDER_STAGES.ACCOUNT_DETAILS:
      return `${id}/accounts`;
    case ORDER_STAGES.PATIENT_DETAILS:
      return patientDetailsRequired ? `${id}/patient` : `${id}/additional-details`;
    case ORDER_STAGES.PAYER_DETAILS:
      return `${id}/payer`;
    case ORDER_STAGES.ADDITIONAL_DETAILS:
      return `${id}/additional-details`;
    case ORDER_STAGES.ORDER_SUMMARY:
      return `${id}/summary`;
    default:
      return `${id}/accounts`;
  }
};

const getState = (props) => {
  const { status, approver } = props;
  const { search } = useLocation();
  if (!status) throw new Error('Order status not found, to get state.');

  const loggedInUserId = AuthUtils.getUserId();
  let state = {};

  if (status === ORDER_STATUS.SUBMITTED) {
    state = { ...props };
  } else if (status === ORDER_STATUS.APPROVAL_PENDING) {
    if (approver?.id === loggedInUserId) {
      state = { isEdit: true, isApprover: true, props };
    } else {
      state = { isApprover: false, props };
    }
  } else if (status === ORDER_STATUS.IN_DRAFT) {
    state = { isSimulate: true, props };
  } else {
    state = { ...props };
  }
  return { ...state, __prevSearch: search };
};

const jsxColumns = () => [
  {
    id: COLUMNS.SAP_ID,
    name: 'labels.orderId',
    selector: () => {},
    sortable: true,
    sortKey: 'backend_order_id',
    minWidth: '130px',
    cell: function (props) {
      return (
        <Link className="MCP-table-link" to={getPathByOrderStage(props)} state={getState(props)}>
          <EclipsesTextCss str={props.backendOrderId} maxWidth={170} />
        </Link>
      );
    }
  },
  {
    id: COLUMNS.ORDER_ID,
    name: 'labels.orderView.internalOrderId',
    selector: () => {},
    sortable: true,
    sortKey: 'id',
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    minWidth: '140px',
    cell: (props) => {
      const state = getState(props);
      return (
        <Link className="MCP-table-link" to={getPathByOrderStage(props)} state={state}>
          <Tooltip body={props.id}>{props.id}</Tooltip>
        </Link>
      );
    }
  },
  {
    id: COLUMNS.PRESCRIPTION_ID,
    name: 'labels.orderView.prescriptionId',
    selector: () => {},
    sortable: true,
    sortKey: 'id',
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    minWidth: '140px',
    cell: (props) => {
      const state = getState(props);
      return (
        <Link className="MCP-table-link" to={getPathByOrderStage(props)} state={state}>
          <Tooltip body={props.id}>{props.id}</Tooltip>
        </Link>
      );
    }
  },
  {
    id: COLUMNS.ORDER_ID_SP,
    name: 'labels.orderId',
    selector: () => {},
    sortable: true,
    sortKey: 'id',
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    minWidth: '140px',
    cell: (props) => {
      const state = getState(props);
      return (
        <Link className="MCP-table-link" to={getPathByOrderStage(props)} state={state}>
          <Tooltip body={props.id}>{props.id}</Tooltip>
        </Link>
      );
    }
  },
  {
    id: COLUMNS.PATIENT_NAME,
    name: 'labels.patientName',
    selector: () => {},
    sortable: true,
    sortKey: 'patient_details.patient_info.first_name',
    cell: function (props) {
      const patientInfo = props.patient && props.patient.patientInfo;
      if (!patientInfo) return 'N/A';
      return <EclipsesTextCss str={CommonUtils.getFullName(patientInfo)} maxWidth={130} />;
    }
  },
  {
    id: COLUMNS.THERAPY,
    name: 'labels.therapy',
    selector: () => {},
    sortable: true,
    sortKey: 'therapy.therapy_description',
    minWidth: '250px',
    maxWidth: '300px',
    showInMobileHeader: true,
    cardHeader: true,
    cell: function (props) {
      return <EclipsesTextCss str={props.therapy?.materialDescription} maxWidth={280} className={'MCP-table-cell'} />;
    }
  },
  {
    id: COLUMNS.AUTHOR,
    name: 'table.columns.captions.createdBy',
    selector: () => {},
    sortable: true,
    sortKey: 'createdBy.name',
    maxWidth: '150px',
    minWidth: '130px',
    cell: (props) => <Tooltip body={props.createdBy?.userName}>{props.createdBy?.userName}</Tooltip>
  },
  {
    id: COLUMNS.ASSIGNEE,
    name: 'table.columns.captions.assignee',
    selector: () => {},
    sortable: true,
    sortKey: 'approver.name',
    maxWidth: '130px',
    cell: (props) => <EclipsesTextcss tooltip={props.approver?.name} str={props.approver?.name} maxWidth={180} className={'MCP-table-cell'} />
  },
  {
    id: COLUMNS.CREATED_ON,
    name: 'table.columns.captions.createdDate',
    selector: () => {},
    sortable: true,
    sortKey: 'createdAt',
    width: '140px',
    cell: function (props) {
      return <span>{CommonUtils.convertDateStringFormat(props.updatedAt || props.createdAt, 'MM/DD/YYYY')}</span>;
    }
  },
  {
    id: COLUMNS.SUBMITTED_BY,
    name: 'table.columns.captions.submittedBy',
    selector: () => {},
    sortable: true,
    sortKey: 'submittedBy.name',
    maxWidth: '155px',
    cell: function (props) {
      return <EclipsesTextCss tooltip={props.submittedBy?.userName} str={props.submittedBy?.name} maxWidth={130} className={'MCP-table-cell'} />;
    }
  },
  {
    id: COLUMNS.SUBMITTED_ON,
    name: 'table.columns.captions.submittedOn',
    selector: () => {},
    sortable: true,
    sortKey: 'submittedOn',
    width: '155px',
    cell: function (props) {
      return <span>{props.submittedOn ? CommonUtils.convertDateStringFormat(props.submittedOn, 'MM/DD/YYYY') : '-'}</span>;
    }
  },
  {
    id: COLUMNS.UPDATED_BY,
    name: 'table.columns.captions.submittedBy',
    selector: () => {},
    sortable: true,
    maxWidth: '155px',
    sortKey: 'updatedBy.name',
    cell: function (props) {
      return <EclipsesTextCss tooltip={props.updatedBy?.name} str={props.updatedBy?.name} maxWidth={130} className={'MCP-table-cell'} />;
    }
  },
  {
    id: COLUMNS.UPDATED_ON,
    name: 'table.columns.captions.submittedOn',
    selector: () => {},
    sortable: true,
    width: '155px',
    sortKey: 'updatedAt',
    cell: function (props) {
      return <span>{props.updatedAt ? CommonUtils.convertDateStringFormat(props.updatedAt, 'MM/DD/YYYY') : '-'}</span>;
    }
  },
  {
    id: COLUMNS.STATUS,
    name: 'table.columns.captions.status',
    selector: () => {},
    sortable: false,
    maxWidth: '140px',
    center: true,
    showInMobileHeader: true,
    cardStatus: true,
    cell: function (props) {
      return (
        <Tooltip body={props.status}>
          <span>
            <Badge text={this.__meta__.translate(`labels.caption.${props.status.toUpperCase()}`)} type={getColorByStatus(props.status)} />
          </span>
        </Tooltip>
      );
    }
  },
  {
    id: COLUMNS.PRICE,
    name: 'table.columns.captions.price',
    selector: () => {},
    sortable: false,
    right: true,
    selector: 'orderCost',
    minWidth: '120px',
    cell: function (props) {
      const { paporder, therapy, tradeDetails, orderCost } = props;
      let displayOrderCost = '',
        channelType = therapy?.channelType || tradeDetails?.channelType;
      if (channelType === CHANNEL_TYPE.BUY_AND_BILL && paporder === true) {
        displayOrderCost = 0;
      } else if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
        displayOrderCost = orderCost;
      }
      return (
        <div className="cellEllipse align-items-right">
          {displayOrderCost >= 0 ? <FormattedNumber value={displayOrderCost} style="currency" currency="USD" /> : ''}
        </div>
      );
    }
  },
  {
    id: COLUMNS.ACTION,
    name: 'table.columns.captions.actions',
    selector: () => {},
    sortable: false,
    showInMobileHeader: true,
    width: '100px',
    isAction: true,
    isContextMenu: true,
    cell: getOptionsByStatus
  }
];

export const getTableColumns = (tab = ORDER_TABS.SUBMITTED_BUY_AND_BILL, translate, alertContainerId) => {
  if (!tab) throw new Error('table type is missing');
  if (!Object.keys(TABLE_COLUMNS).includes(tab)) throw new Error('no matching columns found');

  const columns = TABLE_COLUMNS[tab];
  const getJsxColumns = jsxColumns();
  const tableColumns = columns.map((col) => getJsxColumns.find((item) => item.id === col)).filter(Boolean);

  const protoObject = {
    translate,
    tab,
    alertContainerId
  };

  tableColumns.map((column) => {
    column.name = translate(column.name);
    column.__meta__ = protoObject;
  });

  return tableColumns;
};
