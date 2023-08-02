import {axiosInstance} from '../..';


export const getGroupPosts = async (groupId, nextPage) => {
    try {
        let response;
        if (nextPage) {
            response = await axiosInstance.get(nextPage)
        } else {
            response = await axiosInstance.get(`/posts-by-group/${groupId}/`)
        }
        return response.data
    } catch (e) {
        throw(e.response.data.detail)
    }
}

export const getUserPosts = async (userId, nextPage) => {
    try {
        let response;
        if (nextPage) {
            response = await axiosInstance.get(nextPage)
        } else {
            response = await axiosInstance.get(`/posts-by-user/${userId}/`)
        }
        return response.data
    } catch (e) {
        throw(e.response.data.detail)
    }
}


export const likeUnlike = async (postId) => {
    try {
        const response = await axiosInstance.post(`/posts/${postId}/like_unlike/`)
        return response.data
    } catch (e) {
        throw(e.response.data.detail)
    }
}


export const deletePost = async (postId) => {
    try {
        const response = await axiosInstance.delete(`/posts/${postId}/`)

        return response.status
    } catch (e) {
        throw(e.response.data.detail)
    }
}


export const createPost = async (postData) => {
    try {
        const response = await axiosInstance.post('/posts/', postData)
        return response.data
    } catch (e) {
        throw(JSON.stringify(e.response.data))
    }
}

export const getUserFeed = async (nextPage) => {
    try {
        let response;
        if (nextPage) {
            response = await axiosInstance.get(nextPage)
        } else {
            response = await axiosInstance.get(`/userfeed/`)
        }

        return response.data
    } catch (e) {
        throw(JSON.stringify(e.response.data))
    }
}