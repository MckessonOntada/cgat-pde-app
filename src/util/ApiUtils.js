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
  const hasSpecialChars = /[:']/g.test(message);
  const keyMatch = hasSpecialChars ? message.match(/'(.+?)'/) : message;
  return keyMatch ? (hasSpecialChars ? `errors.${keyMatch[1]}` : `errors.${keyMatch}`) : 'errors.default';
};

export const ExtractErrorfromAPIResponse = (errorMessage) => {
  if (!errorMessage) {
    return '';
  }

  // Extract the content inside square brackets
  try {
    const match = errorMessage.match(/\[([^\]]+)\]/);
    if (match && match[1]) {
      // Split messages correctly, handling missing commas
      const messagesArray = match[1]
        .split(/",\s*"|","\s*"/) // Handles cases where some commas are missing
        .map((msg) => msg.replace(/["']/g, '').trim()); // Remove quotes and trim spaces

      return messagesArray.join(', '); // Return clean, comma-separated messages
    }
  } catch (error) {}
  return errorMessage; // Return original message if format doesn't match
};
