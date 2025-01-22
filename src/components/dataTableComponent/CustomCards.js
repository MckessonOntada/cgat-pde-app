import React, { useState } from 'react';
import './assets/CustomCards.scss';
import CommonUtils from '@src/util/CommonUtils';

function CustomCard({ columns, row }) {
  const showDefaultData = columns.filter((col) => !!col.showInMobileHeader && !col.isAction);
  const hiddenData = columns.filter((col) => !col.showInMobileHeader);
  const actionItems = columns.filter((col) => col.isAction);

  const [expanded, setExpanded] = useState(showDefaultData.length === 0);

  const handleCardClick = (e) => {
    e.preventDefault();
    if (hiddenData.length === 0 || showDefaultData.length === 0) {
      return;
    }
    setExpanded(!expanded);
  };

  const handleActionClick = (e, onClick) => {
    e.stopPropagation();
    if (onClick) {
      onClick(row);
    }
  };

  const renderCell = (col, row) => {
    return !!col.cell && typeof col.cell === 'function'
      ? col.cell(row)
      : !!col.selector
      ? typeof col.selector === 'function'
        ? col.selector(row)
        : row[col.selector]
      : row[col.id];
  };

  return (
    <div className="card-container" key={row.id} onClick={handleCardClick}>
      {(showDefaultData.length > 0 || actionItems.length > 0) && (
        <div className="card-header">
          <div>
            {showDefaultData.map((col) => (
              <div key={col.id} className="collapsed-detail" onClick={(e) => handleActionClick(e, col.onClick)}>
                {col.showColumnNameInHeader && col.name && `${col.name}: `}
                {renderCell(col, row)}
              </div>
            ))}
          </div>
          <div className="collapsed-detail action-button">
            {actionItems.map((col) => (
              <div onClick={(e) => handleActionClick(e, col.onClick)}>{renderCell(col, row)}</div>
            ))}
          </div>
        </div>
      )}
      {(expanded || showDefaultData.length === 0) && (
        <div className="card-details">
          {hiddenData.map((col) => (
            <div key={col.id} className="expanded-detail">
              {col.name && <div className="expanded-detail-content-key">{col.name}</div>}
              <div className="expanded-detail-content-value" onClick={(e) => handleActionClick(e, col.onClick)}>
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
