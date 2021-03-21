import styles from "./styles.module.scss";
import { getGiveawayByUser } from "infrastructure/api";
import { GetServerSideProps } from "next";
import SSRError from "lib/ssr-error";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { streamer } = query;
  try {
    const response = await getGiveawayByUser(streamer as string);
    return { props: { giveaway: response.data } };
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response;

      return {
        props: { ssrError: new SSRError(status, data?.message).toJSON() },
      };
    }

    throw error;
  }
};

export default function Giveaway({
  giveaway,
  ssrError,
}: {
  giveaway: any;
  ssrError: SSRError;
}) {
  if (ssrError) {
    return JSON.stringify(ssrError);
  }

  return (
    <div className={styles["giveaway-landing"]}>
      <h2>{giveaway.author.username}</h2>
      <h1>{giveaway.title}</h1>
      <p>{giveaway.description}</p>
    </div>
  );
}
