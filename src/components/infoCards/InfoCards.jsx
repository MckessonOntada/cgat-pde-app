import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mckesson/mcp-component-library';
import { ReactComponent as IconInfo } from '@src/assets/svg/info.svg';
import './assets/styles/InfoCards.scss';

const InfoCards = ({ title, value, infoText }) => {
  return (
    <div className="info-card">
      <div className="card-header">
        <div className="info-title">{title}</div>
        <div className="info-icon">
          <Tooltip body={infoText}>
            <IconInfo style={{ width: '18px', height: '18px' }} />
          </Tooltip>
        </div>
      </div>
      <div className="card-value">{value}</div>
    </div>
  );
};

InfoCards.propTypes = {};

export default InfoCards;
