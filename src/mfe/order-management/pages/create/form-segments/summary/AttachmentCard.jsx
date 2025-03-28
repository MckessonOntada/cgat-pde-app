import React from 'react';
import { ReactComponent as FileIconPdf } from '@src/assets/svg/FileIconPdf.svg';
import { ReactComponent as FileIconDoc } from '@src/assets/svg/FileIconDoc.svg';
import { ReactComponent as FileIconExcel } from '@src/assets/svg/FileIconExcel.svg';
import { ReactComponent as FileIconUnknown } from '@src/assets/svg/FileIconUnknown.svg';
import CommonUtils from '@src/util/CommonUtils';
import OrderService from '@src/api/commonService/OrderService';

const fileIcons = {
  pdf: <FileIconPdf />,
  doc: <FileIconDoc />,
  xls: <FileIconExcel />,
  txt: <FileIconExcel />
};

function AttachmentCard(props) {
  const { fileName, fileSize, url } = props;
  const fileType = fileName.split('.').pop();
  const handleOnClick = async () => {
    const response = await OrderService.downloadDocument(url); //Prio1

    const arrayBuffer = await response.data;

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Received an empty file.');
    }
    const blob = new Blob([arrayBuffer]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  return (
    <div className="attachment-wrapper" onClick={Boolean(url) && handleOnClick}>
      {fileIcons[fileType] || <FileIconUnknown />}
      <div className="meta">
        <p className="name">{fileName}</p>
        <p className="size">{CommonUtils.getFileSize(fileSize)}</p>
      </div>
    </div>
  );
}

export default AttachmentCard;
