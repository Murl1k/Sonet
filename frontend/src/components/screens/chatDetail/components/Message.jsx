import styles from './message.module.css'
import moment from "moment/moment";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

function Message({messageInfo}) {
    const author = messageInfo?.author
    const currentUser = useSelector((state) => state.user.profile);

    const created = moment(messageInfo?.created_at);
    const showTimeOnly = moment().diff(created, 'days') < 1;

    return (
        <div className={styles.message}>
            <Link to={`/users/${author?.username}`}>
                <img className={styles.messageAvatar} title={author?.username} src={author?.avatar}
                     alt='author avatar'/>
            </Link>
            <span className={styles.messageText} title={messageInfo.content}>{messageInfo.content}</span>
            {currentUser.id === author?.id
                ? <span className={styles.readed}>
                    {messageInfo.is_readed ?
                        <i className='material-icons' title='Прочитано'>done_all</i>
                        : <i className='material-icons' title='Отправлено'>done</i>}
                    </span>
                : <></>
            }
            <span className={styles.messageTime}>
                {showTimeOnly
                    ? created.format('HH:mm')
                    : created.format('DD.MM.YY HH:mm')}
            </span>
        </div>
    )
}

export default Message