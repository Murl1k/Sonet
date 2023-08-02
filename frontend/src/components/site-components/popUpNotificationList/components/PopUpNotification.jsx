import styles from '../popUpNotifications.module.css'
import {useDispatch} from "react-redux";
import {URL} from "../../../../config";
import {readNotificationById} from "../../../../redux/actions/notificationAction";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";

export function PopUpNotification({data, setNotificationsList}) {
    const dispatch = useDispatch()

    const handleRemove = async () => {
        dispatch(readNotificationById({id: data?.id})).unwrap().catch((e) => toast.error(e))
        setNotificationsList(prevList => prevList.filter(notification => notification.id !== data.id));
    }

    let content;
    let urlTo;

    switch (data.type) {
        case 'like':
            content = 'оценил ваш пост'
            urlTo = `/users/${data.item.author.username}/`
            break
        case 'message':
            content = 'отправил вам сообщение'
            urlTo = `/chats/${data.item.author.id}/`
            break
        case 'friend_request':
            content = 'добавляет вас в друзья'
            urlTo = `/friends?user_id=1&type=recieved`
            break
        case 'friend_request_accepted':
            content = 'принял вашу заявку в друзья'
            urlTo = `/users/${data.item.username}/`
            break
        default:
            content = ''
            urlTo = ''
    }


    return (
        <div className={styles.notification}>
            <img className={styles.image}
                 src={`${URL}${data.from_user.avatar}`}
                 alt={'notification_image'}
            />
            <Link to={urlTo} className={styles.content}
                  onClick={handleRemove}>{data.from_user.username} {content}</Link>
            <span className={styles.delete} onClick={handleRemove}><i className='material-icons'>close</i></span>

        </div>
    )
}