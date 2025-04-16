import React from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { Loader, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import '../manageSPMaterial.scss';
import { useQuery } from 'react-query';
import MaterialService from '@src/api/commonService/MaterialService';

export const SPMaterialDetailsConstants = [
  {
    sectionHeading: 'Details',
    sectionData: [
      { label: 'id', value: 'materialNumber' },
      { label: 'productName', value: 'materialDescription' },
      { label: 'siteName', value: 'siteName' },
      { label: 'NDC', value: 'ndcNumber' }
    ]
  }
];

function SPMaterialDetails({
  openSPMaterialDetails,
  setOpenSPMaterialDetails,
  viewSPMaterial
}) {
  const { t } = useTranslate();
  const requestParams = {
    channelType: 'SPECIALITY_PHARMA'
  };
  const { isLoading, isError, data } = useQuery({
    queryKey: ['SPMaterial', viewSPMaterial?.materialNumber],
    queryFn: async () => {
      const result = await MaterialService.getSPMaterialById(
        viewSPMaterial?.materialNumber,
        requestParams
      );
      return result;
    },
    enabled: !!viewSPMaterial && viewSPMaterial?.id ? true : false,
    refetchOnWindowFocus: false
  });

  const handleCloseDrawer = () => {
    setOpenSPMaterialDetails((state) => !state);
  };

  if (isLoading) {
    return <Loader type={'screen'} />;
  }
  return (
    <React.Fragment>
      {data && (
        <FloatingDrawer
          open={openSPMaterialDetails}
          anchor="right"
          onClose={handleCloseDrawer}
          heading={t('manageSPMaterial.drawer.heading')}>
          <div className="details-main-wrapper">
            <div className={'details-body'}>
              {SPMaterialDetailsConstants.map((item, index) => (
                <React.Fragment>
                  <div className="styled-heading">
                    <Heading as="h4">
                      {t(`manageSPMaterial.drawer.${item.sectionHeading}`)}
                    </Heading>
                  </div>
                  <div className="details-ul">
                    {item.sectionData.map((item, index) => {
                      let value = data?.therapy[item.value] || '-';
                      return (
                        <div className="details-li">
                          <div className="details-key">
                            {t(
                              `manageSPMaterial.drawer.details.body.${item.label}`
                            )}
                          </div>
                          <div className="details-value">{value}</div>
                        </div>
                      );
                    })}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </FloatingDrawer>
      )}
    </React.Fragment>
  );
}
export default SPMaterialDetails;
