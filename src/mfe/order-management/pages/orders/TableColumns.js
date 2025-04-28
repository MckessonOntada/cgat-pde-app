import EclipsesTextCss from '@src/components/EclipsesText/EclipsesTextcss';
import { COLUMNS, ORDER_ENTITY_ACTION, ORDER_STATUS, ORDER_TABS, TABLE_COLUMNS } from './config';
import CommonUtils from '@src/util/CommonUtils';
import { Link, useNavigate } from 'react-router-dom';
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
  const { refreshData, assignedGroupsData } = useOrders();
  const { hasPermission } = usePermission();

  // Mutations
  const { mutate: assignToMe } = useMutation(() => OrderService.setOrderAssignToMe(id), {
    onSuccess: () => navigate(`${id}/summary`, { state: { isApprover: true } }),
    onError: (err) => showAlert({ description: t(handleApiError(err)), type: 'error', anchorEl: alertContainerId })
  });

  const { mutate: unassignFromMe } = useMutation(() => OrderService.setOrderUnassignToMe(id), {
    onSuccess: () => {
      refreshData();
      showAlert({ description: translate('messages.success.release'), type: 'success', anchorEl: alertContainerId });
    },
    onError: (err) => showAlert({ description: translate(handleApiError(err)), type: 'error', anchorEl: alertContainerId })
  });

  const { mutate: deleteOrder } = useMutation(() => OrderService.deleteOrder(id), {
    onSuccess: () => {
      refreshData();
      showAlert({ description: translate('messages.success.delete'), type: 'success', anchorEl: alertContainerId });
    },
    onError: (err) => showAlert({ description: translate(handleApiError(err)), type: 'error', anchorEl: alertContainerId })
  });

  const { mutate: discardVersion } = useMutation((orderId) => OrderService.discardCurrentOrderVersion(orderId), {
    onSuccess: () => {
      refreshData();
      showAlert({ description: translate('message.success.discardVersionChanges'), type: 'success', anchorEl: alertContainerId });
    },
    onError: (err) => showAlert({ description: translate(handleApiError(err)), type: 'error', anchorEl: alertContainerId })
  });

  const handleOnOptionSelection = (value) => {
    switch (value) {
      case ORDER_ENTITY_ACTION.VIEW:
        navigate(`${id}/summary`, { state: props.status === ORDER_STATUS.SUBMITTED ? { isEdit: true } : {} });
        break;
      case ORDER_ENTITY_ACTION.RESUME:
        navigate(getPathByOrderStage(props), { state: props.status === ORDER_STATUS.SUBMITTED ? { isEdit: true } : { isSimulate: true } });
        break;
      case ORDER_ENTITY_ACTION.DELETE:
        renderModal({
          title: translate('labels.confirmation'),
          bodyContent: <h3>{translate('labels.orderActions.deletemessage')}</h3>,
          footerActions: {
            cancel: { label: translate('label.no') },
            confirm: { label: translate('label.yes'), action: () => deleteOrder() }
          }
        });
        break;
      case ORDER_ENTITY_ACTION.CANCEL:
      case ORDER_ENTITY_ACTION.EDIT:
        renderModal({
          title: translate('labels.information'),
          bodyContent: <h3>{translate('labels.orderActions.cancelmessage')}</h3>,
          footerActions: { cancel: { label: translate('labels.orderActions.OK') } }
        });
        break;
      case ORDER_ENTITY_ACTION.REVIEW:
        navigate(`${id}/summary`, {
          state: { isEdit: props.approver?.id === loggedInUserId, isApprover: props.approver?.id === loggedInUserId }
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
          assignToMe();
        }
        break;
      case ORDER_ENTITY_ACTION.UNASSIGN:
        unassignFromMe();
        break;
      case ORDER_ENTITY_ACTION.DISCARD_MY_CHANGES:
        discardVersion(props.id);
        break;
      default:
        break;
    }
  };

  // Check if the approver group exists
  const doesApproverGroupExist = (approverGroupIds, assignedGroups) => {
    return approverGroupIds?.some((id) => assignedGroups?.includes(id)) ?? false;
  };

  let options = [];
  if (tab === ORDER_TABS.PENDING_SUBMISSION) {
    if (status === ORDER_STATUS.IN_DRAFT && hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS)) {
      options.push({ label: translate(`labels.orderActions.resume`), value: ORDER_ENTITY_ACTION.RESUME });
      options.push({ label: translate(`labels.orderActions.delete`), value: ORDER_ENTITY_ACTION.DELETE });
    } else if (status === ORDER_STATUS.REJECTED) {
      options.push({ label: translate(`labels.orderActions.view`), value: ORDER_ENTITY_ACTION.REVIEW });
    } else if (status === ORDER_STATUS.DELETED) {
      options.push({ label: translate(`labels.orderActions.view`), value: ORDER_ENTITY_ACTION.VIEW });
    }
    // if (![ORDER_STATUS.PENDING, ORDER_STATUS.DELETED].includes(status)) {
    // }
  } else if (status === ORDER_STATUS.APPROVAL_PENDING) {
    if (!props.approver?.id && doesApproverGroupExist(props.approverGroupIds, assignedGroupsData)) {
      options.push({ label: translate(`labels.orderActions.assignToMe`), value: ORDER_ENTITY_ACTION.ASSIGN });
    } else if (props.approver?.id === loggedInUserId) {
      options.push({ label: translate(`labels.orderActions.unassignToMe`), value: ORDER_ENTITY_ACTION.UNASSIGN });
      if (props.versionOwner) {
        options.push({ label: translate(`labels.orderActions.discardChangesByMe`), value: ORDER_ENTITY_ACTION.DISCARD_MY_CHANGES });
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
  } else if (tab === ORDER_TABS.SUBMITTED_BUY_AND_BILL) {
    if (hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.VIEW_ORDERS)) {
      options.push({ label: translate(`labels.orderActions.view`), value: ORDER_ENTITY_ACTION.VIEW });
    }
    if (hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS)) {
      options.push({ label: translate(`labels.orderActions.edit`), value: ORDER_ENTITY_ACTION.EDIT });
    }
    if (hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.CANCEL_ORDER)) {
      options.push({ label: translate(`labels.orderActions.cancel`), value: ORDER_ENTITY_ACTION.CANCEL });
    }
  }

  return (
    <MenuList
      menuIcon={<IconEllipsis key={'menu-list-order-table'} />}
      handleSelect={handleOnOptionSelection}
      options={options}
      aria-label="Order options"
    />
  );
}

