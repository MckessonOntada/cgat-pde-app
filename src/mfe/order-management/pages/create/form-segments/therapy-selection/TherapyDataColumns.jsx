import React from 'react';
import { Link } from 'react-router-dom';
import { RadioGroup, Tooltip } from '@mckesson/mcp-component-library';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as ArrowAngleRight } from '@src/assets/svg/arrow-right.svg';
import CommonUtils from '@src/util/CommonUtils';

export const createColumns = ({ t, trade = {}, onChange, isRowExpanded, onExpandToggle, location }) => [
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
        <Link
          className="MCP-table-link"
          aria-label={t('labels.therapyDescription')}
          to={`?trade=${tradeName}`}
          state={{ fromTab: location?.state?.fromTab, fromOrderView: location?.state?.fromOrderView }}>
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
    cell: ({ isExpandable, genericName }) => {
      let toolTip = '',
        cellValue = '';
      if (isExpandable) {
        toolTip = genericName.join(', ');
        cellValue = CommonUtils.getListOverflowingDisplayLabel(genericName, 2);
      } else {
        toolTip = genericName;
        cellValue = genericName;
      }
      return cellValue ? (
        <span aria-label={t('labels.genericName')}>
          <Tooltip body={toolTip}>{cellValue}</Tooltip>
        </span>
      ) : (
        '-'
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
    cell: ({ isExpandable, ndc }) => {
      let toolTip = '',
        cellValue = '';
      if (isExpandable) {
        toolTip = ndc.join(', ');
        cellValue = CommonUtils.getListOverflowingDisplayLabel(ndc, 2);
      } else {
        toolTip = ndc;
        cellValue = ndc;
      }
      return (
        <span aria-label={t('table.columns.captions.nationalDrugCode')}>
          <Tooltip body={toolTip}>{cellValue}</Tooltip>
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
    cell: ({ isExpandable, manufacturer }) => {
      let toolTip = '',
        cellValue = '';
      if (isExpandable) {
        toolTip = manufacturer.join(', ');
        cellValue = CommonUtils.getListOverflowingDisplayLabel(manufacturer, 2);
      } else {
        toolTip = manufacturer;
        cellValue = manufacturer;
      }
      return cellValue ? (
        <span aria-label={t('table.columns.captions.manufacturer')}>
          <Tooltip body={toolTip}>{cellValue}</Tooltip>
        </span>
      ) : (
        '-'
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
