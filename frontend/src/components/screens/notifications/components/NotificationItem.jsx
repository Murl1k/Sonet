import styles from './notificationItem.module.css';
import {removeNotificationById} from "../../../../redux/actions/notificationAction";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";

function NotificationItem({info}) {
    const dispatch = useDispatch();
    const author = info?.from_user;

    const handleRemove = async () => {
        dispatch(removeNotificationById({
            id: info?.id
        })).unwrap().catch((e) => toast.error(e));
    };

    let content;
    let urlTo;

    switch (info.type) {
        case 'like':
            content = 'оценил ваш пост'
            urlTo = `/users/${info.item.author.username}/`
            break
        case 'message':
            content = 'отправил вам сообщение'
            urlTo = `/chats/${info.item.author.id}/`
            break
        case 'friend_request':
            content = 'добавляет вас в друзья'
            urlTo = `/friends?user_id=1&type=recieved`
            break
        case 'friend_request_accepted':
            content = 'принял вашу заявку в друзья'
            urlTo = `/users/${info.item.username}/`
            break
        default:
            content = ''
            urlTo = ''
    }


    return (
        <div className={`${styles.notification} ${info?.is_read ? '' : styles.unread}`}>
            <img className={styles.userAvatar} src={author?.avatar} alt="avatar"/>
            <Link to={urlTo} className={styles.action}>
                <b>{author?.first_name} {author?.last_name}</b> {content}
            </Link>
            <span className={styles.remove} onClick={handleRemove}>
        <i className="material-icons">close</i>
      </span>
        </div>
    );
}

export default NotificationItem