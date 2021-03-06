import { getOwnUser } from "infrastructure/api";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import useSWR from "swr";

export default function useUser() {
  const router = useRouter();
  const fetcher = async () => {
    const response = await getOwnUser();
    return response.data;
  };

  const { data: user, error } = useSWR("/api/user/me", {
    fetcher,
    revalidateOnFocus: false,
  });

  // const route = useRouter();

  useEffect(() => {
    if (error) router.push("/");
  }, [error]);

  return { user, isLoading: !user && !error, error };
}
