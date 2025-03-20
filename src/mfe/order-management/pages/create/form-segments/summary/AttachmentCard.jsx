import React from 'react';
import { ReactComponent as FileIconPdf } from '@src/assets/svg/FileIconPdf.svg';
import CommonUtils from '@src/util/CommonUtils';

function AttachmentCard(props) {
  const { fileName, fileSize } = props;
  return (
    <div className="attachment-wrapper">
      <FileIconPdf />
      <div className="meta">
        <p className="name">{fileName}</p>
        <p className="size">{CommonUtils.getFileSize(fileSize)}</p>
      </div>
    </div>
  );
}

export default AttachmentCard;
