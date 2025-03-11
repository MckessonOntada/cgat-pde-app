import EclipsesTextCss from '@src/components/EclipsesText/EclipsesTextcss';
import { COLUMNS, ORDER_STATUS, TABLE_COLUMNS } from './config';
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

const getColorByStatus = (status) => {
  const statusColors = {
    [ORDER_STATUS.IN_DRAFT]: 'info',
    [ORDER_STATUS.APPROVAL_PENDING]: 'info',
    [ORDER_STATUS.SUBMITTED]: 'success',
    [ORDER_STATUS.CANCELLED]: 'error',
    [ORDER_STATUS.REJECTED]: 'error'
  };
  return statusColors[status] || 'info';
};

const getOptionsByStatus = function (props) {
  const { id, status, __meta: { translate, tab, alertContainerId } = {} } = this || {};

  const options = [];
  const navigate = useNavigate();
  const loggedInUserId = AuthUtils.getUserId();
  const { showAlert } = useAlert();
  const { refreshData, assginedGroupsData } = useOrders();
  const { hasPermission } = usePermission();
  const assignMutation = useMutation(() => OrderService.setOrderAssignToMe(id), {
    onSuccess: (result) => {
      navigate(`${id}/summary`, { state: { isApprover: true } });
    },
    onError: (err) => {
      const errorKey = handleApiError(err);
      showAlert({ description: t(errorKey), type: 'error', anchorEl: alertContainerId });
    }
  });

  const unassignMutation = useMutation(() => OrderService.setOrderUnassignToMe(id), {
    onSuccess: (result) => {
      refreshData();
      showAlert({ description: translate('messages.success.release'), type: 'success', anchorEl: alertContainerId });
    },
    onError: (err) => {
      const errorKey = handleApiError(err);
      showAlert({ description: t(errorKey), type: 'error', anchorEl: alertContainerId });
    }
  });

  const deleteMutation = useMutation(() => OrderService.deleteOrder(id), {
    onSuccess: (result) => {
      refreshData();
      showAlert({ description: translate('messages.success.delete'), type: 'success', anchorEl: alertContainerId });
    },
    onError: (error) => {
      const errorKey = handleApiError(err);
      showAlert({ description: t(errorKey), type: 'error', anchorEl: alertContainerId });
    }
  });

  const { mutate: discardCurrentOrderVersion } = useMutation(async (orderId) => await OrderService.discardCurrentOrderVersion(orderId), {
    onSuccess: (response) => {
      refreshData();
      showAlert({ description: translate('message.success.discardVersionChanges'), type: 'success', anchorEl: alertContainerId });
    },
    onError: (error) => {
      const errorKey = handleApiError(err);
      showAlert({ description: t(errorKey), type: 'error', anchorEl: alertContainerId });
    }
  });

  const handleDelete = async (orderId) => {
    deleteMutation.mutate();
  };

  const doesApproverGroupExist = (approverGroupIds, assginedGroupsData) => {
    if (!approverGroupIds || !assginedGroupsData || !CommonUtils.isNonEmptyObject(assginedGroupsData)) return false;
    const groupDataArray = Array.isArray(assginedGroupsData) ? assginedGroupsData : [];
    return approverGroupIds.some((id) => groupDataArray?.includes(id));
  };

  const handleOnOptionSelection = (value) => {
    if (value === 'view') {
      if (props.status === ORDER_STATUS.SUBMITTED) {
        navigate(`${id}/summary`, { state: { isEdit: true } });
      } else navigate(`${id}/summary`);
    }
    if (value === 'resume') {
      if (props.status === ORDER_STATUS.SUBMITTED) {
        navigate(getPathByOrderStage(props), { state: { isEdit: true } });
      } else navigate(getPathByOrderStage(props), { state: { isSimulate: true } });
    }
    if (value === 'delete') {
      renderModal({
        title: translate('labels.confirmation'),
        bodyContent: <h3>{translate('labels.orderActions.deletemessage')}</h3>,
        footerActions: {
          cancel: {
            label: translate('label.no')
          },
          confirm: {
            label: translate('label.yes'),
            action: () => {
              handleDelete();
            }
          }
        }
      });
    }
    if (value === 'cancel' || value === 'edit') {
      renderModal({
        title: translate('labels.information'),
        bodyContent: <h3>{translate('labels.orderActions.cancelmessage')}</h3>,
        footerActions: {
          cancel: {
            label: translate('labels.orderActions.OK')
          }
        }
      });
    }
    if (value === 'review') {
      if (props.approver?.id === loggedInUserId) {
        navigate(`${id}/summary`, { state: { isEdit: true, isApprover: true } });
      } else {
        navigate(`${id}/summary`, { state: { isApprover: false } });
      }
    }
    if (value === 'assign') {
      if (props.approver != null && props.approver?.id != null) {
        showAlert({
          description: 'The order is currently in review by another user. Please try again after some time',
          type: 'error',
          anchorEl: alertContainerId
        });
      } else {
        assignMutation.mutate();
      }
    }
    if (value === 'unassign') {
      unassignMutation.mutate();
    }
    if (value === 'discard-changes-by-me') {
      discardCurrentOrderVersion(props.id);
    }
  };

  if (tab === 1) {
    if (!status) return null;

    if (status === ORDER_STATUS.PENDING || status === ORDER_STATUS.CANCELLED) {
      return null;
    }

    if (status === ORDER_STATUS.IN_DRAFT) {
      if (hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS)) {
        options.unshift(
          {
            label: t(`labels.orderActions.resume`),
            value: 'resume'
          },
          {
            label: t(`labels.orderActions.delete`),
            value: 'delete'
          }
        );
      }
    } else if (status === ORDER_STATUS.REJECTED) {
      options.push({
        label: t(`labels.orderActions.view`),
        value: 'review'
      });
    } else if (status === ORDER_STATUS.APPROVAL_PENDING) {
      if ((!props.approver || props.approver?.id === null) && doesApproverGroupExist(props.approverGroupIds, assginedGroupsData)) {
        options.push({
          label: t(`labels.orderActions.assignToMe`),
          value: 'assign'
        });
      } else if (props.approver?.id === loggedInUserId) {
        options.push({
          label: t(`labels.orderActions.unassignToMe`),
          value: 'unassign'
        });
        if (props.versionOwner) {
          options.push({
            label: t(`labels.orderActions.discardChangesByMe`),
            value: 'discard-changes-by-me'
          });
        }
      }

      if (options.length > 0 && options[options.length - 1].value === 'unassign') {
        options.push({
          label: t(`labels.orderActions.review`),
          value: 'review'
        });
      } else {
        options.push({
          label: t(`labels.orderActions.view`),
          value: 'review'
        });
      }
    }
  } else if (tab === 2) {
    if (hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.VIEW_ORDERS)) {
      options.push({
        label: t(`labels.orderActions.view`),
        value: 'view'
      });
    }
    if (hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS)) {
      options.push({
        label: t(`labels.orderActions.edit`),
        value: 'edit'
      });
    }
    if (hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.CANCEL_ORDER)) {
      options.push({
        label: t(`labels.orderActions.cancel`),
        value: 'cancel'
      });
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
};

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
        <Link className="MCP-table-link">
          <EclipsesTextCss str={props.backendOrderId} maxWidth={120} />
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
    cell: function (props) {
      return <EclipsesTextCss str={props.id} maxWidth={130} />;
    }
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
    sortKey: 'author?.name',
    maxWidth: '130px',
    cell: function (props) {
      return (
        <EclipsesTextCss tooltip={props.createdBy?.userName} str={props.createdBy?.name} maxWidth={120} className={'MCP-table-cell'} />
      );
    }
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
    width: '100px',
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
            <Badge text={this.__meta__.translate(`labels.status.${props.status.toLowerCase()}`)} type={getColorByStatus(props.status)} />
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
      return <div className="cellEllipse align-items-right ">{props.orderCost || '00'}</div>;
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
  const tableColumns = jsxColumns.filter((column) => columns.includes(column.id));

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
