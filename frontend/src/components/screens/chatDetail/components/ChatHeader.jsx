import styles from "../chatDetail.module.css";
import {Link} from "react-router-dom";

export function ChatHeader({userInfo}) {
    return (
        <div className={styles.messagerHeader}>
            <div className={styles.interlocutor}>
                <Link to={`/users/${userInfo?.username}`}><img src={userInfo?.avatar} alt='avatar'/></Link>
                <span className={styles.interlocutorInfo}>
					<span className={styles.interlocutorName}>{`${userInfo?.first_name} ${userInfo?.last_name}`}</span>
					<Link className={styles.userTag}
                          to={`/users/${userInfo?.username}`}>{`@${userInfo?.username}`}</Link>
				</span>
            </div>
        </div>
    )
}