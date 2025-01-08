import React from 'react';
import './detailMetrics.scss';
import InfoCards from '@src/components/infoCards/InfoCards';

/*
Providing the key values in the required JSON Object format, 
The component will render the key values and automatically adjust grid based on the screen size 
*/

function DetailMetrics({ data }) {
  return (
    <div className="bill-amount-wrapper">
      {data &&
        Object.entries(data)?.map(([key, value]) => (
          <div className="bill-amount-container">
            {/* <div className="label">{key}</div>
            <div className="value">{value}</div> */}
            <InfoCards title={key} value={value} />
          </div>
        ))}
    </div>
  );
}

export default DetailMetrics;
