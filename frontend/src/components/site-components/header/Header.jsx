import styles from './header.module.css'
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser} from '../../../redux/actions/authAction';
import {useState} from "react";


function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.user.profile);
    const newNotificationsCount = useSelector((state) => state.notification.newNotificationsCount)

    const handleLogout = () => {
        dispatch(logoutUser());
        return <Navigate to={''}></Navigate>
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            navigate(`/search?type=users&query=${searchQuery}`);
            setSearchQuery('')
        }
    };

    return (
        <ul className={styles.header}>
            <li className={styles.logo}>
                <img alt='Sonet' src={'/images/sonet_logo.png'}></img>
            </li>
            <li className={styles.search}>
                <div className={styles.innerSearch}>
                    <span className={styles.searchBox}>
                        <input type='text' placeholder='Поиск' value={searchQuery}
                               onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={handleKeyPress}></input>
                        <Link to={`/search?type=users&query=${searchQuery}`}>
                            <i className="material-icons">search</i>
                        </Link>
                    </span>
                    {searchQuery && (
                        <>
                            <span className={styles.searchSuggestion} onClick={(e) => setSearchQuery('')}>
                                <Link to={`/search?type=users&query=${searchQuery}`}>Искать {searchQuery} в людях</Link>
                            </span>
                            <span className={styles.searchSuggestion} onClick={(e) => setSearchQuery('')}>
                              <Link
                                  to={`/search?type=groups&query=${searchQuery}`}>Искать {searchQuery} в группах</Link>
                            </span>
                        </>
                    )}
                </div>
            </li>
            <li className={styles.notifications}>
                <Link to={`/notifications/`}>
                    <i className="material-icons">notifications</i>
                    {!!newNotificationsCount
                        ? <span>{newNotificationsCount}</span>
                        : <span></span>
                    }
                </Link>
            </li>
            <li className={styles.avatar}>
                <Link to={`/users/${profile.username}`}>
                    <img alt='avatar' src={profile.avatar}/>
                </Link>
            </li>

            <li className={styles.exit}>
                <i className="material-icons" onClick={handleLogout}>logout</i>
            </li>
        </ul>
    );
}

export default Header