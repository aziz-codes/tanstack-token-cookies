import { getCookie } from "@/actions/sent-cookie";
import RefreshToken from "@/actions/get-refresh-token";
const splitter = "cb24"

// this function will only returns access token.
export const getAccessToken = async()=>{
    const data = await getCookie();

  const accessToken = data?.split(splitter)[0];

  return accessToken;
}

// this function will return refresh token.
export const getRefreshToken = async () => {
  const data = await RefreshToken();
  const refreshToken = data?.split(splitter)[1];
  return refreshToken;
};