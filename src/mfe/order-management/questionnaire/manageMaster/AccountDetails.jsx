import React, { useEffect, useState } from 'react';
import FloatingDrawer from '@src/components/floating-drawer';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import {  Heading } from '@mckesson/mcp-component-library';
import { useMutation, useQuery } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useNavigate } from 'react-router-dom';
import useSnackbar from '@src/hooks/useSnackbar';
import { useTranslate } from '@src/translations/useTranslation';
import { useOrgAccountSelectionContext } from '../../components/orgAccountSelection/context/OrgAccountSelectionContext';
import { getAddress } from '../util';
import { PREVIEW_URL } from '../constants';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';

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

function AccountDetails({ openDetails, setOpenDetails, viewAccount, setViewAccount, showAlert }) {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { showSnackbar } = useSnackbar();
  const { selectedOrganization, setSelectedOrganization } = useOrgAccountSelectionContext();
  const handleCloseDrawer = () => {
    setOpenDetails((state) => !state);
  };

  const practiceId = selectedOrganization?.id;
  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: [`configuration`],
    queryFn: async () => {
      const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/accounts/configuration/${viewAccount.id}`;
      console.log('url', url);
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      return res.data;
    },

    refetchOnWindowFocus: false
  });

  const OnDeleteClick = (id) => {
    const payload = {
      questionnaireId: id,
      accountNumber: viewAccount.accountNumber
    };
    delinkQuestionnaire(payload);
  };

  const { mutate: delinkQuestionnaire, isLoading: isDelinkLoading } = useMutation(
    async (payload) => {
      await QuestionnaireService.deLinkConfigureQuestionnaire('Account', payload);
    },
    {
      onSuccess: (response) => { 
        showSnackbar({ description: t('ManageAccount.delink.success'), type: 'success' });
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
        <FloatingDrawer open={openDetails} anchor="right" onClose={handleCloseDrawer}>
          <div className="details-main-wrapper">
            <div className="header">
              <Heading as="h2">{t('ManageAccount.accountDetails')}</Heading>
              <button onClick={handleCloseDrawer}>
                <IconClose />
              </button>
            </div>
            <div className={'details-body'}>
              {AccountDetailsConstants.map((item, index) => (
                <React.Fragment>
                   <Heading as="h3">{t(`ManageCatalog.${item.sectionHeading}`)}</Heading>
                  <div className="details-ul">
                    {item.sectionData.map((sectionItem, sectionIndex) => {
                      let value = data?.account[sectionItem.value] || '-';
                      if (sectionItem.value === 'address') {
                        value = getAddress(data?.account.address);
                      }
                      return (
                        <div key={sectionIndex} className="details-li">
                          <div className="details-key">{t(`ManageAccount.${sectionItem.label}`)}</div>
                          <div className="details-value">{value}</div>
                        </div>
                      );
                    })}
                  </div>
                </React.Fragment>
              ))}
              {data?.accountConfiguration && (
                <div className="configure-li">
                  <div className="details-key">{t('ManageAccount.Configurations')}</div>
                  <div className="details-value">
                    <div onClick={() => navigate('view-catalog', { state: { configSteps: data?.accountConfiguration } })}>
                      t('ManageAccount.Preview')
                    </div>
                    <div onClick={() => deleteConfiguration()}>
                      <DeleteIcon />
                    </div>
                  </div>
                </div>
              )}
              {data?.questionnaireList?.length > 0 && (
                <>
                  <div className="Questionnaire-li">
                    <div className="Questionnaire-key">{t('ManageAccount.questionnaireConfiguration')}</div>
                    <div className="Questionnaire-value">
                      <div onClick={() => navigate(PREVIEW_URL, { state: { isAccount: true } })}>{t('ManageCatalog.Preview')}</div>
                    </div>
                  </div>
                  <div className="Questionnairedetails-ul">
                    {data?.questionnaireList.map((item, index) => {
                      return (
                        <div key={index} className="Questionnairedetails-li">
                          <div className="Questionnairedetails-key">{item.templateName}</div>
                          <div className="delete-button" onClick={() => OnDeleteClick(item.id)}>
                            <DeleteIcon />
                          </div>
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
