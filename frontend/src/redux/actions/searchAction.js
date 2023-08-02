import {axiosInstance} from "../../index";
export const searchUsers = async (searchQuery) => {
    try {
        const response = await axiosInstance.get(`/auth/users/?search=${searchQuery}`)
        return response.data
    } catch (e) {
        throw(JSON.stringify(e.response.data))
    }
}

export const searchGroups = async (searchQuery) => {
    try {
        const response = await axiosInstance.get(`/groups/?search=${searchQuery}`)
        return response.data
    } catch (e) {
        throw(JSON.stringify(e.response.data))
    }
}