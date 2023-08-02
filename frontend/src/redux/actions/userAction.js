import {removeToken, setToken} from '../slices/authSlice';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {setProfile} from '../slices/userSlice';
import {axiosInstance} from '../..';


export const loadUser = createAsyncThunk('user/load', async (_, {dispatch}) => {
    const token = localStorage.getItem('token')
    if (!token) {
        return
    }
    try {
        const response = await axiosInstance.get(`/auth/users/me/`);

        if (response.status === 200) {
            dispatch(setToken(token))
            dispatch(setProfile(response.data))
        }
    } catch (error) {
        const responseDetail = error.response.data.detail;
        if (token && responseDetail === 'Invalid token.') {
            dispatch(removeToken());
        }
    }
})


export const getProfileByUsername = async (username) => {
    try {
        const response = await axiosInstance.get(`/auth/users/by-username/${username}/`);
        return response.data;
    } catch (error) {
        throw(error.response.data.detail)
    }
};

export const getProfileById = async (id) => {
    try {
        const response = await axiosInstance.get(`/auth/users/${id}/`);
        return response.data;
    } catch (error) {
        throw(error.response.data.detail)
    }
};


export const updateProfile = createAsyncThunk('user/update', async ({userId, profile}, {dispatch, rejectWithValue}) => {
    try {
        const response = await axiosInstance.patch(`/auth/users/${userId}/`, profile);
        dispatch(setProfile(response.data))
    } catch (error) {
        rejectWithValue(error.response.data)
    }
})