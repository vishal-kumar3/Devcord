import { getAuthUser } from "../auth.action";
import { Messages } from "@/utils/enums";
import { githubApiHelper } from "@/utils/ApiHelpers";

export const getFollowersAndFollowing = async (
  page: number = 1,
  per_page: number = 20,
) => {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, message: Messages.USER_NOT_FOUND };

    console.log(user.github_token);

    const followers = await githubApiHelper(
      "/user/followers",
      user.github_token,
      {
        page,
        per_page,
      },
    );

    const following = await githubApiHelper(
      "/user/following",
      user.github_token,
      {
        page,
        per_page,
      },
    );

    if (followers.success && following.success)
      return {
        followers: followers.data.data,
        following: following.data.data,
        success: true,
        message: Messages.SUCCESS,
      };
    
    else
      return {
        success: false,
        message: { ...followers.data, ...following.data },
      };
  } catch (error) {
    console.log(error);
    return { success: false, message: error };
  }
};


export const getTheAuthenticatedUser = async () => {
    try {
        const user = await getAuthUser()
        const userResponse = await githubApiHelper("/user", user.github_token)
        return userResponse
    } catch (error) {
        console.log(error);
        return { success: false, message: error };
    }
}

export const getUserByUsername = async (username: string) => {
    try {
        const user = await getAuthUser()
        const userResponse = await githubApiHelper(`/users/${username}`, user.github_token)
        return userResponse
    } catch (error) {
        console.log(error);
        return { success: false, message: error };
    }
}