import React from 'react';
import { Button, AutoSuggestDropdown } from '@mckesson/mcp-component-library';
import useWindowSize from '@src/hooks/UseWindowSize';

export default function RecordDetails(props) {
  const windowSize = useWindowSize();
  const isMobileView = windowSize.width < 768;
  const buttonSize = isMobileView ? 'md' : 'lg';
  return (
    <React.Fragment>
      <div className="card-container">
        <div className="account-info">
          <div className="account-name">Revisions Aesthetics Group</div>
          <div className="account-address">6567 S Elizabeth Way, Centennial, CO, 80121</div>
        </div>
        <div className="account-search">
          <div className="search-form">
            <AutoSuggestDropdown size={'lg'} eregVariant={true} />
          </div>
          <div className="search-form-actions">
            <Button className="apply-button" variant={'secondary'} size={buttonSize}>
              APPLY
            </Button>
            <Button className="set-as-default-button" variant={'secondary'} size={buttonSize}>
              SET AS DEFAULT
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
