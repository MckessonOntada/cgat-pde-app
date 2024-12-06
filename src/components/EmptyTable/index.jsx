import React from 'react';
import { Loader } from '@mckesson/mcp-component-library';
import './EmptyTable.scss';

const EmptyDataTable = ({ image, heading, description, isLoading = false, error = null }) => {
  if (isLoading) {
    return (
      <div className="dashboard-loader">
        <Loader variant="circular" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="emptyDataTableContainer">
        <img src={image} alt="No Data" className="emptyDataTableImage" />
        <h2 className="emptyDataTableHeading">Error</h2>
        <p className="emptyDataTableDescription">{error}</p>
      </div>
    );
  }

  return (
    <div className="emptyDataTableContainer">
      <img src={image} alt="No Data" className="emptyDataTableImage" />
      <h2 className="emptyDataTableHeading">{heading}</h2>
      <p className="emptyDataTableDescription">{description}</p>
    </div>
  );
};

export default EmptyDataTable;
