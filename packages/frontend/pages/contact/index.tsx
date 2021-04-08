import { Button } from "@material-ui/core";
import Input from "components/input";
import Textarea from "components/textarea";
import { sendContact } from "infrastructure/api";
import GlobalLayout from "layouts/global.layout";
import { serverSideTranslationsProps } from "lib/server-side-translation";
import { useState } from "react";
import { useToasts } from "react-toast-notifications";
import styles from "./styles.module.scss";

export const getStaticProps = serverSideTranslationsProps(["common", "footer"]);

const EMAIL_API_ERROR = "email must be an email";
const MESSAGE_API_ERROR =
  "message must be longer than or equal to 1 characters";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { addToast } = useToasts();

  async function handleSend() {
    try {
      await sendContact({ email, message });
      addToast(
        "Your message has been sent, we will contact you as soon as possible. 🙂",
        {
          appearance: "success",
          autoDismiss: true,
        }
      );
    } catch (error) {
      if (error.response?.data?.message) {
        if (error.response.data.message.includes(EMAIL_API_ERROR)) {
          addToast("Not a valid email.", {
            appearance: "error",
            autoDismiss: true,
          });
        }

        if (error.response.data.message.includes(MESSAGE_API_ERROR)) {
          addToast("You need to write a message.", {
            appearance: "error",
            autoDismiss: true,
          });
        }

        return;
      }

      throw error;
    }
  }

  return (
    <GlobalLayout>
      <div className={styles["contact-page"]}>
        <Input
          className={styles["email"]}
          type="email"
          onValueChange={setEmail}
          placeholder={"E-mail (required)"}
          getRef={({ input }) => input.focus()}
        />
        <Textarea
          className={styles.message}
          onValueChange={setMessage}
          placeholder={"Message (required)"}
        />
        <Button
          size="large"
          onClick={handleSend}
          variant="contained"
          color="primary"
        >
          Send
        </Button>
      </div>
    </GlobalLayout>
  );
}
