import { logout } from "infrastructure/api";
import { useRouter } from "next/dist/client/router";

export default function BaseApp() {
  const router = useRouter();
  async function doLogout() {
    await logout();
    router.push("/");
  }

  return <button onClick={doLogout}>Logout</button>;
}
