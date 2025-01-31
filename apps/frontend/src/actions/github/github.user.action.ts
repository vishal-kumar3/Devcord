import axios, { AxiosRequestConfig } from "axios"
import { getAuthUser } from "../auth.action"


export const getFollowersAndFollowing = async (page: number = 1, per_page: number = 20) => {
    try {
        const user = await getAuthUser()
        if(!user) return { success: false, message: Messages.USER_NOT_FOUND }

        const config: AxiosRequestConfig = {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${user.github_token}`
            }
        }
        console.log(user.github_token)
        const followers = await axios.get(`https://api.github.com/user/followers?page=${page}&per_page=${per_page}`, config)
        const following = await axios.get(`https://api.github.com/user/following?page=${page}&per_page=${per_page}`, config)
        return { followers: followers.data, following: following.data, success: true, message: Messages.SUCCESS }

    } catch (error) {
        console.log(error)
        return { success: false, message: error }
    }
}