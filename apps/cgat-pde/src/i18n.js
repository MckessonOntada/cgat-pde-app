import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import { Locales as UserManagementLocales } from "@mfe/user-management";

i18n
  .use(LanguageDetector) // To use default browser language
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    resources: {
      en: {
        translation: {...en, ...UserManagementLocales.en},
      },
      fr: {
        translation: {...fr, ...UserManagementLocales.fr},
      },
      // Add new locales
    },
  });

export default i18n;
