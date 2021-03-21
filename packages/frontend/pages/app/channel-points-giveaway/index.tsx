import styles from "./styles.module.scss";

// Hooks
import useUser from "lib/use-user";
import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";

// Components
import AppLayout from "layouts/app.layout";
import { Button, Slider } from "@material-ui/core";
import Input from "components/input";
import Textarea from "components/textarea";
import Alert from "@material-ui/lab/Alert";

// Endpoints
import {
  createGiveaway,
  updateGiveaway,
  getGiveawayByUser,
  cancelGiveaway,
} from "infrastructure/api";
import ChannelPointsReward from "components/channel-points-reward";
import { useRouter } from "next/router";

export default function Giveaway() {
  const router = useRouter();
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
          Cancel
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
            View
          </Button>
        )}
        <Button
          className={styles.create}
          color="primary"
          variant="contained"
          onClick={onConfirm}
          disableElevation
        >
          {isEditing ? "Save" : "Create"}
        </Button>
      </div>
    </div>
  );

  function computedRewardTitlePlaceholder() {
    const { locale } = router;

    switch (locale) {
      case "es":
        return `Sorteo "${title || "Sin titulo"}"`;
      default:
        return `Giveaway "${title || "Without title"}"`;
    }
  }

  return (
    <AppLayout title="Giveaway" disableDefaultBackground={true}>
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
              placeholder={"Title"}
              invalid={checkTitle && "Comprueba el titulo"}
            />
            <Textarea
              className={styles.description}
              value={description}
              onValueChange={setDescription}
              placeholder="Description"
              invalid={checkDescription && "Comrpueba la descripcion"}
            />

            {isEditing && (
              <Alert severity="info" style={{ marginBottom: "20px" }}>
                When the giveaway is created, you can't update the channel
                points reward.
              </Alert>
            )}

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
                  placeholder={computedRewardTitlePlaceholder()}
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
                    number
                    value={rewardCost}
                    className={styles["manual"]}
                    onValueChange={setRewardCost}
                    placeholder={"Reward cost"}
                    invalid={checkTitle && "Comprueba el titulo"}
                  />
                </div>

                <p className={styles.description}>
                  Reward's preview that will be created (automatically) when you
                  create the giveaway. This is what it will look like in your{" "}
                  <a
                    href="https://help.twitch.tv/s/article/channel-points-guide"
                    target="_blank"
                  >
                    channel points
                  </a>{" "}
                  panel.
                </p>
              </div>
            </div>
          </div>

          {actions}

          {/* Reward Config */}
          <div className={styles["page-giveaway-options-reward"]}></div>
        </div>
      </div>
    </AppLayout>
  );
}
