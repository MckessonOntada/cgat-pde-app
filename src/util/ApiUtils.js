import { useTranslate } from '@src/translations/useTranslation';
// Move to utils

export const serializeParams = function (obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
};

export const handleApiError = (errorData, setAlert) => {
  const { message } = errorData?.response?.data || {};
  if (!message) {
    return 'errors.default';
  }

  const keyMatch = message.match(/'(.+?)'/);
  return keyMatch ? `errors.${keyMatch[1]}` : 'errors.default';
};
