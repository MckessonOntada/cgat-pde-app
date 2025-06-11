import React from 'react';
import { Loader } from '@mckesson/mcp-component-library';
import './EmptyTable.scss';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';

const EmptyDataTable = ({ image, heading, description, isLoading = false, error = null }) => {
  const { t } = useTranslate();
  if (isLoading) {
    return (
      <div style={{ minHeight: '381px' }} className="dashboard-loader">
        <Loader variant="circular" />
      </div>
    );
  }

  if (error) {
    const errorMessage = CommonUtils.isNonEmptyString(error?.response?.data?.message) ? error.response.data.message.toLowerCase() : '';
    return (
      <div className="emptyDataTableContainer">
        <img src={image} alt="No Data" className="emptyDataTableImage" />
        <h2 className="emptyDataTableHeading"> Error</h2>
        <p className="emptyDataTableDescription">{errorMessage.includes('date range') ? t('errors.messages.dateRange') : t('errors.messages.default')}</p>
      </div>
    );
  }

  return (
    <div className="emptyDataTableContainer">
      <img src={image} alt="No Data" className="emptyDataTableImage" />
      <h2 className="emptyDataTableHeading">{heading ? heading : t('errors.messages.noRecords')}</h2>
      <p className="emptyDataTableDescription">{description}</p>
    </div>
  );
};

export default EmptyDataTable;
