import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, DropdownMenu, Button } from '@mckesson/mcp-component-library';
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

const getOptionsByStatus = (status, t, tab) => {
  const options = [];
  
  const handleOnOptionSelection = ({ value }) => {
    if (value === 'view') {
      navigate(`view-order/${props.id}`);
    }
    if (value === 'edit') {
      navigate(`edit-order/${props.id}`);
    }
  };

  if (tab?.toLowerCase() === 'pending submission') {
    if (!status) return null;

    if (status.toLowerCase() === 'pending' || status.toLowerCase() === 'cancelled') {
      return null;
    }

    if (status?.toLowerCase() === 'in draft') {
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
  } else if(tab?.toLowerCase() === "submitted"){
    options.push(
        {
          label: t(`labels.orderActions.view`),
          value: 'view'
        },
        {
          label: t(`labels.orderActions.edit`),
          value: 'edit order'
        },
        {
          label: t(`labels.orderActions.delete`),
          value: 'delete order'
        }
      );
  }

  return <DropdownMenu anchorEl={<Button Icon={() => <IconEllipsis />} iconButton variant="tertiary" label="Icon Button" />} handleSelect={handleOnOptionSelection} options={options} aria-label="Order options" />;
};

export const createColumns = (t, navigate, activeTab) => [
  {
    id: 'id',
    name: t('labels.orderId'),
    selector: () => {},
    sortable: true,
    minWidth: '40px',
    cell: (props) => (
      <Link className="MCP-table-link" to={`${props.id}`} state={props} aria-label={t('labels.orderId')}>
        <EclipsesTextcss str={props.id} maxWidth={420} />
      </Link>
    )
  },
  {
    id: 'patient',
    name: t('labels.patientName'),
    selector: () => {},
    sortable: true,
    minWidth: '240px',
    cell: (props) => <EclipsesTextcss aria-label={t('labels.patientName')} str={`${props.name?.lastName}, ${props.name?.firstName} ${props.name?.middleName || ''}`} maxWidth={300} />
  },
  {
    id: 'therapy',
    name: t('labels.therapy'),
    selector: () => {},
    sortable: true,
    cell: (props) => (
      <span className={'MCP-table-cell'} aria-label={t('labels.therapy')}>
        {props.therapy}
      </span>
    )
  },
  {
    id: 'author',
    name: t('table.columns.captions.author'),
    selector: () => {},
    sortable: true,
    cell: (props) => (
      <span className={'MCP-table-cell'} aria-label={t('table.columns.captions.author')}>
        {props.author}
      </span>
    ),
    omit: activeTab !== 'pending submission'
  },
  {
    id: 'createdOn',
    name: t('table.columns.captions.createdOn'),
    selector: () => {},
    sortable: false,
    cell: (props) => <span aria-label={t('table.columns.captions.createdOn')}>{CommonUtils.convertDateStringFormat(props.updatedAt || props.createdAt, 'MM-DD-YYYY')}</span>,
    omit: activeTab !== 'pending submission'
  },

  {
    id: 'submittedBy',
    name: t('table.columns.captions.submittedBy'),
    selector: () => {},
    sortable: false,
    cell: (props) => <span>{props.submittedBy}</span>,
    omit: activeTab !== 'submitted'
  },
  {
    id: 'submittedOn',
    name: t('table.columns.captions.submittedOn'),
    selector: () => {},
    sortable: false,
    cell: (props) => <span>{CommonUtils.convertDateStringFormat(props.submittedOn, 'MM-DD-YYYY')}</span>,
    omit: activeTab !== 'submitted'
  },

  {
    id: 'status',
    name: t('table.columns.captions.status'),
    selector: () => {},
    sortable: false,
    center: true,
    cell: (props) => <Badge text={props.status} type={getColorByStatus(props.status.toLowerCase())} />
  },
  {
    id: 'price',
    name: t('table.columns.captions.price'),
    selector: () => {},
    sortable: false,
    cell: (props) => <span aria-label={t('table.columns.captions.price')}>{props.price}</span>
  },
  {
    id: 'actions',
    name: t('table.columns.captions.actions'),
    selector: () => {},
    sortable: false,
    cell: (props) => getOptionsByStatus(props.status, t, activeTab)
  }
];
