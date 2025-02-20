import React, { useState } from 'react';
import { Divider, Button } from '@mckesson/mcp-component-library';
import styles from './InputFileFormik.module.scss';
import { getNestedValue } from '../util';
import { useTranslate } from '@src/translations/useTranslation';
import Upload from '@src/assets/image/upload.svg';
import { ReactComponent as AddCircleBold } from '@src/assets/image/add_circle_bold.svg';
import { useFormikContext } from 'formik';
import { ReactComponent as FileUploadIcon } from '@src/assets/svg/document.svg';
import { ReactComponent as BinRedIcon } from '@src/assets/svg/remove.svg';
import { Link } from 'react-router-dom';

function InputFileFormik(props) {
  const { field, form, onFileChange, primaryButtonCaption } = props;
  const { setFieldError } = useFormikContext();
  const [errorFile, setErrorFile] = useState(false)
  const { label, value, validateOnChange } = props;
  const fileInputRef = React.useRef(value || null);
  const { t } = useTranslate();
  const [file, setFile] = React.useState(value || null);
  const { errors, touched, setFieldValue } = form;
  const errorMessage = getNestedValue(errors, `${field.name}`);
  const isFieldTouched = field.name.includes('.') ? getNestedValue(touched, field.name.split('.')[0]) : getNestedValue(touched, field.name);
  const validateBeforeChange = (file, event) => {
    if (validateOnChange) {
      const validationResponse = validateOnChange(file);

      if (!validationResponse.isValid) {
        setFieldError(`${field.name}`, validationResponse.message);
        setErrorFile(true)
        event.preventDefault();
        return false;
      }
    }
    return true;
  };

  const handleOnChange = (event) => {
    const selectedFile = event.target.files[0];
    setFieldError(`${field.name}`, null);
    if ((validateOnChange && validateBeforeChange(selectedFile, event)) || !validateOnChange)
      if (selectedFile) {
        if (onFileChange) onFileChange(selectedFile, event);
        else setFieldValue(field.name, selectedFile);
        setFile(selectedFile);
        setErrorFile(false)
      }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (validateBeforeChange(droppedFile, event))
      if (droppedFile) {
        setFile(droppedFile);
        onFileChange && onFileChange(droppedFile);
      }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleClearLogo = () => {
    setFile(null);
    setFieldValue(field.name, null)
    fileInputRef.current.value = '';
  };

  const selectedFileSize = (file?.size / 1024).toFixed(2);
  return (
    <div className={`${styles['component-wrapper']} ${errorMessage ? styles['has-error'] : null}`}>
      <div className={styles['caption-container']}>
        <p className={styles['caption']}>{label}</p>
      </div>
      <input
        type="file"
        accept={props.accept}
        multiple={props.multiple}
        capture={props.capture}
        name={props.name}
        id={props.id}
        className={props.className}
        required={props.required}
        disabled={props.disabled}
        readOnly={props.readOnly}
        form={props.form}
        tabIndex={props.tabIndex}
        aria-label={props.ariaLabel}
        aria-labelledby={props.ariaLabelledby}
        aria-describedby={props.ariaDescribedby}
        onChange={handleOnChange}
        onInput={props.onInput}
        style={{ display: 'none', ...props.style }}
        ref={fileInputRef}
      />
      <label
        htmlFor="fileInput"
        onDrop={ !props.disabled &&  handleDrop}
        onDragOver={!props.disabled &&  handleDragOver}
        // onDragLeave={handleDragLeave}
        className={styles['control-label']}
        style={!!props.disabled ? { background: '#F2F6FA' } : {}}
      >
        <div className={styles['upload-panel']}>
          <div>
            <img src={Upload} alt="Upload Icon" />
          </div>

          <p className={styles['drag-heading']}>{t('file.drag.label')}</p>

          <div className={styles['or-box']}>
            <Divider className={styles['divider-style']} />
            <p>OR</p>
            <Divider className={styles['divider-style']} />
          </div>
          <Button Icon={AddCircleBold} className={styles['button-icon']} variant="secondary" onClick={handleBrowseClick} size={'md'} disabled={!!props.disabled || !!file}>
            {primaryButtonCaption || t('file.browsInput.selectFile')}
          </Button>
        </div>  
        {file && (
          <div className={styles['preview-container']}>
            <div className={styles['file-info']}>
              <div>
                {file.type.startsWith('image/') ? <img src={URL.createObjectURL(file)} alt="Preview" className={styles['image-preview']} />: <FileUploadIcon width={20} />}
              </div>
              <div>
                <Link className={styles['file-name']} target="_blank" to={props.attachmentValue}>
                  <p>{file.name}</p>
                </Link>
                <p>{selectedFileSize} KB</p>
              </div>
            </div>
            <div className="styled-icon-button error-button">
              <Button
                Icon={BinRedIcon}
                className={styles['remove-button-upload']}
                size="lg"
                variant="tertiary"
                color="error"
                type="button"
                onClick={handleClearLogo}
              />
            </div>
          </div>
        )}
        {(errorFile || isFieldTouched) && errorMessage && (
          <div className={styles['error-container']}>
            <p>{t('file.browsInput.error.uploading')}</p>
            <label>{errorMessage}</label>
          </div>
        )}
      </label>
    </div>
  );
}

export default InputFileFormik;
