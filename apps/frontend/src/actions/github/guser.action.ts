import { getAuthUser } from "../auth.action";
import { Messages } from "@/utils/enums";
import { githubApiHelper } from "@/utils/ApiHelpers";

export const getFollowersAndFollowing = async (
  page: number = 1,
  per_page: number = 20,
) => {
  try {
    const session = await getAuthUser();
    if (!session) return { success: false, message: Messages.USER_NOT_FOUND, data: null };
    const user = session.user

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
        followers: followers.data,
        following: following.data,
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
    const session = await getAuthUser()
    if (!session) return { success: false, message: Messages.USER_NOT_FOUND };
    const user = session.user
    const userResponse = await githubApiHelper("/user", user.github_token)
    return userResponse
  } catch (error) {
    console.log(error);
    return { success: false, message: error };
  }
}

export const getGUserByUsername = async ({
  username,
  page = 1,
  per_page = 5,
}: {
  username: string
  page?: number
  per_page?: number
}) => {
  try {
    const session = await getAuthUser()
    if (!session) return null
    const user = session.user
    const userResponse = await githubApiHelper(
      `/search/users?q=${username}`,
      user.github_token,
      {
        page,
        per_page,
      },
    )
    return userResponse
  } catch (error) {
    console.log(error);
    return null
  }
}
