import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const mapTranslationProps = async (
  locale: string,
  namespaces: string[]
) => serverSideTranslations(locale, namespaces);

export const serverSideTranslationsProps = (namespaces: string[]) => async ({
  locale,
}) => ({
  props: {
    ...(await mapTranslationProps(locale, namespaces)),
  },
});
