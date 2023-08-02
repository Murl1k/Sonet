import {Link} from "react-router-dom";
import SearchElement from "../../../site-components/searchElement/SearchElement";
import styles from './friendItems.module.css'

function FriendItem({id, avatarUrl, fullName, username, actions}) {
    return <SearchElement id={id} avatarUrl={avatarUrl} innerContent={
        <div className={styles.elementContent}>
            <span className={styles.userInfo}>
                <Link to={`/users/${username}`} className={styles.fullName}>
                    {fullName}
                </Link>
                <Link to={`/users/${username}`} className={styles.username}>
                    {`@${username}`}
                </Link>
            </span>
            {actions}
        </div>
    }/>
}

export default FriendItem