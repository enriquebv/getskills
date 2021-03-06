import axios from "axios";
import { TwitchParamsDto } from "dto/twitch-params.dto";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/api`,
  withCredentials: true,
});

export const authWithTwitch = (body: TwitchParamsDto) =>
  instance.post("/auth/twitch", body);

export const refreshToken = () => instance.post("/auth/refresh");
export const logout = () => instance.post("/auth/logout");

export const getOwnUser = () => instance.get("/user/me");
