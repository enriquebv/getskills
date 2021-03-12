const NEXT_PUBLIC_TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
const NEXT_PUBLIC_TWITCH_CALLBACK_URL =
  process.env.NEXT_PUBLIC_TWITCH_CALLBACK_URL;

const oauthTwithUrl = [
  `https://id.twitch.tv/oauth2/authorize?client_id=${NEXT_PUBLIC_TWITCH_CLIENT_ID}`,
  `redirect_uri=${NEXT_PUBLIC_TWITCH_CALLBACK_URL}`,
  `response_type=token`,
  `scope=user:read:email channel:manage:redemptions`,
].join("&");

export default oauthTwithUrl;
