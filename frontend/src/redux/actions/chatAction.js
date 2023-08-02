import {axiosInstance} from "../../index";
import {toast} from "react-toastify";


export const getChatDetail = async (id) => {
    try {
        const response = await axiosInstance.get(`/chats/${id}/`)
        return response.data
    } catch (e) {
        throw(e)
    }
}


export const getChats = async () => {
    try {
        const response = await axiosInstance.get(`/chats/`)
        return response.data
    } catch (e) {
        toast.error(e.response.data.detail)
    }
}

export const getMessages = async (userId, nextPage) => {
    try {
        let response;
        if (nextPage) {
            response = await axiosInstance.get(nextPage)
        } else {
            response = await axiosInstance.get(`/chats/${userId}/messages/`)
        }
        return response.data
    } catch (e) {}
}