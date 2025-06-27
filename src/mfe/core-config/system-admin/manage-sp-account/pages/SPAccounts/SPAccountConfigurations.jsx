import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import { Heading, Button } from '@mckesson/mcp-component-library';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import { useMutation } from 'react-query';
import { renderModal } from '@src/util/ModalUtil';
import './index.scss';
import { useOrgAccountSelectionContext } from '@src/mfe/core-config/system-admin/manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import { PREVIEW_URL } from '../../../manage-questionnaire/constants';
import Alert from '@src/components/cgat-alert/Alert';

function SPAccountConfigurations({ data, refetch, orgAdmin }) {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { selectedOrganization } = useOrgAccountSelectionContext();
  const [alert, setAlert] = useState(null);

  const OnDeleteClick = (id) => {
    const payload = {
      questionnaireId: id,
      accountNumber: data.account.accountNumber,
      channelType: CHANNEL_TYPE.SPECIALTY_PHARMA
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
        setAlert({
          type: 'success',
          message: t('ManageAccount.delink.success')
        });
        refetch();
      },
      onError: (error) => {
        setAlert({
          type: 'error',
          message: t('errors.default')
        });
      }
    }
  );

  const showAlert = (type, message) => {
    setAlert({ type: type, message: message });
  };

  const handleAlertClose = () => {
    setAlert({ type: null, message: null });
  };

  return (
    <div>
      <div className="MCP-module-body">
        <ModuleHeader
          heading={
            <div className="subheader-text">
              <Heading as="h2">{t('labels.therapy.configuration')}</Heading>
            </div>
          }
          controls={
            <Button
              variant="secondary"
              className="button-icon"
              size="md"
              onClick={() =>
                orgAdmin
                  ? navigate('../../../admin/linked-accounts/questionnaire', { state: { questionnaire: data?.questionnaireList, isLinkedAccounts: true } })
                  : navigate(PREVIEW_URL, { state: { isSPAccount: true, questionnaire: data?.questionnaireList } })
              }>
              {t('manageSPMaterial.drawer.details.configuration.actions.preview')}
            </Button>
          }
        />
        {alert && alert.type && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} />}

        <div className="MCP-CardContainer">
          <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2">
            {data?.questionnaireList?.map((item, index) => (
              <div key={index} className="labelWrap">
                <div className="view_label">{item.templateName}</div>
                {!orgAdmin && (
                  <div className="delete-buttonwithText" onClick={() => OnDeleteClick(item.id)}>
                    <DeleteIcon className="delete-button-icon" />
                    {t('paymentInvoices.reviewPayments.remove')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SPAccountConfigurations;
