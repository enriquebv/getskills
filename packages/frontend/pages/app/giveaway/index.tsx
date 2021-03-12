import Input from "components/input";
import AppLayout from "layouts/app.layout";
import { useEffect, useState } from "react";

export default function Giveaway() {
  const [title, setTitle] = useState("");

  useEffect(() => {
    console.info(title);
  }, [title]);

  return (
    <AppLayout title="Giveaway">
      <>
        <Input onTextChange={setTitle} />
      </>
    </AppLayout>
  );
}
