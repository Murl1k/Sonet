import styles from './basePage.module.css'
import Header from '../../site-components/header/Header'
import {Navigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from "react";
import {loadNotifications} from "../../../redux/actions/notificationAction";
import {toast} from "react-toastify";


function BasePage({pageContent}) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    const dispatch = useDispatch()

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(loadNotifications()).unwrap().catch((e) => toast.error(e))
        }
    }, [dispatch, isAuthenticated])

    if (!isAuthenticated) {
        return <Navigate to={'/login'}/>
    }

    return (
        <div className={styles.page}>
            <Header/>
            {pageContent}
        </div>
    )
}

export default BasePage