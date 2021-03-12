import { useRouter } from "next/router";

export default function Giveaway() {
  const router = useRouter();
  const { streamer } = router.query;

  return (
    <>
      <h1>{streamer}</h1>
    </>
  );
}
