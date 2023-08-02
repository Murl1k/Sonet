import styles from './popUpNotifications.module.css'
import {PopUpNotification} from "./components/PopUpNotification";
import {useEffect, useState} from "react";
import {SHORT_URL} from "../../../config";
import {useDispatch, useSelector} from "react-redux";
import {setNewNotificationsCount} from "../../../redux/slices/notificationSlice";


export function PopUpNotificationList() {
    const [socket, setSocket] = useState(null)
    const token = localStorage.getItem("token");
    const [notificationsList, setNotificationsList] = useState([])
    const newNotificationsCount = useSelector((state) => state.notification.newNotificationsCount)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!token) {
            return
        }

        const newSocket = new WebSocket(`ws://${SHORT_URL}/notifications/?token=${token}`);
        setSocket(newSocket);
        newSocket.onopen = () => {
            console.log('Соединение установлено')
        };
        newSocket.onclose = () => {
            console.log('Соединение потеряно')
        }

        return () => {
            newSocket.close();
        };
    }, [token])

    if (socket) {
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const command = data.command

            switch (command) {
                case 'notify_user':
                    const updatedNotificationsList =
                        notificationsList.length >= 3
                            ? [...notificationsList.slice(1), data.notification]
                            : [...notificationsList, data.notification];
                    setNotificationsList(updatedNotificationsList);
                    dispatch(setNewNotificationsCount(newNotificationsCount + 1))
                    break
                default:
                    console.log(command)
            }
        }
    }

    return (
        <div className={styles.popUpNotifications}>
            {notificationsList.map((notification) => (
                <PopUpNotification
                    key={notification.id}
                    data={notification}
                    setNotificationsList={setNotificationsList}
                />
            ))}
        </div>
    )
}