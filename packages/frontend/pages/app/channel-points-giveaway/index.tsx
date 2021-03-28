import styles from "./styles.module.scss";

// Hooks
import useUser from "lib/use-user";
import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";

// Components
import AppLayout from "layouts/app.layout";
import { Button, Slider } from "@material-ui/core";
import Input from "components/input";
import Textarea from "components/textarea";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

// Endpoints
import {
  createGiveaway,
  updateGiveaway,
  getGiveawayByUser,
  cancelGiveaway,
} from "infrastructure/api";
import ChannelPointsReward from "components/channel-points-reward";
import { useRouter } from "next/router";
import { serverSideTranslationsProps } from "lib/server-side-translation";

export const getStaticProps = serverSideTranslationsProps([
  "common",
  "footer",
  "giveaway",
]);

export default function Giveaway() {
  const { t } = useTranslation("giveaway");
  const { addToast } = useToasts();
  const { user } = useUser();
  const [storedGiveaway, setStoredGiveaway] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [checkTitle, setCheckTitle] = useState(false);
  const [checkDescription, setCheckDescription] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rewardTitle, setRewardTitle] = useState("");
  const [rewardCost, setRewardCost] = useState(2000);

  async function onCancel() {
    const { id } = storedGiveaway;
    await cancelGiveaway(id);
    addToast("Giveaway cancelled.", {
      appearance: "success",
      autoDismiss: true,
    });
    setStoredGiveaway(null);
    setIsEditing(false);
    setTitle("");
    setDescription("");
    setRewardTitle("");
    setRewardCost(2000);
  }

  // When create or update the giveaway
  async function onConfirm() {
    let failed = false;

    if (!title) {
      setCheckTitle(true);
      failed = true;
    }

    if (!description) {
      setCheckDescription(true);
      failed = true;
    }

    if (failed) return;

    if (isEditing) {
      await updateGiveaway(storedGiveaway.id, {
        title,
        description,
      });
      addToast("Giveaway updated.", {
        appearance: "success",
        autoDismiss: true,
      });
      return;
    }

    const response = await createGiveaway({
      title,
      description,
      type: "twitch:channel-points",
      rewardTitle: rewardTitle || computedRewardTitlePlaceholder(),
      rewardCost: rewardCost || 2000,
    });
    addToast("Giveaway created.", {
      appearance: "success",
      autoDismiss: true,
    });
    setGivewayState(response.data);
  }

  // Check if user have an active giveaway
  async function getLastGiveaway() {
    try {
      const response = await getGiveawayByUser(user.user);
      if (!response.data.active) return;
      setGivewayState(response.data);
    } catch (error) {
      if (error.response.status !== 404) {
        throw error;
      }
    }
  }

  // Helper to set all the state needed for editing
  function setGivewayState(giveaway) {
    setStoredGiveaway(giveaway);
    setIsEditing(true);
    setTitle(giveaway.title);
    setDescription(giveaway.description);
    setRewardTitle(giveaway.rewardInfo.title);
    setRewardCost(giveaway.rewardInfo.cost);
  }

  // Remove invalid notifications on changes
  useEffect(() => {
    if (title && checkTitle) setCheckTitle(false);
    if (description && checkDescription) setCheckDescription(false);
  }, [title, description]);

  // Wait to have user to check if have one active giveaway
  useEffect(() => {
    if (user) getLastGiveaway();
  }, [user]);

  const actions = (
    <div className={styles.actions}>
      {isEditing ? (
        <Button
          className={styles.cancel}
          color="primary"
          variant="outlined"
          onClick={onCancel}
          disableElevation
        >
          {t("cancel-giveaway")}
        </Button>
      ) : (
        <span></span>
      )}
      <div>
        {isEditing && (
          <Button
            className={styles.create}
            color="primary"
            variant="outlined"
            onClick={() => window.open(`/giveaway/${user.user}`, "_blank")}
            disableElevation
          >
            {t("view-giveaway-page")}
          </Button>
        )}
        <Button
          className={styles.create}
          color="primary"
          variant="contained"
          onClick={onConfirm}
          disableElevation
        >
          {isEditing ? t("update-giveaway") : t("create-giveaway")}
        </Button>
      </div>
    </div>
  );

  function computedRewardTitlePlaceholder() {
    if (!title) {
      return t("reward-config-title-default-empty");
    }

    return t("reward-config-title-default", { title });
  }

  return (
    <AppLayout title={t("giveaway")} disableDefaultBackground>
      <div className={styles["page-giveaway"]}>
        <div className={styles["page-giveaway-options"]}>
          {/* Giveaway Config */}
          <div className={styles["page-giveaway-options-form"]}>
            <Input
              size="big"
              value={title}
              getRef={({ input }) => {
                input.focus();
              }}
              className={styles["title"]}
              onValueChange={setTitle}
              placeholder={t("title")}
              invalid={checkTitle && "Comprueba el titulo"}
            />
            <Textarea
              className={styles.description}
              value={description}
              onValueChange={setDescription}
              placeholder={t("description")}
              invalid={checkDescription && "Comrpueba la descripcion"}
            />

            {/* Help alert */}
            {isEditing && (
              <Alert severity="info" style={{ marginBottom: "20px" }}>
                <AlertTitle>{t("what-now")}</AlertTitle>
                <ul>
                  <li
                    dangerouslySetInnerHTML={{
                      __html: t("help-edit-reward", { user: user.user }),
                    }}
                  ></li>
                  <li
                    dangerouslySetInnerHTML={{
                      __html: t("help-edit-page", { user: user.user }),
                    }}
                  ></li>
                </ul>
              </Alert>
            )}

            {!isEditing && (
              <>
                <h2 className={styles["custom-reward-config-title"]}>
                  {t("reward-config-title")}
                </h2>
                <p className={styles["custom-reward-config-description"]}>
                  {t("reward-config-description")}
                </p>
                <div className={styles["reward-options"]}>
                  <div style={{ opacity: isEditing ? 0.5 : 1 }}>
                    <ChannelPointsReward
                      title={rewardTitle}
                      cost={rewardCost}
                      placeholder={title}
                    />
                  </div>

                  <div className={styles["reward-options-config"]}>
                    <Input
                      disabled={isEditing}
                      value={rewardTitle}
                      className={styles["reward-title"]}
                      onValueChange={setRewardTitle}
                      placeholder={t("reward-config-title-placeholder", {
                        title: computedRewardTitlePlaceholder(),
                      })}
                      invalid={checkTitle && "Comprueba el titulo"}
                    />
                    <div className={styles["reward-cost-config"]}>
                      <Slider
                        disabled={isEditing}
                        defaultValue={rewardCost}
                        value={rewardCost}
                        min={50}
                        max={50000}
                        step={1000}
                        onChange={(_, value) => setRewardCost(value as number)}
                      />
                      <Input
                        disabled={isEditing}
                        max={10000000}
                        type="number"
                        value={rewardCost}
                        className={styles["manual"]}
                        onValueChange={setRewardCost}
                        placeholder={"Reward cost"}
                        invalid={checkTitle && "Comprueba el titulo"}
                      />
                    </div>

                    <p
                      className={styles.description}
                      dangerouslySetInnerHTML={{
                        __html: t("reward-config-help"),
                      }}
                    ></p>
                  </div>
                </div>
              </>
            )}
          </div>

          {actions}

          {/* Reward Config */}
          <div className={styles["page-giveaway-options-reward"]}></div>
        </div>
      </div>
    </AppLayout>
  );
}
