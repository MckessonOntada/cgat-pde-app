import React, { useState, useRef, useEffect } from 'react';
import Upload from '@src/assets/image/upload.svg';
import { Divider, Button, Required } from '@mckesson/mcp-component-library';
import './FileInput.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as AddCircleBold } from '@src/assets/image/add_circle_bold.svg';
import { ReactComponent as Close } from '@src/assets/image/close.svg';

const FileInput = ({ onFileSelect, label, initialLogo, buttonCaption }) => {
  const [file, setFile] = useState(initialLogo || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useTranslate();

  useEffect(() => {
    if (initialLogo) {
      setFile(initialLogo);
    }
  }, [initialLogo]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleClearLogo = () => {
    setFile(null);
    onFileSelect(null);
    fileInputRef.current.value = ''; // Reset input so the same file can be uploaded again
  };

  return (
    <div>
      <div className="label-box">
        <p className="label">{label}</p>
      </div>

      <input type="file" onChange={handleFileChange} style={{ display: 'none' }} ref={fileInputRef} />

      <label htmlFor="fileInput" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="label-input">
        <div>
          <img src={Upload} alt="Upload Icon" />
        </div>

        <p className="drag-heading">{t('file.drag.label')}</p>

        <div className="or-box">
          <Divider className="divider-style" />
          <p style={{ fontSize: '12px' }}>OR</p>
          <Divider className="divider-style" />
        </div>

        <Button Icon={AddCircleBold} className="button-icon" variant="secondary" onClick={handleBrowseClick} size={'md'}>
          {buttonCaption || t('file.browse.logo')}
        </Button>

        {file && (
          <div className="preview-container">
            {file.type.startsWith('image/') && <img src={URL.createObjectURL(file)} alt="Preview" className="image-preview" />}
            <div className="file-info">
              <p>{file.name}</p>
              <p>{(file.size / 1024).toFixed(2)} KB</p>
            </div>

            <Button
              Icon={Close}
              className="remove-button-upload"
              variant="tertiary"
              onClick={handleClearLogo}
              iconButton={true}
              size={'lg'}
            />
          </div>
        )}
      </label>
    </div>
  );
};

export default FileInput;