const getPathByOrderStage = ({ currentStage, id, patientDetailsRequired }) => {
  switch (currentStage) {
    case 'ACCOUNT_DETAILS':
      return `${id}/accounts`;
    case 'PATIENT_DETAILS':
      return patientDetailsRequired ? `${id}/patient` : `${id}/additional-details`;
    case 'ADDITIONAL_DETAILS':
      return `${id}/additional-details`;
    case 'ORDER_SUMMARY':
      return `${id}/summary`;
    default:
      return `${id}/accounts`;
  }
};

const getState = (props) => {
  const { status, approver } = props;
  if (!status) throw new Error('Order status not found, to get state.');

  const loggedInUserId = AuthUtils.getUserId();
  if (status === ORDER_STATUS.SUBMITTED) {
    return props;
  } else if (status === ORDER_STATUS.APPROVAL_PENDING) {
    if (approver?.id === loggedInUserId) {
      return { isEdit: true, isApprover: true };
    } else {
      return { isApprover: false };
    }
  } else if (status === ORDER_STATUS.IN_DRAFT) {
    return { isSimulate: true };
  } else {
    return props;
  }
};

const jsxColumns = [
  {
    id: COLUMNS.SAP_ID,
    name: 'labels.sapId',
    selector: () => {},
    sortable: true,
    sortKey: 'backendOrderId',
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
    id: COLUMNS.PDE_ID,
    name: 'labels.pdeId',
    selector: () => {},
    sortable: true,
    sortKey: 'id',
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    minWidth: '140px',
    cell: (props) => <Tooltip body={props.id}>{props.id}</Tooltip>
  },
  {
    id: COLUMNS.ORDER_ID,
    name: 'labels.orderId',
    selector: () => {},
    sortable: true,
    sortKey: 'id',
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    minWidth: '140px',
    cell: (props) => (
      <Link className="MCP-table-link" to={getPathByOrderStage(props)} state={getState(props)}>
        <Tooltip body={props.id}>{props.id}</Tooltip>
      </Link>
    )
  },
  {
    id: COLUMNS.PATIENT_NAME,
    name: 'labels.patientName',
    selector: () => {},
    sortable: true,
    sortKey: 'patient.patientInfo',
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
    sortKey: 'therapy.materialDescription',
    maxWidth: '115px',
    showInMobileHeader: true,
    cardHeader: true,
    cell: function (props) {
      return <EclipsesTextCss str={props.therapy?.materialDescription} maxWidth={120} className={'MCP-table-cell'} />;
    }
  },
  {
    id: COLUMNS.AUTHOR,
    name: 'table.columns.captions.author',
    selector: () => {},
    sortable: true,
    sortKey: 'createdBy.name',
    maxWidth: '130px',
    cell: (props) => <Tooltip body={props.createdBy?.userName}>{props.createdBy?.userName}</Tooltip>
  },
  {
    id: COLUMNS.ASSIGNEE,
    name: 'table.columns.captions.assignee',
    selector: () => {},
    sortable: true,
    sortKey: 'approver.name',
    maxWidth: '130px',
    cell: (props) => (
      <EclipsesTextcss tooltip={props.approver?.name} str={props.approver?.name} maxWidth={180} className={'MCP-table-cell'} />
    )
  },
  {
    id: COLUMNS.CREATED_ON,
    name: 'table.columns.captions.createdOn',
    selector: () => {},
    sortable: true,
    sortKey: 'createdAt',
    minWidth: '80px',
    maxWidth: '135px',
    cell: function (props) {
      return <span>{CommonUtils.convertDateStringFormat(props.updatedAt || props.createdAt, 'MM-DD-YYYY')}</span>;
    }
  },
  {
    id: COLUMNS.SUBMITTED_BY,
    name: 'table.columns.captions.submittedBy',
    selector: () => {},
    sortable: true,
    sortKey: 'submittedBy.name',
    maxWidth: '140px',
    cell: function (props) {
      return (
        <EclipsesTextCss tooltip={props.submittedBy?.userName} str={props.submittedBy?.name} maxWidth={130} className={'MCP-table-cell'} />
      );
    }
  },
  {
    id: COLUMNS.SUBMITTED_ON,
    name: 'table.columns.captions.submittedOn',
    selector: () => {},
    sortable: true,
    sortKey: 'submittedOn',
    minwidth: '160px',
    cell: function (props) {
      return <span>{props.submittedOn ? CommonUtils.convertDateStringFormat(props.submittedOn, 'MM-DD-YYYY') : '-'}</span>;
    }
  },

  {
    id: COLUMNS.STATUS,
    name: 'table.columns.captions.status',
    selector: () => {},
    sortable: false,
    minWidth: '160px',
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
    cell: function (props) {
      return <div className="cellEllipse align-items-right ">{props.orderCost && `$${parseFloat(props.orderCost).toFixed(2)}`}</div>;
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

export const getTableColumns = (tab, translate, alertContainerId) => {
  if (!tab) throw new Error('table type is missing');
  if (!Object.keys(TABLE_COLUMNS).includes(tab)) throw new Error('no matching columns found');

  const columns = TABLE_COLUMNS[tab];
  const tableColumns = columns.map((col) => jsxColumns.find((item) => item.id === col)).filter(Boolean);

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
