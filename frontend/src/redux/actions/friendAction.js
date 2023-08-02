import {axiosInstance} from '../..';

export const getFriendRequests = async (userId, type) => {
    try {
        const response = await axiosInstance.get(`/friend-requests/`, {
            params: {
                user_pk: userId, type: type
            }
        });


        // Конвертируем список так, чтобы в компоненте можно было пройтись по нему через map
        if (type === 'sent') {
            return response.data.map(item => {
                return {
                    user: item.to_user, id: item.id
                }
            });
        } else if (type === 'recieved') {
            return response.data.map(item => {
                return {
                    user: item.from_user, id: item.id
                }
            });
        } else {
            return []
        }
    } catch (error) {
        throw(error.response.data.detail)
    }
}

export const getFriendList = async (userId) => {
    try {
        const response = await axiosInstance.get(`/friends/`, {
            params: {
                user_pk: userId
            }
        })
        return response.data.map(item => {
            return {
                user: item
            }
        })
    } catch (error) {
        throw(error.response.data.detail)
    }
}

export const sendFriendRequest = async (userId) => {
    try {
        await axiosInstance.post('/friend-requests/', {
            'to_user': userId
        })
    } catch (error) {
        console.log(error.response.data)
        throw(error.response.data)
    }
}


export const acceptFriendRequest = async (friendId, currUserId) => {
    try {
        await axiosInstance.post('/friends/', {friend_id: friendId});
        return true
    } catch (error) {
        throw(error.response.data.detail)
    }
}

export const deleteFriendRequest = async (friendRequestId) => {
    try {
        await axiosInstance.delete(`/friend-requests/${friendRequestId}/`)
        return true
    } catch (error) {
        throw(error.response.data.detail)
    }
}

export const deleteFriend = async (friendId, currUserId) => {
    try {
        await axiosInstance.delete(`/friends/${friendId}/`)
        return true
    } catch (error) {
        throw(error.response.data.detail)
    }
}

export const getRelationshipType = async (userId) => {
    try {
        const response = await axiosInstance.get(`/auth/users/${userId}/relationship/`)
        return response.data
    } catch (error) {
        throw(error.response.data.detail)
    }
}