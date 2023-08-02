import FriendItem from "./FriendItem";
import styles from './friendItems.module.css'
import {useState} from "react";
import {acceptFriendRequest, deleteFriendRequest} from "../../../../redux/actions/friendAction";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";

function FriendRequestRecieved({friendRequestId, userId, avatarUrl, fullName, username, isCurrentUserFriendsList}) {
    const [accepted, setAccepted] = useState(false);
    const [declined, setDeclined] = useState(false);
    const currUserId = useSelector((state) => state.user.profile.id);

    const acceptRequest = async () => {
        try {
            await acceptFriendRequest(userId, currUserId)
            setAccepted(true)
        } catch (e) {
            toast.error(e)
        }
    }

    const declineRequest = async () => {
        try {
            await deleteFriendRequest(friendRequestId)
            setDeclined(true)
        } catch (e) {
            toast.error(e)
        }
    }

    if (!isCurrentUserFriendsList) {
        return <FriendItem id={friendRequestId} avatarUrl={avatarUrl} fullName={fullName} username={username}/>;
    }

    if (accepted) {
        return <FriendItem id={friendRequestId} avatarUrl={avatarUrl} fullName={fullName} username={username} actions={
            <span className={styles.success}>Заявка принята</span>
        }/>;
    }

    if (declined) {
        return <FriendItem id={friendRequestId} avatarUrl={avatarUrl} fullName={fullName} username={username} actions={
            <span className={styles.success}>Заявка отменена</span>
        }/>;
    }

    return <FriendItem id={friendRequestId} avatarUrl={avatarUrl} fullName={fullName} username={username} actions={
        <span className={styles.actions}>
        <span onClick={acceptRequest}>
          Принять заявку
        </span>
        <span onClick={declineRequest}>
          Отклонить заявку
        </span>
      </span>
    }/>;
}

export default FriendRequestRecieved