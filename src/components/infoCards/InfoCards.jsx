import React from 'react';
import { Tooltip } from '@mckesson/mcp-component-library';
import { ReactComponent as IconInfo } from '@src/assets/svg/info.svg';
import './assets/styles/InfoCards.scss';

const InfoCards = ({ title, value = '', infoText }) => {
  return (
    <div className="info-card">
      <div className="card-header">
        <div className="info-title">{title}</div>
        {infoText && (
          <div className="info-icon">
            <Tooltip body={infoText} key={'textarea-tooltip-' + title} placement="top" maxW={'280px'}>
              <div type="button" aria-label="information">
                <IconInfo />
              </div>
            </Tooltip>
          </div>
        )}
      </div>
      <div className="card-value">
        {value?.startsWith('$') ? (
          <div>
            <span className="currencySymbol">$</span>
            {value.slice(1)}
          </div>
        ) : (
          value || 'NA'
        )}
      </div>
    </div>
  );
};

InfoCards.propTypes = {};
export default InfoCards;
