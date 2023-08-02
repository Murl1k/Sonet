import {createSlice} from "@reduxjs/toolkit";
import {unreadCount} from "../utils";

const initialState = {
    notificationList: [],
    newNotificationsCount: 0
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotificationList: (state, action) => {
            state.notificationList = action.payload;
            state.newNotificationsCount = unreadCount(state.notificationList)
        },
        setNewNotificationsCount: (state, action) => {
            state.newNotificationsCount = action.payload
        },
        deleteNotification: (state, action) => {
            const notificationId = action.payload;
            state.notificationList = state.notificationList.filter(
                (notification) => notification.id !== notificationId
            );
            state.newNotificationsCount = unreadCount(state.notificationList)
        },
        readNotification: (state, action) => {
            const notificationId = action.payload;
            state.notificationList = state.notificationList.map(notification => {
                if (notification.id === notificationId) {
                    return {
                        ...notification,
                        is_read: true
                    };
                }
                return notification;
            });
            state.newNotificationsCount = unreadCount(state.notificationList)
        }
    }
});

export const {setNotificationList, readNotification, deleteNotification, setNewNotificationsCount} =
    notificationSlice.actions;
export default notificationSlice.reducer;