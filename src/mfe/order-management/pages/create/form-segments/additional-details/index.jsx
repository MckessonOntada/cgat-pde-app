import React from 'react';
import { Button, Stepper } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate, useParams } from 'react-router-dom';
import { FormList } from '../Constants';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import ModuleHeader from '../../../../../../components/module-header';

function AdditionalDetails() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const handleOnBackButtonClick = () => {
    //compare data change, display modal for confirmation
    navigate(`../${orderId}/patient`);
  };

  const handleOnSubmit = () => {
    navigate(`../${orderId}/summary`);
  };

  const handleOnBack = () => {
    //compare data change, display modal for confirmation
    navigate('/orders');
  };

  const forms = FormList(t);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackButtonClick} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={t('headings.createNewOrder')} />

      <div className="MCP-module-body">
        <Stepper activeIndex={4} dividerText="of" mobileLabel={t('labels.steps')} stepHeaders={forms.map((f) => ({ label: f.label }))} />
        <div>Addition details form content</div>
        <ModuleHeader
          controls={
            <div className="controls">
              <Button size="md" variant="secondary" onClick={handleOnBack}>
                {t('captions.btnBack')}
              </Button>
              <Button size="md" variant="primary" onClick={handleOnSubmit} type="submit">
                {t('captions.btnSaveAndContinue')}
              </Button>
            </div>
          }
        />
      </div>
    </div>
  );
}
export default AdditionalDetails;
