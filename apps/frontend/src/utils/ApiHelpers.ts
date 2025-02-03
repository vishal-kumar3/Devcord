import axios from "axios";
import path from "path";

export const githubApiHelper = async (
    endpoint: string,
    github_token: string,
    params?: Record<string, any>,
    headers?: Record<string, any>,
  ): Promise<{
    success: boolean;
    data: Record<string, any>;
  }> => {
    try {
      const baseUrl = "https://api.github.com";
      const response = await axios.get(path.join(baseUrl, endpoint), {
        params,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${github_token}`,
          ...headers,
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      console.log(error);
      return { success: false, data: error };
    }
  };