import axios, { AxiosRequestConfig } from "axios";
 
 
import { create } from "@/actions/save-cookie";
import { getAccessToken,getRefreshToken} from "./utils";

const BASEURL = "http://localhost:5000";
// this function will  be only used to obtain a new access token..
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await getRefreshToken();
  const refreshRes = await axios.post(`${BASEURL}/token/refresh`, {
    refreshToken,
  });
  const newAccessToken = refreshRes.data.accessToken;

  const tds = `${refreshToken}${process.env.COMBINED_TOKEN_SPLITTER}${newAccessToken}`;
  const data = {
    name: "cb-session",
    value: tds,
    httpOnly: true,
    path: "/",
    secure: true,
  };

  await create(data);
  return newAccessToken;
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
      try {
        const newAccessToken = await refreshAccessToken();
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
        console.log("Your session might have expired",error);
        throw err;
      }
    } else {
      throw error;
    }
  }
};


// get request.
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
// put request
export const putRequest = async <T>(
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
    // Making PUT request to the provided endpoint with the payload
    const response = await axios.put(`${BASEURL}${endPoint}`, payload, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      try {
        // If the access token is expired, refresh the token
        const newAccessToken = await refreshAccessToken();
        const newConfig = {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Retry the PUT request with the new access token
        const retryResponse = await axios.put(
          `${BASEURL}${endPoint}`,
          payload,
          newConfig
        );
        return retryResponse.data;
      } catch (err) {
        console.log("Your session might have expired.",error);
        throw err;
      }
    } else {
      // Handle other errors
      throw error;
    }
  }
};