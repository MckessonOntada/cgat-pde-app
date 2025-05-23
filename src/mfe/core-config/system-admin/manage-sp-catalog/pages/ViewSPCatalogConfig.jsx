import React from 'react';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { Heading, Button } from '@mckesson/mcp-component-library';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import ViewConfiguration from '../../manage-catalog/pages/viewConfiguration/ViewConfiguration';

function ViewSPCatalogConfig(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslate();
  const { state } = location;
  const { configSteps } = state;
  return (
    <div className="view-details-container">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => navigate(-1)} size="md">
          {t('SPCatalog.btnBack')}
        </Button>
      </div>
      <Heading>{t('SPCatalog.CatalogConfiguration')}</Heading>
      <ViewConfiguration steps={configSteps.steps} />
    </div>
  );
}
export default ViewSPCatalogConfig;
