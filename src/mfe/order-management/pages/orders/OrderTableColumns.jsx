import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, DropdownMenu, Button, Tooltip, Modal } from '@mckesson/mcp-component-library';
import { StatusEnum } from './constants';
import { routesConfig } from '../../routes/constants';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import CommonUtils from '@src/util/CommonUtils';
import AuthUtils from '@src/util/AuthUtils';
import { useMutation } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';
import useAlert from '@src/hooks/useAlert';
import { handleApiError } from '@src/util/ApiUtils';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';
import { renderModal } from '@src/util/ModalUtil';
import { useOrders } from '../../context/OrderContext';

const getColorByStatus = (status) => {
  const statusColors = {
    [StatusEnum.IN_DRAFT]: 'info',
    [StatusEnum.APPROVAL_PENDING]: 'info',
    [StatusEnum.SUBMITTED]: 'success',
    [StatusEnum.CANCELLED]: 'error'
  };
  return statusColors[status] || 'info';
};

const getLinkByStatus = ({ status, id }, t) => {
  const routes = {
    [StatusEnum.IN_DRAFT]: { path: `${routesConfig.createNew}/${id}`, label: t('table.actions.resumeOrder') },
    [StatusEnum.APPROVAL_PENDING]: { path: `${routesConfig.reviewOrder}/${id}`, label: t('table.actions.reviewOrder') },
    [StatusEnum.SUBMITTED]: { path: `${routesConfig.summary}/${id}`, label: t('table.actions.viewDetail') },
    [StatusEnum.CANCELLED]: { path: `${routesConfig.summary}/${id}`, label: t('table.actions.viewDetail') }
  };
  const { path = '#', label } = routes[status.toLowerCase()] || {};
  return <Link to={path}>{label}</Link>;
};

