import BasePageWithSidebar from "../../abstract-sreens/sitePage/BasePageWithSidebar";
import styles from './notifications.module.css';
import NotificationItem from "./components/NotificationItem";
import {useDispatch, useSelector} from "react-redux";
import {
    loadNotifications,
    readAllNotifications,
    removeAllNotifications,
} from "../../../redux/actions/notificationAction";
import {useEffect} from "react";
import {toast} from "react-toastify";

function Notifications() {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notification.notificationList);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(loadNotifications()).unwrap().catch((e) => toast.error(e))
        };

        setTimeout(() => {
            fetchData().then(() => {
                dispatch(readAllNotifications()).unwrap().catch((e) => toast.error(e));
            });
        }, 0);
    }, [dispatch]);

    const handleRemoveAll = async () => {
        dispatch(removeAllNotifications()).unwrap().catch((e) => toast.error(e));
    };

    return (
        <BasePageWithSidebar
            content={
                <div className={styles.notificationsPage}>
                    <h1>Уведомления</h1>
                    <div className={styles.removeBox} onClick={handleRemoveAll}>
                        <span className={styles.remove}>Удалить все</span>
                    </div>
                    <div className={styles.notifications}>
                        {notifications.map((notification) => (
                            <NotificationItem key={notification.id} info={notification}/>
                        ))}
                    </div>
                </div>
            }
        />
    );
}

export default Notifications