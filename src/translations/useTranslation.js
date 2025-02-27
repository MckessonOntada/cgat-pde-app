import { useIntl } from 'react-intl';

export function useTranslate() {
  const intl = useIntl();
  const t = (id, values = {}) => {
    const message = intl.messages[id];
    return message ? intl.formatMessage({ id }, values) : id;
  };

  return { t };
}
