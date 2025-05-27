import React from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import { ReactComponent as IconClose } from '@src/assets/svg/cross.svg';
import { Heading, Button } from '@mckesson/mcp-component-library';
import { useMutation, useQuery } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { authToken, httpVerb } from '@src/api/HttpResourceService';
import { useNavigate } from 'react-router-dom';
import useSnackbar from '@src/hooks/useSnackbar';
import { useTranslate } from '@src/translations/useTranslation';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';
import { PREVIEW_URL } from '@src/mfe/core-config/system-admin/manage-questionnaire/constants';
import { getAddress } from '@src/mfe/core-config/system-admin/manage-questionnaire/util';
import { useOrgAccountSelectionContext } from '@src/mfe/core-config/system-admin/manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';
import { renderModal } from '@src/util/ModalUtil';
import AuthUtils from '@src/util/AuthUtils';

export const AccountDetailsConstants = [
  {
    sectionHeading: 'Details',
    sectionData: [
      { label: 'accountNumber', value: 'accountNumber' },
      { label: 'accountName', value: 'accountName' },
      { label: 'salesOrg', value: 'salesOrg' },
      { label: 'address', value: 'address' },
      { label: 'CGATIdentifier', value: 'cgatIdentifier' }
    ]
  }
];

function AccountDetails({ openDetails, setOpenDetails, viewAccount, setViewAccount, isLinkedAccount }) {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { showSnackbar } = useSnackbar();
  const { selectedOrganization } = useOrgAccountSelectionContext();
  const isCustomerCenter = AuthUtils.isCustomerCenter();

  const handleCloseDrawer = () => {
    setOpenDetails((state) => !state);
  };

  const practiceId = !isLinkedAccount ? selectedOrganization?.id : AuthUtils.getPracticeId();
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ['Account', viewAccount?.id],
    queryFn: async () => {
      const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/accounts/configuration/${viewAccount.id}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      return res.data;
    },
    enabled: !!viewAccount && viewAccount?.id ? true : false,
    refetchOnWindowFocus: false
  });

  const OnDeleteClick = (id) => {
    const payload = {
      questionnaireId: id,
      accountNumber: viewAccount.accountNumber,
      channelType: viewAccount.channelType
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

  const { mutate: delinkQuestionnaire, isLoading: isDelinkLoading } = useMutation(
    async (payload) => {
      await QuestionnaireService.deLinkConfigureQuestionnaire('Account', payload);
    },
    {
      onSuccess: (response) => {
        refetch();
      },
      onError: (error) => {
        showSnackbar({ description: t('ManageAccount.delink.error'), type: 'error' });
      }
    }
  );

  return (
    <React.Fragment>
      {data && (
        <FloatingDrawer open={openDetails} anchor="right" onClose={handleCloseDrawer} heading={t('ManageAccount.accountDetails')}>
          <div className="details-main-wrapper">
            <div className={'details-body'}>
              {AccountDetailsConstants.map((item, index) => (
                <React.Fragment key={item.sectionHeading}>
                  <Heading as="h3">{t(`ManageCatalog.${item.sectionHeading}`)}</Heading>
                  <div className="details-ul">
                    {item.sectionData.map((sectionItem, sectionIndex) => {
                      let value = data?.account[sectionItem.value] || '-';
                      if (sectionItem.value === 'address') {
                        value = getAddress(data?.account.address);
                      }
                      return (
                        <div key={sectionItem.label} className="details-li">
                          <div className="details-key">{t(`ManageAccount.${sectionItem.label}`)}</div>
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
                    <div className="Questionnaire-key">{t('ManageAccount.questionnaireConfiguration')}</div>
                    <div className="Questionnaire-value">
                      <div
                        onClick={() =>
                          navigate(isLinkedAccount ? '../../../admin/linked-accounts/questionnaire' : PREVIEW_URL, {
                            state: { isAccount: true, questionnaire: data?.questionnaireList }
                          })
                        }>
                        {t('ManageCatalog.Preview')}
                      </div>
                    </div>
                  </div>
                  <div className="Questionnairedetails-ul">
                    {data?.questionnaireList.map((item, index) => {
                      return (
                        <div key={item.templateName} className="Questionnairedetails-li">
                          <div className="Questionnairedetails-key">{item.templateName}</div>
                          {!isCustomerCenter && !isLinkedAccount && (
                            <div className="delete-button" onClick={() => OnDeleteClick(item.id)}>
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
export default AccountDetails;
