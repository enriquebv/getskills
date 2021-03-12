import AppLayout from "layouts/app.layout";

import { getStats } from "infrastructure/api";
import { useEffect } from "react";

export default function BaseApp() {
  useEffect(() => {
    onMount();
  }, []);

  async function onMount() {
    const response = await getStats();

    console.info(response.data);
  }

  return (
    <AppLayout title="Dashboard">
      <b>Hola</b>
    </AppLayout>
  );
}
