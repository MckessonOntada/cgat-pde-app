import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import { useMutation } from 'react-query';
import { renderModal } from '@src/util/ModalUtil';
import './index.scss';
import { useOrgAccountSelectionContext } from '@src/mfe/order-management/components/orgAccountSelection/context/OrgAccountSelectionContext';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';
import { PREVIEW_URL } from '@src/mfe/order-management/questionnaire/constants';

function SPAccountConfigurations({ data, refetch }) {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { selectedOrganization } = useOrgAccountSelectionContext();
  const [alert, setAlert] = useState(null);

  const OnDeleteClick = (id) => {
    const payload = {
      questionnaireId: id,
      accountNumber: data.account.accountNumber
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
          message: t('ManageAccount.delink.error')
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
  console.log('data?.questionnaireList?.length', data?.questionnaireList?.length);
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
              onClick={() => navigate(PREVIEW_URL, { state: { isSPAccount: true, questionnaire: data?.questionnaireList } })}>
              {t('manageSPMaterial.drawer.details.configuration.actions.preview')}
            </Button>
          }
        />
        {alert && alert.type && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />}

        <div className="MCP-CardContainer">
          <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2">
            {data?.questionnaireList?.map((item, index) => (
              <div key={index} className="labelWrap">
                <div className="view_label">{item.templateName}</div>
                <div className="delete-buttonwithText" onClick={() => OnDeleteClick(item.id)}>
                  <DeleteIcon className="delete-button-icon" />
                  {t('paymentInvoices.reviewPayments.remove')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SPAccountConfigurations;
