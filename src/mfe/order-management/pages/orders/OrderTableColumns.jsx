import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, DropdownMenu, Button, Tooltip } from '@mckesson/mcp-component-library';
import { StatusEnum } from './constants';
import { routesConfig } from '../../routes/constants';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import CommonUtils from '@src/util/CommonUtils';

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

const getOptionsByStatus = (props, status, t, tab, id) => {
  const options = [];
  const navigate = useNavigate();

  const handleOnOptionSelection = ({ value }) => {
    if (value === 'view') {
      navigate(`${id}/summary`);
    }
    if (value === 'resume') {
      navigate(getPathByOrderStage(props));
    }
    if (value === 'edit') {
      navigate(`edit-order/${id}`);
    }
    if (value === 'delete') {
      alert('handle delete');
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
    } else if (status?.toLowerCase() === 'approval pending') {
      options.push(
        {
          label: t(`labels.orderActions.review`),
          value: 'review'
        },
        {
          label: t(`labels.orderActions.assignToMe`),
          value: 'assign to me'
        },
        {
          label: t(`labels.orderActions.approve`),
          value: 'approve'
        }
      );
    }
  } else if (tab?.toLowerCase() === 'submitted') {
    options.push(
      {
        label: t(`labels.orderActions.view`),
        value: 'view'
      },
      {
        label: t(`labels.orderActions.edit`),
        value: 'edit'
      },
      {
        label: t(`labels.orderActions.delete`),
        value: 'delete'
      }
    );
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

export const createColumns = (t, navigate, activeTab) => [
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
      <Link className="MCP-table-link" to={getPathByOrderStage(props)} state={props} aria-label={t('labels.orderId')}>
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
    sortKey: 'submittedBy',
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
          <Badge text={props.status?.replace('_', ' ')} type={getColorByStatus(props.status.toLowerCase())} />
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
    cell: (props) => getOptionsByStatus(props, props.status, t, activeTab, props.id)
  }
];
