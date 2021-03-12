import AppLayout from "layouts/app.layout";

import { getStats } from "infrastructure/api";
import { useEffect } from "react";
import Button from "@material-ui/core/Button";

export default function BaseApp() {
  // useEffect(() => {
  //   onMount();
  // }, []);

  async function onMount() {
    const response = await getStats();

    console.info(response.data);
  }

  return (
    <AppLayout title="Dashboard">
      <Button>hola</Button>
    </AppLayout>
  );
}
