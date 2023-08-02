import {createAsyncThunk} from '@reduxjs/toolkit';
import {removeToken, setToken} from '../slices/authSlice';
import axios from 'axios';
import {URL} from '../../config';


export const handleLogin = createAsyncThunk(
    'auth/login',
    async (
        {username, password},
        {dispatch, rejectWithValue}
    ) => {
        try {
            const response = await axios.post(`${URL}/auth/token/login`, {
                username: username,
                password: password
            });
            const token = response.data.auth_token;
            dispatch(setToken(token));
        } catch (error) {
            return rejectWithValue(error.response.data.non_field_errors)
        }
    });


export const registerUser = createAsyncThunk('auth/register', async ({
                                                                         username,
                                                                         password,
                                                                         firstName,
                                                                         lastName
                                                                     }, {dispatch, rejectWithValue}) => {
    try {
        const response = await axios.post(`${URL}/auth/users/`, {
            username: username,
            password: password,
            first_name: firstName,
            last_name: lastName
        });

        if (response.status === 201) {
            dispatch(handleLogin({username, password}))
        }

    } catch (error) {
        const passwordErrors = error?.response?.data?.password || [];
        const usernameErrors = error?.response?.data?.username || [];

        const combinedErrors = [...passwordErrors, ...usernameErrors];
        return rejectWithValue(combinedErrors)
    }
});


export const logoutUser = createAsyncThunk('auth/logout', async (_, {dispatch}) => {
    dispatch(removeToken());
});