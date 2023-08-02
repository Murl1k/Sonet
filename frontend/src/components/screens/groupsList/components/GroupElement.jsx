import SearchElement from "../../../site-components/searchElement/SearchElement";
import styles from "./groupElement.module.css"
import {Link} from "react-router-dom";

function GroupElement({id, avatarUrl, groupName, membersCount}) {
    return (
        <SearchElement id={id} avatarUrl={avatarUrl} innerContent={
            <Link to={`/groups/${id}`} className={styles.innerContent}>
                <span className={styles.groupName}>{groupName}</span>
                <span className={styles.followersCount}>{`Подписчиков: ${membersCount}`}</span>
            </Link>
        }/>)
}

export default GroupElement