import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'material-icons/iconfont/material-icons.css';
import 'react-toastify/dist/ReactToastify.css';
import {Provider} from 'react-redux';
import store from './redux/store';
import axios from 'axios';
import {URL} from './config';
import {ToastContainer} from "react-toastify";
import Router from './components/Router'


export const axiosInstance = axios.create({
    baseURL: URL,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <React.StrictMode>
            <ToastContainer/>
            <Router/>
        </React.StrictMode>
    </Provider>
);

reportWebVitals();
