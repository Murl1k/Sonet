import {axiosInstance} from '../..';
import {toast} from "react-toastify";

export const getGroupsByUser = async (userId, isOwner) => {
    try {
        const response = await axiosInstance.get(`/groups-by-user/${userId}/?is-owner=${isOwner}`)

        return response.data
    } catch (e) {
        throw(e.response.data.detail)
    }
}

export const getGroupInfo = async (groupId) => {
    try {
        const response = await axiosInstance.get(`/groups/${groupId}/`)
        return response.data
    } catch (e) {
        throw(e.response.data.detail)
    }
}

export const followUnfollow = async (groupId) => {
    try {
        const response = await axiosInstance.post(`/groups/${groupId}/follow_unfollow/`)
        return response.data.status
    } catch (e) {
        throw(e.response.data.detail)
    }
}

export const createGroup = async (groupInfo) => {
    try {
        const response = await axiosInstance.post('/groups/', groupInfo)
        return response.data.id
    } catch (e) {
        throw(JSON.stringify(e.response.data))
    }
}

export const updateGroup = async (groupId, groupInfo) => {
    try {
        const response = await axiosInstance.put(`/groups/${groupId}/`, groupInfo)
        return response.data
    } catch (e) {
        toast.error(JSON.stringify(e.response.data))
    }
}