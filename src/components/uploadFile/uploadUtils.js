import CommonUtils from '@src/util/CommonUtils';

export const validateFile = (t, file, allowedTypes = ['text/csv'], maxSizeMB = 4) => {
  const MAX_SIZE_BYTES = maxSizeMB * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: t('upload.file.error.unsupportedFile')
    };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return {
      isValid: false,
      message: t('upload.file.error.fileSizeExceeded').replace('{{maxSize}}', maxSizeMB)
    };
  }
  if (file.name.length > 100) {
    return {
      isValid: false,
      message: t('upload.file.error.fileNameTooLong')
    };
  }
  return { isValid: true, message: t('upload.file.success.validFile') };
};

export const handleDownload = (filePath, fileName) => {
  fetch(filePath)
    .then((res) => res.blob())
    .then((blob) => {
      CommonUtils.downloadFile(blob, fileName);
    })
    .catch((err) => console.error('Download failed:', err));
};

export const createAlertHandler = (setAlert) => (type, message) => {
  setAlert({ type, description: message, isAlertVisible: true });
};

export const handleAlertClose = () => setAlert({ type: '', description: '', isAlertVisible: false });

export const buildUploadFormData = (file, key = 'file') => {
  const formData = new FormData();
  formData.append(key, file);
  return formData;
};
