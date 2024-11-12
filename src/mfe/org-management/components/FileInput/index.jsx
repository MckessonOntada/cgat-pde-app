import React, { useState, useRef } from 'react';
import Upload from '@src/assets/image/upload.svg';
import { Divider } from '@mckesson/mcp-component-library';
import './FileInput.scss';

const FileInput = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />

      <label
        htmlFor="fileInput"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="label-input">
        <div>
          <img src={Upload} alt="Upload Icon" />
        </div>

        <p className="drag-heading">Drag your file(s) to start uploading</p>

        <div className="or-box">
          <Divider className="divider-style" />
          <p style={{ fontSize: '12px' }}>OR</p>
          <Divider className="divider-style" />
        </div>

        <button type="button" onClick={handleBrowseClick}>
          BROWSE LOGO
        </button>

        {file && (
          <div className="preview-container">
            <img src={URL.createObjectURL(file)} alt="Preview" />
            <div className="file-info">
              <p>{file.name}</p>
              <p>{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <button className="remove-button" onClick={handleClearLogo}>
              Remove
            </button>
          </div>
        )}
      </label>
    </div>
  );
};

export default FileInput;
