import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { ReactComponent as upload_bottom } from '@src/assets/image/upload_bottom.svg';
import { ReactComponent as pencil_write_edit } from '@src/assets/image/pencil-write-edit.svg';

function PageHeader(props) {
  const { t } = useTranslate();
  const navigate = useNavigate();
  
  const handleClick = () => {
    const { navigateTo, state } = props;
    navigate(navigateTo, state ? { state } : {});
  };

  return (
    <div className="flexBox spaceBetween py3">
      <h1>{props.title}</h1>
      <div className="flexBox"> 
        {props.buttonLabels?.add && (
          <Button Icon={add_circle_bold} className="button-icon" onClick={handleClick} size={'md'}>
            {props.buttonLabels.add}
          </Button>
        )}
        {props.buttonLabels?.upload && (
          <Button Icon={upload_bottom} className="button-icon" size={'md'}>
            {props.buttonLabels.upload}
          </Button>
        )}
        {props.buttonLabels?.edit && (
          <Button Icon={pencil_write_edit} variant="secondary" className="button-icon" onClick={handleClick} size={'md'}>
            {props.buttonLabels.edit}
          </Button>
        )}
         {props.buttonLabels?.secondaryadd && (
          <Button Icon={add_circle_bold} variant="secondary" className="button-icon" onClick={handleClick} size={'md'}>
            {props.buttonLabels.secondaryadd}
          </Button>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
