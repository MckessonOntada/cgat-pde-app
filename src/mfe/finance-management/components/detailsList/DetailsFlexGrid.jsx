import React from 'react';
import './detailsFlexGrid.scss';

/*
Providing the key values in the required JSON Object format, 
The component will render the key values and automatically adjust grid based on the screen size 
*/
function DetailsFlexGrid({ invoiceDetails }) {
  return (
    <div className="details-wrapper">
      {invoiceDetails &&
        Object.entries(invoiceDetails)?.map(([key, value], index) => (
          <div key={key} className={`element-row ${index % 2 == 0 ? `left-column` : `right-column`}`}>
            <div className="list-item">
              <div className="label">{key}</div>
              <div className="value">{value || '-'}</div>
            </div>
            {!(Object.values(invoiceDetails).length === index + 1) && <div className="border-separator"></div>}
          </div>
        ))}
    </div>
  );
}
export default DetailsFlexGrid;
