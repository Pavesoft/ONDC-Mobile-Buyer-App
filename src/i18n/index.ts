import i18n from 'i18next';
import { I18nContext, initReactI18next } from 'react-i18next';
import en from './en.json';
// import de from './de.json';
import hi from './hi.json';
import Config from '../../config';

// if (!i18n.isInitialized) {
i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    compatibilityJSON: 'v3',
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: en,
      },
      hi: {
        translation: hi,
      },
    },
  });
// }
console.log(i18n);

// @TODO: Add logic to change language based on Async storage value
i18n.changeLanguage('hi');

export default i18n;
