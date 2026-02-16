import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import az from "./locales/translationAZ.json";

// Initialize i18next with only Azerbaijani
i18n
  .use(initReactI18next)
  .init({
    resources: {
      az: { translation: az },
    },
    lng: "az",
    fallbackLng: "az",
    interpolation: { escapeValue: false },
  });

/**
 * Simplified to always return text since only AZ is supported
 */
export async function translateDynamicField(text) {
  return text;
}

export default i18n;

