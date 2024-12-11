import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, DropdownMenu, RadioGroup } from '@mckesson/mcp-component-library';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';

const getColorByStatus = (status) => {
  const statusColors = {
    success: 'success',
    error: 'error',
    pending: 'info'
  };
  return statusColors[status.toLowerCase()] || 'info';
};

export const createColumns = (t, navigate, selectedRowId, setSelectedRowId) => [
  {
    id: 'id',
    selector: () => {},
    width: '2%',
    sortable: false,
    cell: (props) => (
      <span className="MCP-table-cell">
        <RadioGroup
          direction="column"
          id={`radio-button-order-therapy-${props.id}`}
          items={[
            {
              isDisabled: false,
              label: ' ',
              value: props.id
            }
          ]}
          onChangeValue={() => {
            setSelectedRowId(props.id);
          }}
          onOtherTextChange={() => {}}
          onSubRadioFieldChange={() => {}}
          radioBtnWidth="auto"
          value={selectedRowId === props.id ? props.id : ''}
        />
      </span>
    )
  },
  {
    id: 'therapyDescription',
    name: t('labels.therapyDescription'),
    selector: () => {},
    width: '13%',
    sortable: true,
    cell: (props) => (
      <span className="MCP-table-cell" aria-label={t('labels.therapyDescription')}>
        <Link className="MCP-table-link" to={`?therapy-details=${props.id}`}>
          {props.therapyDescription}
        </Link>
      </span>
    )
  },
  {
    id: 'therapyNumber',
    name: t('labels.therapyNumber'),
    width: '8%',
    selector: () => {},
    sortable: true,
    cell: (props) => (
      <span className="MCP-table-cell" aria-label={t('labels.therapyNumber')}>
        {props.therapyNumber}
      </span>
    )
  },
  {
    id: 'nationalDrugCode',
    name: t('table.columns.captions.nationalDrugCode'),
    selector: () => {},
    width: '7%',
    sortable: true,
    cell: (props) => (
      <span className="MCP-table-cell" aria-label={t('table.columns.captions.nationalDrugCode')}>
        {props.nationalDrugCode}
      </span>
    )
  },
  {
    id: 'strength',
    name: t('table.columns.captions.strength'),
    selector: () => {},
    width: '4%',
    sortable: true,
    cell: (props) => (
      <span className="MCP-table-cell" aria-label={t('table.columns.captions.strength')}>
        {props.strength}
      </span>
    )
  },
  {
    id: 'dosage',
    name: t('table.columns.captions.dosage'),
    selector: () => {},
    width: '4%',
    sortable: true,
    cell: (props) => (
      <span className="MCP-table-cell" aria-label={t('table.columns.captions.dosage')}>
        {props.dosage}
      </span>
    )
  },
  {
    id: 'sellingUnitCode',
    name: t('table.columns.captions.sellingUnitCode'),
    selector: () => {},
    width: '7%',
    sortable: true,
    cell: (props) => (
      <span className="MCP-table-cell" aria-label={t('table.columns.captions.sellingUnitCode')}>
        {props.sellingUnitCode}
      </span>
    )
  },
  {
    id: 'vendorName',
    name: t('table.columns.captions.vendorName'),
    selector: () => {},
    width: '7%',
    sortable: true,
    cell: (props) => (
      <span className="MCP-table-cell" aria-label={t('table.columns.captions.vendorName')}>
        {props.vendorName}
      </span>
    )
  },
  {
    id: 'upcCode',
    name: t('table.columns.captions.upcCode'),
    selector: () => {},
    width: '6%',
    sortable: true,
    cell: (props) => (
      <span className="MCP-table-cell" aria-label={t('table.columns.captions.upcCode')}>
        {props.upcCode}
      </span>
    )
  },
  {
    id: 'dropshipIndicator',
    name: t('table.columns.captions.dropshipIndicator'),
    width: '7%',
    selector: () => {},
    sortable: false,
    cell: (props) => <Badge text={props.dropshipIndicator === 'Y' ? t('table.badge.yes') : t('table.badge.no')} type={props.dropshipIndicator === 'Y' ? 'success' : 'info'} />
  },
  {
    id: 'status',
    name: t('table.columns.captions.status'),
    selector: () => {},
    width: '4%',
    sortable: false,
    cell: (props) => <Badge text={props.status} type={getColorByStatus(props.status)} />
  },
  {
    id: 'baseUnitsOfMeasure',
    name: t('table.columns.captions.baseUnitsOfMeasure'),
    selector: () => {},
    width: '7%',
    sortable: true,
    cell: (props) => (
      <span className="MCP-table-cell" aria-label={t('table.columns.captions.baseUnitsOfMeasure')}>
        {props.baseUnitsOfMeasure}
      </span>
    )
  },
  {
    id: 'cgatIdentifier',
    name: t('table.columns.captions.cgatIdentifier'),
    selector: () => {},
    width: '4%',
    sortable: false,
    cell: (props) => <Badge text={props.cgatIdentifier === 'Y' ? t('table.badge.yes') : t('table.badge.no')} type={props.cgatIdentifier === 'Y' ? 'success' : 'info'} />
  },
  {
    id: 'salesOrganization',
    name: t('table.columns.captions.salesOrganization'),
    selector: () => {},
    sortable: true,
    cell: (props) => (
      <span className="MCP-table-cell" aria-label={t('table.columns.captions.salesOrganization')}>
        {props.salesOrganization}
      </span>
    )
  },
  {
    id: 'cgatTherapyType',
    name: t('table.columns.captions.cgatTherapyType'),
    selector: () => {},
    sortable: true,
    cell: (props) => (
      <span className="MCP-table-cell" aria-label={t('table.columns.captions.cgatTherapyType')}>
        {props.cgatTherapyType}
      </span>
    )
  },
  {
    id: 'productLevelPricing',
    name: t('table.columns.captions.productLevelPricing'),
    selector: () => {},
    sortable: false,
    cell: (props) => <Badge text={props.productLevelPricing === 'Yes' ? t('table.badge.yes') : t('table.badge.no')} type={props.productLevelPricing === 'Yes' ? 'success' : 'info'} />
  },
  {
    id: 'minimumOrderQuantity',
    name: t('table.columns.captions.minimumOrderQuantity'),
    selector: () => {},
    sortable: true,
    cell: (props) => (
      <span className="MCP-table-cell" aria-label={t('table.columns.captions.minimumOrderQuantity')}>
        {props.minimumOrderQuantity}
      </span>
    )
  }
];