const getOptionsByStatus = (props, status, t, tab, id, alertContainerId) => {
  const options = [];
  const navigate = useNavigate();
  const loggedinUserId = AuthUtils.getUserId();
  const { showAlert } = useAlert();
  const { refreshData } = useOrders();
  const { hasPermission } = usePermission();
  const assignMutation = useMutation(() => OrderService.setOrderAssignToMe(id), {
    onSuccess: (result) => {
      navigate(`${id}/summary`, { state: { isReview: true } });
    },
    onError: (err) => {
      const errorKey = handleApiError(err);
      showAlert({ description: t(errorKey), type: 'error', anchorEl: alertContainerId });
    }
  });

  const unassignMutation = useMutation(() => OrderService.setOrderUnassignToMe(id), {
    onSuccess: (result) => {
      showAlert({ description: t('messages.success.release'), type: 'success', anchorEl: alertContainerId });
    },
    onError: (err) => {
      const errorKey = handleApiError(err);
      showAlert({ description: t(errorKey), type: 'error', anchorEl: alertContainerId });
    }
  });

  const deleteMutation = useMutation(() => OrderService.deleteOrder(id), {
    onSuccess: (result) => {
      refreshData();
      showAlert({ description: t('messages.success.delete'), type: 'success', anchorEl: alertContainerId });
    },
    onError: (error) => {
      const errorKey = handleApiError(err);
      showAlert({ description: t(errorKey), type: 'error', anchorEl: alertContainerId });
    }
  });

  const handleDelete = async (orderId) => {
    deleteMutation.mutate();
  };

  const handleOnOptionSelection = ({ value }) => {
    if (value === 'view') {
      if (props.status === StatusEnum.SUBMITTED) {
        navigate(`${id}/summary`, { state: { isEdit: true } });
      } else navigate(`${id}/summary`);
    }
    if (value === 'resume') {
      if (props.status === StatusEnum.SUBMITTED) {
        navigate(getPathByOrderStage(props), { state: { isEdit: true } });
      } else navigate(getPathByOrderStage(props));
    }
    if (value === 'edit') {
      navigate(`edit-order/${id}`);
    }
    if (value === 'delete') {
      renderModal({
        title: t('labels.confirmation'),
        bodyContent: <h3>{t('labels.orderActions.deletemessage')}</h3>,
        footerActions: {
          cancel: {
            label: t('label.no')
          },
          confirm: {
            label: t('label.yes'),
            action: () => {
              handleDelete();
            }
          }
        }
      });
    }
    if (value === 'cancel') {
      renderModal({
        title: t('labels.information'),
        bodyContent: <h3>{t('labels.orderActions.cancelmessage')}</h3>,
        footerActions: {
          cancel: {
            label: t('labels.orderActions.okay')
          }
        }
      });
    }
    if (value === 'review') {
      navigate(`${id}/summary`, { state: { isReview: true, isEdit: true } });
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
  };

  if (tab?.toLowerCase() === 'pending submission') {
    if (!status) return null;

    if (status.toLowerCase() === 'pending' || status.toLowerCase() === 'cancelled') {
      return null;
    }

    if (status?.toLowerCase() === 'in_draft') {
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
    } else if (status?.toLowerCase() === 'approval_pending') {
      if (!props.approver || props.approver.id === null) {
        options.push({
          label: t(`labels.orderActions.assignToMe`),
          value: 'assign'
        });
      } else if (props.approver.id === loggedinUserId) {
        options.push({
          label: t(`labels.orderActions.unassignToMe`),
          value: 'unassign'
        });
      }

      options.push({
        label: t(`labels.orderActions.review`),
        value: 'review'
      });
    }
  } else if (tab?.toLowerCase() === 'submitted') {
    options.push({
      label: t(`labels.orderActions.view`),
      value: 'view'
    });
    if (hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.CANCEL_ORDER)) {
      options.push({
        label: t(`labels.orderActions.cancel`),
        value: 'cancel'
      });
    }
  }

  return (
    <DropdownMenu
      anchorEl={<Button Icon={() => <IconEllipsis />} iconButton variant="tertiary" label="Icon Button" />}
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

const getPatientName = (patientInfo) => {
  let lastName = '';
  if (patientInfo?.name?.lastName) fullName += ',';

  return [lastName, patientInfo?.name?.firstName, patientInfo?.name?.middleName].join(' ');
};

export const createColumns = (t, navigate, activeTab, alertContainerId) => [
  {
    id: 'id',
    name: t('labels.orderId'),
    selector: () => {},
    sortable: true,
    minWidth: '240px',
    maxWidth: '320px',
    sortable: true,
    sortKey: 'id',
    cell: (props) => (
      <Link
        className="MCP-table-link"
        to={getPathByOrderStage(props)}
        state={props.currentStage === 'ORDER_SUMMARY' && props.status === StatusEnum.SUBMITTED ? { ...props, isEdit: true } : { ...props }}
        aria-label={t('labels.orderId')}>
        <EclipsesTextcss str={props.id} maxWidth={200} />
      </Link>
    )
  },
  {
    id: 'patient',
    name: t('labels.patientName'),
    selector: () => {},
    sortable: true,
    sortKey: 'patient.patientInfo',
    minWidth: '140px',
    maxWidth: '200px',
    cell: (props) => {
      const patientInfo = props.patient && props.patient.patientInfo;
      return !patientInfo ? (
        'N/A'
      ) : (
        <EclipsesTextcss aria-label={t('labels.patientName')} str={getPatientName(patientInfo)} maxWidth={170} />
      );
    }
  },
  {
    id: 'therapyId',
    name: t('labels.therapy'),
    selector: () => {},
    sortable: true,
    sortKey: 'therapy.materialDescription',
    minWidth: '140px',
    cell: (props) => (
      <EclipsesTextcss
        str={props.therapy?.materialDescription}
        maxWidth={100}
        className={'MCP-table-cell'}
        aria-label={t('labels.therapy')}
      />
    )
  },
  {
    id: 'author',
    name: t('table.columns.captions.author'),
    selector: () => {},
    sortable: true,
    sortKey: 'author?.name',
    minWidth: '140px',
    maxWidth: '200px',
    cell: (props) => (
      <EclipsesTextcss tooltip={props.createdBy?.userName} str={props.createdBy?.name} maxWidth={170} className={'MCP-table-cell'} />
    ),
    omit: activeTab !== 'pending submission'
  },
  {
    id: 'createdOn',
    name: t('table.columns.captions.createdOn'),
    selector: () => {},
    sortable: true,
    sortKey: 'createdAt',
    width: '100px',
    cell: (props) => (
      <span aria-label={t('table.columns.captions.createdOn')}>
        {CommonUtils.convertDateStringFormat(props.updatedAt || props.createdAt, 'MM-DD-YYYY')}
      </span>
    ),
    omit: activeTab !== 'pending submission'
  },

  {
    id: 'submittedBy',
    name: t('table.columns.captions.submittedBy'),
    selector: () => {},
    sortable: true,
    sortKey: 'submittedBy.name',
    minWidth: '180px',
    maxWidth: '340px',
    cell: (props) => (
      <EclipsesTextcss tooltip={props.submittedBy?.userName} str={props.submittedBy?.name} maxWidth={170} className={'MCP-table-cell'} />
    ),
    omit: activeTab !== 'submitted'
  },
  {
    id: 'submittedOn',
    name: t('table.columns.captions.submittedOn'),
    selector: () => {},
    sortable: true,
    sortKey: 'submittedOn',
    width: '180px',
    cell: (props) => <span>{props.submittedOn ? CommonUtils.convertDateStringFormat(props.submittedOn, 'MM-DD-YYYY') : '-'}</span>,
    omit: activeTab !== 'submitted'
  },

  {
    id: 'status',
    name: t('table.columns.captions.status'),
    selector: () => {},
    sortable: false,
    width: '180px',
    center: true,
    cell: (props) => (
      <Tooltip body={props.status}>
        <span>
          <Badge text={props.status?.replace('_', ' ')} type={getColorByStatus(props.status)} />
        </span>
      </Tooltip>
    )
  },
  {
    id: 'price',
    name: t('table.columns.captions.price'),
    selector: () => {},
    sortable: true,
    selector: 'orderCost',
    width: '100px',
    cell: (props) => <span aria-label={t('table.columns.captions.price')}>{props.orderCost}</span>
  },
  {
    id: 'actions',
    name: t('table.columns.captions.actions'),
    selector: () => {},
    sortable: false,
    width: '120px',
    center: true,
    cell: (props) => getOptionsByStatus(props, props.status, t, activeTab, props.id, alertContainerId)
  }
];
