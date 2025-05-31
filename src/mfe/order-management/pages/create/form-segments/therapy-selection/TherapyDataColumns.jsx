import React from 'react';
import { Link } from 'react-router-dom';
import { RadioGroup, Tooltip } from '@mckesson/mcp-component-library';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as ArrowAngleRight } from '@src/assets/svg/arrow-right.svg';

function getCellValue(data, key) {
  let displayCaption = '-';
  if (!data.isTherapy) {
    const vals = data.map((child) => child[key]).filter((i) => Boolean(i));
    const uniqueValues = Array.from(new Set(vals));
    if (uniqueValues.length < 3) {
      displayCaption = uniqueValues.join(', ');
    } else {
      const markerCaption = uniqueValues.slice(0, 2);
      displayCaption = `${markerCaption.join(', ')} + ${uniqueValues.length - 2} more`;
    }
  } else {
    displayCaption = data[key];
  }
  return displayCaption;
}

export const createColumns = ({ t, trade = {}, onChange, isRowExpanded, onExpandToggle }) => [
  {
    id: 'expandOrSelect',
    selector: () => null,
    width: '40px',
    sortable: false,
    showInMobileHeader: true,
    isSelectable: true,
    cell: (row) => {
      if (row.isExpandable && row.isParent) {
        const expanded = isRowExpanded?.(row);
        return (
          <div
            className="expand-icon-wrapper"
            style={{ cursor: 'pointer' }}
            onClick={() => onExpandToggle?.(row.tradeName)}
            aria-label={expanded ? 'Collapse row' : 'Expand row'}>
            <div className={`row-expansion-icon ${expanded ? 'open' : null}`}>
              <ArrowAngleRight />
            </div>
          </div>
        );
      }

      return (
        <div className="MCP-table-cell radio-button-wrapper">
          <RadioGroup
            direction="column"
            id={`radio-button-order-therapy-${row.id}`}
            items={[
              {
                isDisabled: false,
                label: ' ',
                value: row.id
              }
            ]}
            onChangeValue={() => {
              onChange(row);
            }}
            radioBtnWidth="auto"
            value={row.tradeName === trade.tradeName && trade.ndc === row.ndc ? row.id : ''}
          />
        </div>
      );
    }
  },
  {
    id: 'therapyDescription',
    name: t('labels.therapy'),
    selector: () => {},
    minWidth: '200px',
    sortable: true,
    sortKey: 'material_description',
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    cell: (row) => {
      const { tradeName, cellValue } = row;
      return (
        <Link className="MCP-table-link" aria-label={t('labels.therapyDescription')} to={`?trade=${tradeName}&channelType=${row.channelType}`}>
          <EclipsesTextcss str={cellValue} />
        </Link>
      );
    }
  },
  {
    id: 'genericName',
    name: t('labels.genericName'),
    selector: () => {},
    sortable: false,
    minWidth: '200px',
    cell: (row) => {
      return (
        <span aria-label={t('labels.genericName')}>
          <Tooltip body={row.isExpandable ? row.genericNameTooltip : row.genericName}>{row.genericName}</Tooltip>
        </span>
      );
    }
  },
  {
    id: 'ndc',
    name: t('labels.ndc'),
    selector: () => {},
    minWidth: '120px',
    sortable: true,
    sortKey: 'ndc',
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    cardHeader: true,
    cell: (row) => {
      return (
        <span aria-label={t('table.columns.captions.nationalDrugCode')}>
          <Tooltip body={row.isExpandable ? row.ndcTooltip : row.ndc}>{row.ndc}</Tooltip>
        </span>
      );
    }
  },
  {
    id: 'manufacturer',
    name: t('labels.manufacturer'),
    selector: () => {},
    width: '180px',
    sortable: true,
    cell: (row) => {
      return (
        <span aria-label={t('table.columns.captions.manufacturer')}>
          <Tooltip body={row.isExpandable ? row.manufacturerTooltip : row.manufacturer}>{row.manufacturer}</Tooltip>
        </span>
      );
    }
  },
  {
    id: 'formulation',
    name: t('labels.formulation'),
    selector: () => {},
    width: '140px',
    sortable: false,
    cell: (row) => {
      return row.formulation ? (
        <span aria-label={t('table.columns.captions.formulation')}>
          <Tooltip body={row.formulation}>{row.formulation}</Tooltip>
        </span>
      ) : (
        '-'
      );
    }
  },
  {
    id: 'dosage',
    name: t('labels.dosage'),
    selector: () => {},
    width: '100px',
    sortable: false,
    cell: (row) => {
      return row.dosage ? (
        <span aria-label={t('table.columns.captions.dosage')}>
          <Tooltip body={row.formulation}>{row.dosage}</Tooltip>
        </span>
      ) : (
        '-'
      );
    }
  }
];
