import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const Languages = ['en', 'ar'];

export const LanguagesMeta = [
  { name: 'en', displayName: 'English', icon: 'famfamfam-flags gb', isRTL: false },
  { name: 'ar', displayName: 'العربية', icon: 'famfamfam-flags sa', isRTL: true }
];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    whitelist: Languages,
    interpolation: {
      escapeValue: false,
    }
  });

export function getCurrentLanguageName() {
  for (let i = 0; i < LanguagesMeta.length; i++)
    if (i18n.language === LanguagesMeta[i].name)
      return LanguagesMeta[i].displayName;
  return '';
}

export function L(key) {
  return i18n.t(key);
}

export function getCurrentLanguageISOCode() {
  return i18n.language;
}

export default i18n;