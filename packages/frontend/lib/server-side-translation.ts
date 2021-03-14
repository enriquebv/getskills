import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const resolveServerSideTranslations = async (
  locale,
  namespaces: string[]
) => serverSideTranslations(locale, namespaces);

export const serverSideTranslationsProps = (namespaces: string[]) => async ({
  locale,
}) => ({
  props: {
    ...(await resolveServerSideTranslations(locale, namespaces)),
  },
});
