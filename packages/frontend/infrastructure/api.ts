import axios from "axios";
import { TwitchParamsDto } from "dto/twitch-params.dto";
import { browser } from "process";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/api`,
});

export const authWithTwitch = (body: TwitchParamsDto) =>
  instance.post(
    "/auth/twitch",
    { ...body, browser: true },
    { withCredentials: true }
  );
