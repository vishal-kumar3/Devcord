import asyncHandler from "@/utils/AsyncHandler";
import { getAuthUser } from "../auth.action";
import { githubApiHelper } from "@/utils/ApiHelpers";

export const getAuthenticatedUserGists = async (since?: string, page?: number, per_page?: number) => {
    try {
        const user = await getAuthUser()
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
        const user = await getAuthUser()
        const response = await githubApiHelper(`/gists/${gist_id}`, user.github_token)
        return response
    } catch (error) {
        console.log(error)
        return { success: false, data: error }
    }
}