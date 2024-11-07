import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '../../../../translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';
import { PATHS } from '../../routes/constants';
import { ReactComponent as add_circle_bold } from '../../../../assets/image/add_circle_bold.svg';
import { ReactComponent as upload_bottom } from '../../../../assets/image/upload_bottom.svg';
import './index.scss';

function PageHeader() {
  const { t } = useTranslate();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(PATHS.createUser);
  };

  return (
    <div className="flexBox spaceBetween py3">
      <h1>{t('userManagement.header.label')}</h1>
      <div className="flexBox">
        <Button Icon={add_circle_bold} className="button-icon" onClick={handleClick} size={'md'}>
          {t('userManagement.add.label')}
        </Button>
        <Button Icon={upload_bottom} className="button-icon" size={'md'}>
          {' '}
          {t('userManagement.upload.label')}
        </Button>
      </div>
    </div>
  );
}

export default PageHeader;
