import React from 'react';
import { Divider, Button } from '@mckesson/mcp-component-library';
import styles from './InputFileFormik.module.scss';
import { getNestedValue } from '../util';
import { useTranslate } from '@src/translations/useTranslation';
import Upload from '@src/assets/image/upload.svg';
import { ReactComponent as AddCircleBold } from '@src/assets/image/add_circle_bold.svg';
import { ReactComponent as Close } from '@src/assets/image/close.svg';
import { useFormikContext } from 'formik';

function InputFileFormik(props) {
  const { field, form, onFileChange, primaryButtonCaption } = props;
  const { setFieldError } = useFormikContext();
  const { label, value, validateOnChange } = props;
  const fileInputRef = React.useRef(value || null);
  const { t } = useTranslate();
  const [file, setFile] = React.useState(value || null);
  ``;
  const { errors, setFieldValue } = form;
  const errorMessage = getNestedValue(errors, `${field.name}`);

  const validateBeforeChange = (file, event) => {
    if (validateOnChange) {
      const validationResponse = validateOnChange(file);

      if (!validationResponse.isValid) {
        setFieldError(`${field.name}`, validationResponse.message);
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
    onFileChange && onFileChange(null);
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
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        // onDragLeave={handleDragLeave}
        className={styles['control-label']}>
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
          <Button Icon={AddCircleBold} className={styles['button-icon']} variant="secondary" onClick={handleBrowseClick} size={'md'}>
            {primaryButtonCaption || t('file.browsInput.selectFile')}
          </Button>
        </div>

        {file && (
          <div className={styles['preview-container']}>
            {file.type.startsWith('image/') && <img src={URL.createObjectURL(file)} alt="Preview" className={styles['image-preview']} />}
            <div className={styles['file-info']}>
              <p>{file.name}</p>
              <p>{selectedFileSize} KB</p>
            </div>

            <Button
              Icon={Close}
              className={styles['remove-button-upload']}
              variant="tertiary"
              onClick={handleClearLogo}
              iconButton={true}
              size={'lg'}
            />
          </div>
        )}
      </label>
      <div>{errorMessage && <label className={styles['error-label']}>{errorMessage}</label>}</div>
    </div>
  );
}

export default InputFileFormik;
