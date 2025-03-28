import CommonUtils from '@src/util/CommonUtils';

export const validateFile = (file, allowedTypes = ['text/csv']) => {
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: `Unsupported file type. Please upload one of: ${allowedTypes.join(', ')}`
    };
  }
  return { isValid: true, message: 'File is valid.' };
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
  const timer = setTimeout(() => {
    setAlert({ type: '', description: '', isAlertVisible: false });
  }, 10000);
  return () => clearTimeout(timer);
};

const handleAlertClose = () => setAlert({ type: '', description: '', isAlertVisible: false });

export const buildUploadFormData = (file, key = 'file') => {
  const formData = new FormData();
  formData.append(key, file);
  return formData;
};
