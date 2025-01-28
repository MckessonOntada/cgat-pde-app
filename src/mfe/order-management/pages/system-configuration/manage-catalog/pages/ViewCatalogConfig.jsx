import React, { useEffect } from 'react';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { Heading, Button } from '@mckesson/mcp-component-library';
import ViewConfiguration from './viewConfiguration/ViewConfiguration';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

function ViewCatalogConfig(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { configSteps } = state;

  console.log('locaton details...', location);

  return (
    <div className="view-details-container">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => navigate(-1)} size="md">
          BACK TO MANAGE CATALOG
        </Button>
      </div>
      <Heading>Catalog Configuration</Heading>
      <ViewConfiguration steps={configSteps.steps} />
    </div>
  );
}
export default ViewCatalogConfig;
