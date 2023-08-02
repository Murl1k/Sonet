import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload);
        },
        removeToken: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
    },

});

export const {setToken, removeToken, register} = authSlice.actions;
export default authSlice.reducer;