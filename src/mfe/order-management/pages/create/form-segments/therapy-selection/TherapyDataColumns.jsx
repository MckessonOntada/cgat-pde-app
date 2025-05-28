import React from 'react';
import { Link } from 'react-router-dom';
import { RadioGroup } from '@mckesson/mcp-component-library';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as ArrowAngleRight } from '@src/assets/svg/arrow-right.svg';

export const createColumns = (t, navigate, therapy, onChange, isRowExpanded, onExpandToggle) => [
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
    name: t('labels.therapyDescription'),
    selector: () => {},
    minWidth: '200px',
    sortable: true,
    sortKey: 'material_description',
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    cell: (row) => {
      const { therapies = [], tradeName, materialDescription } = row;
      const label = therapies && therapies.length === 1 ? therapies[0].materialDescription : tradeName || materialDescription;
      const linkValue = therapies.map((i) => i.id).join(',');
      return (
        <Link className="MCP-table-link" aria-label={t('labels.therapyDescription')} to={`?therapy=${linkValue}`}>
          <EclipsesTextcss str={label} />
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
      let displayCaption = '-';
      if (row.isExpandable) {
        const manufacturers = Array.from(new Set(row.therapies.map((i) => i.genericName)));
        if (manufacturers && manufacturers.length > 0) {
          displayCaption = manufacturers.join(', ');
        }
      } else {
        displayCaption = row.genericName;
      }
      return <span aria-label={t('labels.genericName')}>{displayCaption}</span>;
    }
  },
  {
    id: 'ndc',
    name: t('table.columns.captions.nationalDrugCode'),
    selector: () => {},
    minWidth: '120px',
    sortable: true,
    sortKey: 'ndc',
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    cardHeader: true,
    cell: (row) => {
      let displayCaption = '-';
      if (row.isExpandable) {
        displayCaption = row.therapies.map((child) => child.ndc).join(', ');
      } else {
        displayCaption = row.ndc;
      }

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
      let displayCaption = '-';
      if (row.isExpandable) {
        const manufacturers = Array.from(new Set(row.therapies.map((i) => i.manufacturerName)));
        if (manufacturers && manufacturers.length > 0) {
          displayCaption = manufacturers.join(', ');
        }
      } else {
        displayCaption = row.manufacturerName;
      }
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
        displayCaption = row.formulation;
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
