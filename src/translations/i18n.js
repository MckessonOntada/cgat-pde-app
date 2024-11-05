import { createIntl, createIntlCache } from 'react-intl';
import { messages } from './messages';
import { LOCALES } from './locales';

const getAppLocale = () => {
  let appLocale = LOCALES.ENGLISH;
  let tempLocale = localStorage.getItem('APP_LOCALE');
  for (const key in LOCALES) {
    if (LOCALES[key] === tempLocale) {
      appLocale = LOCALES[key];
      break;
    }
  }
  return appLocale;
};

export const currentLocale = getAppLocale();
let htmlRoot = document.getElementById('HTMLRoot');
if (htmlRoot) {
  htmlRoot.setAttribute('lang', currentLocale);
}

const cache = createIntlCache();

export const intl = createIntl(
  {
    locale: currentLocale,
    messages: messages[currentLocale]
  },
  cache
);
