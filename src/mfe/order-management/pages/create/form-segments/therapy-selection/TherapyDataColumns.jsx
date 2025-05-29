import React from 'react';
import { Link } from 'react-router-dom';
import { RadioGroup } from '@mckesson/mcp-component-library';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as ArrowAngleRight } from '@src/assets/svg/arrow-right.svg';

function getCellValue(data, key) {
  let displayCaption = '-';
  if (data.isExpandable) {
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

export const createColumns = ({ t, therapy, onChange, isRowExpanded, onExpandToggle }) => [
  {
    id: 'expandOrSelect',
    selector: () => null,
    width: '40px',
    sortable: false,
    showInMobileHeader: true,
    isSelectable: true,
    cell: (row) => {
      if (row.isExpandable && row.therapies.length > 1) {
        const expanded = isRowExpanded?.(row);
        return (
          <div
            className="expand-icon-wrapper"
            style={{ cursor: 'pointer' }}
            onClick={() => onExpandToggle?.(row)}
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
            value={therapy?.id === row.id ? row.id : ''}
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
      const { therapies = [], tradeName } = row;
      const linkValue = Boolean(therapies.length) ? therapies.map((i) => i.id).join(',') : row.id;

      let cellValue = row.isExpandable ? tradeName : row.materialDescription;
      return (
        <Link className="MCP-table-link" aria-label={t('labels.therapyDescription')} to={`?therapy=${linkValue}`}>
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
      let displayCaption = getCellValue(row.therapies || row, 'genericName', row.isExpandable);

      return <span aria-label={t('labels.genericName')}>{displayCaption || '-'}</span>;
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
      let displayCaption = getCellValue(row.therapies || row, 'ndc', row.isExpandable);

      return <span aria-label={t('table.columns.captions.nationalDrugCode')}>{displayCaption}</span>;
    }
  },
  {
    id: 'manufacturer',
    name: t('labels.manufacturer'),
    selector: () => {},
    width: '180px',
    sortable: true,
    cell: (row) => {
      let displayCaption = getCellValue(row.therapies || row, 'manufacturer', row.isExpandable);
      return <span aria-label={t('table.columns.captions.manufacturer')}>{displayCaption}</span>;
    }
  },
  {
    id: 'formulation',
    name: t('labels.formulation'),
    selector: () => {},
    width: '140px',
    sortable: false,
    cell: (row) => {
      let displayCaption = '-';
      if (!row.isExpandable) {
        displayCaption = row.strength;
      }
      return <span aria-label={t('table.columns.captions.formulation')}>{displayCaption}</span>;
    }
  },
  {
    id: 'dosage',
    name: t('labels.dosage'),
    selector: () => {},
    width: '100px',
    sortable: false,
    cell: (row) => {
      let displayCaption = '-';
      if (!row.isExpandable) {
        displayCaption = row.dosage;
      }
      return <span aria-label={t('table.columns.captions.dosage')}>{displayCaption}</span>;
    }
  }
];
