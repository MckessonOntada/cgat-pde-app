import React from 'react';
import { ReactComponent as FileIconPdf } from '@src/assets/svg/FileIconPdf.svg';
import { ReactComponent as FileIconDoc } from '@src/assets/svg/FileIconDoc.svg';
import { ReactComponent as FileIconExcel } from '@src/assets/svg/FileIconExcel.svg';
import { ReactComponent as FileIconUnknown } from '@src/assets/svg/FileIconUnknown.svg';
import { ReactComponent as FileIcontxt } from '@src/assets/svg/txt.svg';
import CommonUtils from '@src/util/CommonUtils';
import OrderService from '@src/api/commonService/OrderService';

function getFileIcon(extension) {
  const ext = extension.toLowerCase();

  if (['doc', 'docx'].includes(ext)) {
    return <FileIconDoc />;
  }

  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return <FileIconExcel />;
  }

  if (['pdf'].includes(ext)) {
    return <FileIconPdf />;
  }

  if (['txt', 'log'].includes(ext)) {
    return <FileIcontxt />;
  }
  return <FileIconUnknown />;
}

function AttachmentCard(props) {
  const { fileName, fileSize, url, isCustomerCentreUser } = props;
  const fileType = fileName.split('.').pop();
  const fileIcon = getFileIcon(fileType);
  const shouldShowSize = typeof fileSize === 'number' && !Number.isNaN(fileSize);
  const handleOnClick = async () => {
    const response = isCustomerCentreUser ? await OrderService.downloadDocumentCsUser(url) : await OrderService.downloadDocument(url);

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
      {fileIcon}
      <div className="meta">
        <p className="name fieldValue">
          <div className="overflowing">{fileName}</div>
        </p>
        {shouldShowSize && <p className="size">{CommonUtils.getFileSize(fileSize)}</p>}
      </div>
    </div>
  );
}

export default AttachmentCard;
