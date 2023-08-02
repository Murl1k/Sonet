import styles from './sidebar.module.css'
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

function Sidebar() {
    const username = useSelector((state) => state.user.profile.username)
    const newNotificationsCount = useSelector((state) => state.notification.newNotificationsCount)

    return (
        <ol className={styles.sidebar}>
            <li><Link to={`/users/${username}`}><i className="material-icons">account_circle</i>Профиль</Link></li>
            <li><Link to={'/main'}><i className="material-icons">article</i>Новости</Link></li>
            <li><Link to={'/chats'}><i className="material-icons">chat</i>Чаты</Link></li>
            <li><Link to={'/search'}><i className="material-icons">search</i>Поиск</Link></li>
            <li><Link to={'/friends'}><i className="material-icons">group</i>Друзья</Link></li>
            <li><Link to={'/groups'}><i className="material-icons">group_work</i>Группы</Link></li>
            <li>
                <Link to={'/notifications'}>
                    <i className="material-icons">notifications</i>
                    Уведомления
                    {newNotificationsCount > 0
                        ? <span className={styles.count}>{newNotificationsCount}</span>
                        : ''
                    }
                </Link>
            </li>
        </ol>
    )
}

export default Sidebar