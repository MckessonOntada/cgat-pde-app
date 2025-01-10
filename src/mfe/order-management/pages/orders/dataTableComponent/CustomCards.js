import React, { useState } from 'react';
import './assets/CustomCards.scss';

function CustomCard({ columns, row }) {
  const showDefaultData = columns.filter((col) => !!col.showByDefault && !(col.type === 'action' || col.id?.toLowerCase() === 'action'));
  const hiddenData = columns.filter((col) => !col.showByDefault);
  const actionItems = columns.filter((col) => col.type === 'action' || col.id?.toLowerCase() === 'action');

  const [expanded, setExpanded] = useState(false);

  const handleCardClick = (e) => {
    e.preventDefault();
    setExpanded(!expanded);
  };

  return (
    <div className="card-container" key={row.id} onClick={handleCardClick}>
      <div className="accordion-card">
        <div className="card-header">
          <div>
            {showDefaultData.map((col) => (
              <div key={col.id} className="collapsed-detail">
                {!!col.showDefaultLabel ? `${col.showDefaultLabel}: ` : ''}
                {col.cell ? col.cell(row) : col.selector(row) || row[col.id]}
              </div>
            ))}
          </div>
          <div className="collapsed-detail">{actionItems.map((col) => (col.cell ? col.cell(row) : col.selector(row) || row[col.id]))}</div>
        </div>
        {expanded && (
          <div className="card-details">
            {hiddenData.map((col) => (
              <div key={col.id} className="expanded-detail">
                <strong>{col.name}: </strong>
                {col.cell ? col.cell(row) : col.selector(row) || row[col.id]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomCard;
