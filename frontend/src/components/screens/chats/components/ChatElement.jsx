import styles from './interlocutor.module.css'
import { Link } from 'react-router-dom';
import moment from "moment";

function ChatElement({ chatInfo }) {
    const user = chatInfo?.user;
    const updated = moment(chatInfo.updated);

    const showTimeOnly = moment().diff(updated, 'days') < 1;

    return (
        <Link className={`${styles.interlocutor} ${chatInfo.unread_messages ? styles.unreadChat : ''}`} to={`/chats/${user?.id}/`}>
      <span className={styles.updated}>
        {showTimeOnly
            ? updated.format('HH:mm')
            : updated.format('DD.MM.YY HH:mm')}
      </span>
            <img className={styles.interlocutorAvatar} src={user?.avatar} alt='avatar'/>
            <b className={styles.interlocutorName}>{user?.first_name} {user?.last_name}</b>
            <span className={styles.lastMessage}>
                {!chatInfo?.is_typing
                    ? chatInfo?.latest_message?.content.length > 60
                        ? `${chatInfo?.latest_message?.content.slice(0, 60)}...`
                        : chatInfo?.latest_message?.content
                    : `${chatInfo?.user.first_name} печатает...`
                }
            </span>
                {!!chatInfo.unread_messages
                    ? <span className={styles.unread}>{chatInfo.unread_messages}</span>
                    : <></>
                }

        </Link>
    );
}

export default ChatElement