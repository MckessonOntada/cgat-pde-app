import React from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { Loader, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import '../manageSPMaterial.scss';
import { useMutation, useQuery } from 'react-query';
import MaterialService from '@src/api/commonService/MaterialService';
import AuthUtils from '@src/util/AuthUtils';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';

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
  const isCustomerCenter = AuthUtils.isCustomerCenter();

  const requestParams = {
    channelType: 'SPECIALITY_PHARMA'
  };
  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'SPMaterial',
      viewSPMaterial?.sapMaterial || viewSPMaterial?.spProductId
    ],
    queryFn: async () => {
      const result = await MaterialService.getSPMaterialById(
        viewSPMaterial?.sapMaterial || viewSPMaterial?.spProductId,
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
  const OnDeleteClick = (id) => {
    const payload = {
      questionnaireId: id,
      accountNumber: viewAccount.accountNumber
    };
    renderModal({
      title: t('messages.header.confirmation'),
      bodyContent: (
        <div className="MCP-modal-body">
          <p>{t('messages.confirmation.delink')}</p>
        </div>
      ),
      footerActions: {
        cancel: {
          label: t('label.no')
        },
        confirm: {
          label: t('label.yes'),
          action: () => {
            delinkQuestionnaire(payload);
          }
        }
      }
    });
  };

  const { mutate: delinkQuestionnaire, isLoading: isDelinkLoading } =
    useMutation(
      async (payload) => {
        await QuestionnaireService.deLinkConfigureQuestionnaire(
          'Material',
          payload
        );
      },
      {
        onSuccess: (response) => {
          refetch();
        },
        onError: (error) => {
          showSnackbar({
            description: t('manageMaterial.delink.error'),
            type: 'error'
          });
        }
      }
    );

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

              {data?.questionnaireList?.length > 0 && (
                <>
                  <div className="Questionnaire-li">
                    <div className="Questionnaire-key">
                      {t('ManageAccount.questionnaireConfiguration')}
                    </div>
                    <div className="Questionnaire-value">
                      <div
                        onClick={() =>
                          navigate(PREVIEW_URL, {
                            state: {
                              isAccount: true,
                              questionnaire: data?.questionnaireList
                            }
                          })
                        }>
                        {t('ManageCatalog.Preview')}
                      </div>
                    </div>
                  </div>
                  <div className="Questionnairedetails-ul">
                    {data?.questionnaireList.map((item, index) => {
                      return (
                        <div key={index} className="Questionnairedetails-li">
                          <div className="Questionnairedetails-key">
                            {item.templateName}
                          </div>
                          {!isCustomerCenter && (
                            <div
                              className="delete-button"
                              onClick={() => OnDeleteClick(item.id)}>
                              <DeleteIcon />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </FloatingDrawer>
      )}
    </React.Fragment>
  );
}
export default SPMaterialDetails;
