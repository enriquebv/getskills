import axios from "axios";
import { TwitchParamsDto } from "dto/twitch-params.dto";
import { mutate } from "swr";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/api`,
  withCredentials: true,
});

export const authWithTwitch = (body: TwitchParamsDto) =>
  instance.post("/auth/twitch", body);

export const refreshToken = () => instance.post("/auth/refresh");
export const logout = async () => {
  const response = await instance.post("/auth/logout");
  mutate("/api/user", null, false);
  return response;
};

export const getOwnUser = () => instance.get("/user");
export const getStats = () => instance.get("/user/stats");
export const createGiveaway = (body) => instance.post("/giveaway", body);
export const updateGiveaway = (id: string, body) =>
  instance.patch(`/giveaway/${id}`, body);
export const getGiveawayByUser = (user: string) =>
  instance.get(`giveaway/author/twitch/${user}`);
export const cancelGiveaway = (id: string) =>
  instance.post(`/giveaway/cancel/${id}`);
export const pickWinnerGiveaway = (id: string) =>
  instance.post(`/giveaway/end/${id}`);
