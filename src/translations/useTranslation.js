import { useIntl } from 'react-intl';

export function useTranslate() {
  const intl = useIntl();
  const t = (id, values = {}) => {
    if (!id || typeof id !== 'string') return '';
    try {
      const message = intl.messages[id];
      return message ? intl.formatMessage({ id }, values) : id;
    } catch (err) {
      return '';
    }
  };

  return { t };
}
