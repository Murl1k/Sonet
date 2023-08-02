import FriendItem from "./FriendItem";
import styles from './friendItems.module.css'
import {useState} from "react";
import {deleteFriendRequest} from "../../../../redux/actions/friendAction";
import {toast} from "react-toastify";

function FriendRequestSent({friendRequestId, avatarUrl, fullName, username, isCurrentUserFriendlist}) {
    const [isCanceled, setIsCanceled] = useState(false);

    const cancelRequest = async () => {
        try {
            await deleteFriendRequest(friendRequestId)
            setIsCanceled(true);
        } catch (e) {
            toast.error(e)
        }

    };

    if (!isCurrentUserFriendlist) {
        return <FriendItem id={friendRequestId} avatarUrl={avatarUrl} fullName={fullName} username={username}/>
    }

    if (isCanceled) {
        return <FriendItem id={friendRequestId} avatarUrl={avatarUrl} fullName={fullName} username={username} actions={
            <div className={styles.success}>Заявка отменена</div>
        }/>
    }

    return <FriendItem id={friendRequestId} avatarUrl={avatarUrl} fullName={fullName} username={username} actions={
        <span className={styles.actions}>
            <span className={styles.decline} onClick={cancelRequest}>
                Отменить заявку
            </span>
        </span>
    }/>
}


export default FriendRequestSent