import { getAuthUser } from "../auth.action";
import { githubApiHelper } from "@/utils/ApiHelpers";
import { Messages } from "@/utils/enums";

export const getAuthenticatedUserGists = async (since: string, page: number, per_page: number) => {
  try {
    const session = await getAuthUser()
    if (!session) return { success: false, message: Messages.USER_NOT_FOUND }
    const user = session.user
    const response = await githubApiHelper('/gists', user.github_token, {
      since,
      page,
      per_page
    })
    return response
  } catch (error) {
    console.log(error)
    return { success: false, data: error }
  }
}

export const getGistByGistId = async (gist_id: string) => {
  try {
    const session = await getAuthUser()
    if (!session) return { success: false, message: Messages.USER_NOT_FOUND }
    const user = session.user
    const response = await githubApiHelper(`/gists/${gist_id}`, user.github_token)
    return response
  } catch (error) {
    console.log(error)
    return { success: false, data: error }
  }
}
