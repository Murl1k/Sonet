import {axiosInstance} from '../..';
import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    setNotificationList,
    readNotification,
    deleteNotification,
    setNewNotificationsCount
} from "../slices/notificationSlice";

export const loadNotifications = createAsyncThunk('notifications/load', async (_, {dispatch, rejectWithValue}) => {
    try {
        const response = await axiosInstance.get('/notifications/')
        dispatch(setNotificationList(response.data))
    } catch (e) {
        rejectWithValue(e.response.data.detail)
    }
})


export const removeAllNotifications = createAsyncThunk('notifications/remove_all', async (_, {
    dispatch,
    rejectWithValue
}) => {
    try {
        await axiosInstance.delete('/notifications/delete_all/')
    } catch (e) {
        rejectWithValue(e.response.data.detail)
    }
    dispatch(setNotificationList([]))
})

export const removeNotificationById = createAsyncThunk('notifications/remove', async ({id}, {
    dispatch,
    rejectWithValue
}) => {
    try {
        await axiosInstance.delete(`/notifications/${id}/`)

        dispatch(deleteNotification(id))
    } catch (e) {
        rejectWithValue(e.response.data.detail)
    }
})

export const readAllNotifications = createAsyncThunk('notifications/read_all', async (_, {
    dispatch,
    rejectWithValue
}) => {
    try {
        await axiosInstance.post('/notifications/read_all/')
        dispatch(setNewNotificationsCount(0))
    } catch (e) {
        rejectWithValue(e.response.data.detail)
    }
})


export const readNotificationById = createAsyncThunk('notifications/read', async ({id}, {
    dispatch,
    rejectWithValue
}) => {
    try {
        await axiosInstance.post(`/notifications/${id}/mark_as_read/`)

        dispatch(readNotification(id))
    } catch (e) {
        rejectWithValue(e.response.data.detail)
    }
})