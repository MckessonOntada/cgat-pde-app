import { useIntl } from 'react-intl';

export function useTranslate() {
  const intl = useIntl(); 
  const t = (id, values = {}) => intl.formatMessage({ id }, values); 
  return { t };
}