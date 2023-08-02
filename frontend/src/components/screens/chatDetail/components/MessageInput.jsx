import styles from "../chatDetail.module.css";
import {useState} from "react";
import {useSelector} from "react-redux";


export function MessageInput({socket, setTypingUser, typingUser}) {
    const [message, setMessage] = useState('');
    const currentUser = useSelector((state) => state.user.profile);
    const [lastInputTime, setLastInputTime] = useState(null);

    const handleInputChange = (event) => {
        setMessage(event.target.value);

        const currentTime = Date.now();
        if (!lastInputTime || currentTime - lastInputTime > 1500) {
            if (!typingUser) {
                socket.send(JSON.stringify({
                    command: 'typing'
                }));
            }
            setLastInputTime(currentTime);
        }
    };

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            socket.send(JSON.stringify({
                command: 'create_message',
                message: message
            }));
            setMessage('');
            setTypingUser(null)
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            <div className={styles.messageInput}>
              <textarea
                  placeholder="Введите сообщение"
                  maxLength="1024"
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
              ></textarea>
                <i className="material-icons" onClick={handleSendMessage}>
                    send
                </i>
            </div>
            {typingUser && (typingUser.id !== currentUser.id)
                ? <span>{typingUser.first_name} печатает...</span>
                : ''
            }
        </>
    );
}