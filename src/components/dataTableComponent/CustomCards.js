import React, { useMemo, useState } from 'react';
import './assets/CustomCards.scss';
import CommonUtils from '@src/util/CommonUtils';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';
import { MenuList } from '@mckesson/mcp-component-library';
import { isEqual } from './assets/DataTableCutomStyle';

/*
defaultExpandedCardView - card will be expanded by default
  (if defaultExpandedCardView = true, Expanded by default)
  (if defaultExpandedCardView = false, Collapsed by default)
*/

/*
collapsibleCardView -- A user input that card can be expand and  collapse 
  (if collapsibleCardView = true, expandable or collapsible)
  (if collapsibleCardView = false, can not be expandable or collapsible)
*/

/**
 * isContextMenu - if "false" renders the cell inside Context menu.
 * isSelectable - if true the column will render on the top of the card. (Can be provided for checkbox, radio as first column)
 * cardHeader - if "true" the column will be moved to first index of default Data, Beside the expand collapse Button.
 */

function CustomCard({ columns, row, defaultExpandedCardView = true, collapsibleCardView = true, rowIndex, selectedData = [] }) {
  const isSelectableInput = columns.filter((col) => !!col.isSelectable);
  const showDefaultData = columns
    .filter((col) => !!col.showInMobileHeader && !col.isAction && !col.omit && !col.isSelectable)
    .sort((a, b) => (a.cardHeader ? -1 : b.cardHeader ? 1 : 0));
  const hiddenData = columns.filter((col) => !col.showInMobileHeader && !col.isAction && !col.omit);
  const actionItems = columns.filter((col) => col.isAction && !col.omit && !col.omit);

  const [expanded, setExpanded] = useState(defaultExpandedCardView || showDefaultData.length === 0);

  const handleCardClick = (e) => {
    e.preventDefault();
    if (hiddenData.length === 0 || showDefaultData.length === 0) {
      return;
    }
    collapsibleCardView && setExpanded(!expanded);
  };

  const handleActionClick = (e, onClick) => {
    e.stopPropagation();
    if (onClick) {
      onClick(row);
    }
  };

  const renderCell = (col, row) => {
    return !!col.cell && typeof col.cell === 'function'
      ? col.cell(row, rowIndex)
      : !!col.selector
      ? typeof col.selector === 'function'
        ? col.selector(row)
        : row[col.selector]
      : row[col.id];
  };

  const renderExpandIcon = (colIndex) => {
    return colIndex === 0 /* && showDefaultData.length + hiddenData.length > 4 */ ? (
      <button type="button" onClick={() => {}} className="expand-collapse-toggle">
        <img src={expanded ? arrow_down : arrow_right} alt="toggle-icon" />
      </button>
    ) : (
      <></>
    );
  };
  console.log('row...', row);
  const selectedCard = useMemo(() => {
    return selectedData.some((record) => isEqual(record, row));
  }, [row, selectedData]);

  return (
    <div className={`table-card-container ${selectedCard ? `active` : ``}`} key={row.id} onClick={handleCardClick}>
      {isSelectableInput.length > 0 && (
        <div className="card-header">
          <div style={{ width: '100%' }}>
            {isSelectableInput.map((col) => (
              <div key={col.id} className="collapsed-detail" style={col.mobileStyles}>
                <div onClick={(e) => handleActionClick(e, col.onClick)}> {renderCell(col, row)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(showDefaultData.length > 0 || actionItems.length > 0) && (
        <div className="card-header">
          <div className="default-data-container" style={{ width: '100%' }}>
            {showDefaultData.map((col, colIndex) => (
              <div key={col.id} className="collapsed-detail" style={col.mobileStyles}>
                {renderExpandIcon(colIndex)}
                {col.showColumnNameInHeader && col.name && <div>{col.name}-</div>}
                <div
                  onClick={(e) => handleActionClick(e, col.onClick)}
                  className={`default-data-Value ${colIndex === 0 ? `card-main-header` : ``}`}>
                  {renderCell(col, row)}
                </div>
              </div>
            ))}
          </div>
          <div className="collapsed-detail action-button">
            {actionItems.map((col) =>
              !!col.isContextMenu ? (
                <div onClick={(e) => handleActionClick(e, col.onClick)}>{renderCell(col, row)}</div>
              ) : (
                <MenuList
                  menuIcon={<IconEllipsis key={'menu-list-order-table'} />}
                  handleSelect={() => {}}
                  options={[{ label: renderCell(col, row) }]}
                  aria-label="Order options"
                />
              )
            )}
          </div>
        </div>
      )}
      {(expanded || showDefaultData.length === 0) && (
        <div className="card-details">
          {hiddenData.map((col) => (
            <div key={col.id} className="expanded-detail">
              {col.name && <div className="expanded-detail-content-key">{col.name}</div>}
              <div className="expanded-detail-content-value" style={col.mobileStyles} onClick={(e) => handleActionClick(e, col.onClick)}>
                {renderCell(col, row)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomCard;
