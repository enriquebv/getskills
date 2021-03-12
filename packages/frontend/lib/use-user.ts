import { getOwnUser, logout } from "infrastructure/api";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import { useToasts } from "react-toast-notifications";

interface UserReponseInterface {
  data: any;
  error: {
    response: any;
    status: number;
  };
}

interface UseUserOptionsInterface {
  redirect?: boolean;
}

export default function useUser({ redirect } = {} as UseUserOptionsInterface) {
  const { addToast } = useToasts();
  const router = useRouter();
  const fetcher = async () => {
    try {
      const response = await getOwnUser();
      return response.data;
    } catch (error) {
      throw { response: error.response.data, status: error.response.status };
    }
  };

  const { data: user, error } = useSWR("/api/user", {
    fetcher,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 5000,
  }) as UserReponseInterface;

  async function checkError() {
    console.info("comprobar error");
    switch (error.status) {
      case 400:
      case 406:
        await logout();
        redirect && router.push("/");
        break;
      default:
        addToast(
          "Something wrong happened fetching the user details, reload the page and try again.",
          {
            appearance: "error",
            autoDismiss: true,
          }
        );
        break;
    }
  }

  useEffect(() => {
    if (redirect && error) checkError();
  }, [error]);

  return { user, isLoading: !user && !error, error };
}
