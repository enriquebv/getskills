import { Router, useRouter } from "next/router";
import { useEffect } from "react";

export const I18nConsistencyProvider = ({ children }) => {
  const router = useRouter();

  function checkStoredLanguage() {
    const storedLang = window.localStorage.getItem("getskills_locale");
    const isValidLang = router.locales.includes(storedLang);

    if (!storedLang || (storedLang && !isValidLang)) {
      window.localStorage.setItem("getskills_locale", router.locale);
      return;
    }

    if (storedLang !== router.locale && isValidLang) {
      router.push(router.asPath, router.asPath, { locale: storedLang });
    }
  }

  useEffect(checkStoredLanguage, []);

  return children;
};

export const useChangeLocale = () => {
  const router = useRouter();

  return {
    change(locale: string, path?: string) {
      const isValidLang = router.locales.includes(locale);

      if (!isValidLang) {
        console.warn(`Invalid locale ${locale}`);
        return;
      }

      const toPath = path || router.asPath;
      window.localStorage.setItem("getskills_locale", locale);

      router.push(toPath, toPath, { locale });
    },
  };
};
