import styles from './userPreview.module.css'
import {Link} from 'react-router-dom';

import {UserProfileActions} from "./UserProfileActions";

function UserPreview({userInfo}) {
    return (
        <div className={styles.userPreview}>
            <img src={userInfo?.avatar} alt='user-avatar'/>
            <div className={styles.userDescription}>
          <span>
            <b>{userInfo.first_name} </b>
            <b>{userInfo.last_name}</b>
          </span>
                <span className={styles.username}>@{userInfo.username}</span>
                {userInfo?.status
                    ? <span className={styles.userStatus}>{userInfo.status}</span>
                    : <></>
                }
            </div>
            <div className={styles.userStats}>
                <Link to={`/friends/?user_id=${userInfo.id}`}>
                    Друзья <b>{userInfo.friends_count}</b>
                </Link>
                <Link to={`/friends/?user_id=${userInfo.id}&type=recieved`}>
                    Подписчики <b>{userInfo.followers_count}</b>
                </Link>
                <Link to={`/friends/?user_id=${userInfo.id}&type=sent`}>
                    Подписок <b>{userInfo.following_count}</b>
                </Link>
            </div>
            <UserProfileActions userId={userInfo.id}/>
        </div>
    );
}

export default UserPreview