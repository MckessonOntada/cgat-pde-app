import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, RadioGroup } from '@mckesson/mcp-component-library';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';

const getColorByStatus = (status) => {
  const statusColors = {
    success: 'success',
    error: 'error',
    pending: 'info'
  };
  return statusColors[status.toLowerCase()] || 'info';
};

export const createColumns = (t, navigate, therapy, onChange) => [
  {
    id: 'id',
    selector: () => {},
    width: '40px',
    sortable: false,
    showInMobileHeader: true,
    isSelectable: true,
    cell: (props) => (
      <div className="MCP-table-cell radio-button-wrapper">
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
            onChange(props);
          }}
          onOtherTextChange={() => {}}
          onSubRadioFieldChange={() => {}}
          radioBtnWidth="auto"
          value={therapy?.id == props.id ? props.id : ''}
        />
      </div>
    )
  },
  {
    id: 'therapyDescription',
    name: t('labels.therapyDescription'),
    selector: () => {},
    maxWidth: '280px',
    sortable: true,
    sortKey: 'material_description',
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    cell: (props) => (
      <Link className="MCP-table-link" aria-label={t('labels.therapyDescription')} to={`?therapy-details=${props.id}`}>
        <EclipsesTextcss str={props.therapyDescription} maxWidth={200}/>
      </Link>
    )
  },
  {
    id: 'therapyNumber',
    name: t('labels.therapyNumber'),
    selector: () => {},
    sortable: true,
    maxWidth: '180px',
    sortKey: 'material_Number',
    cell: (props) => <span aria-label={t('labels.therapyNumber')}>{props.therapyId}</span>
  },
  {
    id: 'ndc',
    name: t('table.columns.captions.nationalDrugCode'),
    selector: () => {},
    maxWidth: '220px',
    sortable: true,
    sortKey: 'ndc_number',
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    cardHeader: true,
    cell: (props) => (
      <span aria-label={t('table.columns.captions.nationalDrugCode')}>
        <EclipsesTextcss str={props.ndc} maxWidth={180} />
      </span>
    )
  },
  {
    id: 'strength',
    name: t('table.columns.captions.strength'),
    selector: () => {},
    maxWidth: '130px',
    minWidth: '100px',
    sortable: false,
    cell: (props) => <span aria-label={t('table.columns.captions.strength')}>{props.strength}</span>
  },
  {
    id: 'dosage',
    name: t('table.columns.captions.dosage'),
    selector: () => {},
    maxWidth: '150px',
    minWidth: '100px',
    sortable: false,
    cell: (props) => <span aria-label={t('table.columns.captions.dosage')}>{props.dosage}</span>
  }
];
