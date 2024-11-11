import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import './index.scss';

function PageHeader(props) {
  const { t } = useTranslate();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(props.navigateTo);
  };

  return (
    <div className="flexBox spaceBetween py3">
      <h1 className="title-style">{props.title}</h1>
      <div className="flexBox">
        <Button Icon={add_circle_bold} className="button-icon" onClick={handleClick} size={'md'}>
          {props.buttonLabels.add}
        </Button>
      </div>
    </div>
  );
}

export default PageHeader;
