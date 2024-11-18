import React from 'react';
import './EmptyDataTable.scss';

const EmptyDataTable = ({ image, heading, description }) => {
  return (
    <div className="emptyDataTableContainer">
      <img src={image} alt="No Data" className="emptyDataTableImage" />

      <h2 className="emptyDataTableHeading">{heading}</h2>

      <p className="emptyDataTableDescription">{description}</p>
    </div>
  );
};

export default EmptyDataTable;
