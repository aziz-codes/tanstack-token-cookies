import axios, { AxiosRequestConfig } from "axios";
import { getCookie } from "@/actions/sent-cookie";
import { create } from "@/actions/save-cookie";
import { headers } from "next/headers";

const BASEURL = "http://localhost:5000";

// this function will  be only used to obtain a new access token..
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await getRefreshToken();
  const refreshRes = await axios.post(`${BASEURL}/token/refresh`, {
    refreshToken,
  });
  const newAccessToken = refreshRes.data.accessToken;

  const tds = `${refreshToken}AZ-:24${newAccessToken}`;
  const data = {
    name: "ds",
    value: tds,
    httpOnly: true,
    path: "/",
    secure: true,
  };
  await create(data);

  return newAccessToken;
};

const getAccessToken = async () => {
  const data = await getCookie();

  const accessToken = data?.split("AZ-:24")[1];

  return accessToken;
};

const getRefreshToken = async () => {
  const data = await getCookie();
  const refreshToken = data?.split("AZ-:24")[0];
  return refreshToken;
};
// post request function.
export const postRequest = async <T>(
  endPoint: string,
  payload: T
): Promise<any> => {
  const accessToken = await getAccessToken();
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios.post(`${BASEURL}${endPoint}`, payload, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      // Token expired, refresh it
      try {
        const newAccessToken = await refreshAccessToken();

        // Retry the post request with new token
        const newConfig = {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
        };

        const retryResponse = await axios.post(
          `${BASEURL}${endPoint}`,
          payload,
          newConfig
        );
        return retryResponse.data;
      } catch (err) {
        console.log("Your session might have expired");
        throw err;
      }
    } else {
      throw error;
    }
  }
};

export const getRequest = async (endPoint: string): Promise<any> => {
  const accessToken = await getAccessToken();
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.get(`${BASEURL}${endPoint}`, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      // Token expired, refresh it
      try {
        const newAccessToken = await refreshAccessToken();

        // Retry the get request with new token
        const newConfig = {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
        };

        const retryResponse = await axios.get(
          `${BASEURL}${endPoint}`,
          newConfig
        );
        console.log("inside api call", retryResponse);
        return retryResponse.data;
      } catch (err) {
        console.log("Your session might have expired");
        throw err;
      }
    } else {
      throw error;
    }
  }
};
