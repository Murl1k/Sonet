import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        notification: notificationReducer,
    },
});

export default store;