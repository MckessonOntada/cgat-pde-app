import React from 'react';
import { ReactComponent as IconInfo } from '@src/assets/svg/info-blue.svg';
import { renderModal } from '@src/util/ModalUtil';
import { IconButton } from '@mckesson/mcp-component-library';
const InfoModel = ({ title, children }) => {
  const infoModel = (title = 'test', children) => {
    renderModal({
      title: title,
      bodyContent: children
    });
  };

  const handleClick = () => {
    infoModel(title, children);
  };

  return (
    <div className="infoModel-icon">
      <IconButton
        size="lg"
        iconButton={true}
        textButton={false}
        Icon={IconInfo}
        onClick={handleClick}
      />
    </div>
  );
};

export default InfoModel;
