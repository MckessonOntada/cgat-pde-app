import React, { useState } from 'react';
import ModuleHeader from '../module-header';
import { Heading, Button, IconButton, Modal } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as EditIcon } from '@src/assets/svg/edit-icon.svg';
import './profile.scss';
import AuthUtils from '@src/util/AuthUtils';
import CommonDataService from '@src/api/commonService/CommonDataService';
import { useMutation } from 'react-query';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';

const AccountSetting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const userName = AuthUtils.getUserName();

  const { mutate: resetPassword } = useMutation(
    async () => {
      return await CommonDataService.resetPassword();
    },
    {
      onSuccess: () => {
        onSuccessEmail();
      },
      onError: () => {
        console.log("Failed to sent reset passwrd email")
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
      <Button onClick={() => dispatch(closeModal())}  size="md" variant="primary"  >
        {'OK'}
      </Button>
    );
    dispatch(openModal(state));
  };
  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('reset.password.account.settings')}</Heading>} />
        <div className="MCP-panel-container profile-wraper">
          <Heading as="h3">{t('reset.password.login.credentials')}</Heading>
          <div className="profile-table">
            <div className="user-details details">
              <p>{t('reset.password.user.email')}</p>
              <span>{userName}</span>
            </div>
            <div className='user-details'>
              <p>{t('reset.password.password')}</p>
              <div>
                <IconButton
                  label= {t('reset.password.change.password')}
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
