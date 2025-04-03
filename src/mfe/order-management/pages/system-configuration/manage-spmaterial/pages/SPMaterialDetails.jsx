import React, { useEffect, useState } from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import { ReactComponent as IconClose } from '@src/assets/svg/cross.svg';
import { Loader, Heading, Button } from '@mckesson/mcp-component-library';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useNavigate } from 'react-router-dom';
import useSnackbar from '@src/hooks/useSnackbar';
import { useTranslate } from '@src/translations/useTranslation';
import { PREVIEW_URL, ROUTE_CONFIG } from '@src/mfe/order-management/questionnaire/constants';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';
import { renderModal } from '@src/util/ModalUtil';
import usePermission from '@src/hooks/usePermissions';
import AuthUtils from '@src/util/AuthUtils';
import '../manageSPMaterial.scss';

export const SPMaterialDetailsConstants = [
  {
    sectionHeading: 'Details',
    sectionData: [
      { label: 'id', value: 'id' },
      { label: 'productName', value: 'productName' },
      { label: 'siteName', value: 'siteName' },
      { label: 'systemQuant', value: 'systemQuant' },
      { label: 'NDC', value: 'ndc' }
    ]
  }
];

function SPMaterialDetails({ openSPMaterialDetails, setOpenSPMaterialDetails, viewSPMaterial, setViewSPMaterial }) {
  const { t } = useTranslate();

  const handleCloseDrawer = () => {
    setOpenSPMaterialDetails((state) => !state);
  };

  return (
    <FloatingDrawer open={openSPMaterialDetails} anchor="right" onClose={handleCloseDrawer} heading={t('manageSPMaterial.drawer.heading')}>
      <div className="details-main-wrapper">
        <div className={'details-body'}>
          {SPMaterialDetailsConstants.map((item, index) => (
            <React.Fragment>
              <div className="styled-heading">
                <Heading as="h4">{t(`manageSPMaterial.drawer.${item.sectionHeading}`)}</Heading>
              </div>
              <div className="details-ul">
                {item.sectionData.map((item, index) => (
                  <div className="details-li">
                    <div className="details-key">{t(`manageSPMaterial.drawer.details.body.${item.label}`)}</div>
                    <div className="details-value">{'-'}</div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </FloatingDrawer>
  );
}
export default SPMaterialDetails;
