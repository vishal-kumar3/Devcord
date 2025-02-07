import axios, { AxiosError } from "axios";
import path from "path";

export const githubApiHelper = async <T = any>(
  endpoint: string,
  github_token: string,
  params?: Record<string, string | number | boolean>,
  headers?: Record<string, string | number | boolean>
): Promise<{
  success: boolean;
  data: T | null;
  error?: string;
}> => {
  try {
    const baseUrl = "https://api.github.com";
    const response = await axios.get<T>(path.join(baseUrl, endpoint), {
      params,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${github_token}`,
        ...headers,
      },
    });

    // Successful API call
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // If it's an AxiosError, we can extract the message and handle it
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Unknown Axios error",
      };
    } else {
      // Catch unexpected errors
      return {
        success: false,
        data: null,
        error: "Unknown error occurred",
      };
    }
  }
};
