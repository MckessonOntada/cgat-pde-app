import React from 'react';
import ModuleHeader from '../module-header';
import { Heading, Button, IconButton } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as EditIcon } from '@src/assets/svg/edit-icon.svg';
import './profile.scss';
import AuthUtils from '@src/util/AuthUtils';
import CommonDataService from '@src/api/commonService/CommonDataService';
import { useMutation } from 'react-query';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import Alert from '../cgat-alert/Alert';

const AccountSetting = () => {
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const userName = AuthUtils.getUserName();
  const { items: notifications, add: addNotification, remove: removeNotification } = useTimedArray(10000);

  const { mutate: resetPassword } = useMutation(
    async () => {
      return await CommonDataService.resetPassword();
    },
    {
      onSuccess: () => {
        onSuccessEmail();
      },
      onError: () => {
        addNotification({
          description: t('reset.password.error'),
          type: 'error'
        });
      }
    }
  );
  const onSuccessEmail = () => {
    const state = {};
    state.title = t('reset.password.change.password');
    state.body = (
      <div className="MCP-modal-body">
        <p>{t('reset.password.confirmation.message')}</p>
      </div>
    );
    state.footer = (
      <Button onClick={() => dispatch(closeModal())} size="md" variant="primary">
        {t('reset.password.ok')}
      </Button>
    );
    dispatch(openModal(state));
  };
  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('reset.password.account.settings')}</Heading>} />
        {notifications?.length > 0 && (
          <div className="alert-container">
            <div className="MCP-module-body">
              {notifications.map((item, index) => (
                <Alert key={item.id} description={item.description} onClose={() => removeNotification(item.id)} type={item.type} />
              ))}
            </div>
          </div>
        )}
        <div className="MCP-panel-container profile-wraper">
          <Heading as="h3">{t('reset.password.login.userInformation')}</Heading>
          <div className="profile-table">
            <div className="user-details details">
              <p>{t('reset.password.user.email')}</p>
              <span>{userName}</span>
            </div>
            <div className="user-details">
              <p>{t('reset.password.password')}</p>
              <div>
                <IconButton
                  label={t('reset.password.change.password')}
                  size="lg"
                  iconButton={false}
                  textButton={true}
                  Icon={EditIcon}
                  onClick={resetPassword}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSetting;
