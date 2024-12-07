import { createIntl, createIntlCache } from 'react-intl';
import { messages } from './messages';
import { LOCALES } from './locales';

// Function to detect browser language
const getBrowserLocale = () => {
  const browserLocale = navigator.language || navigator.userLanguage;
  console.log('browserLocale....', navigator);
  // Extract base language (e.g., 'en' from 'en-US')
  return browserLocale.split('-')[0];
};

const getAppLocale = () => {
  let appLocale = LOCALES.ENGLISH;
  let tempLocale = localStorage.getItem('APP_LOCALE');
  const browserLocale = getBrowserLocale();
  let _browserLng = Object.values(LOCALES).includes(tempLocale) ? tempLocale : Object.values(LOCALES).includes(browserLocale) ? browserLocale : appLocale;
  return _browserLng;
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
