import BasePageWithSidebar from "../../abstract-sreens/sitePage/BasePageWithSidebar";
import styles from './chatDetail.module.css'
import {useEffect, useState} from "react";
import {getChatDetail, getMessages} from "../../../redux/actions/chatAction";
import {useParams} from "react-router-dom";
import {ChatHeader} from "./components/ChatHeader";
import {SHORT_URL, URL} from '../../../config'
import {MessageInput} from "./components/MessageInput";
import {MessagesList} from "./components/MessagesList";
import {getProfileById} from "../../../redux/actions/userAction";
import {useSelector} from "react-redux";

function ChatDetail() {
    const currentUser = useSelector((state) => state.user.profile);

    const [socket, setSocket] = useState(null);
    const [chatData, setChatData] = useState({});
    const [interlocutorData, setInterlocutorData] = useState({})
    const [messages, setMessages] = useState([]);
    const [typingUser, setTypingUser] = useState(null)
    const [isNewMessage, setIsNewMessage] = useState(false)

    const [nextPage, setNextPage] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [firstLoad, setFirstLoad] = useState(false);

    const {id} = useParams();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getChatDetail(id);
                setChatData(data);
                setInterlocutorData(data.user)
            } catch (e) {
                const userData = await getProfileById(id)
                setInterlocutorData(userData)
            }
        };
        fetchData();

        const newSocket = new WebSocket(`ws://${SHORT_URL}/chat/${id}/?token=${token}`);
        setSocket(newSocket);
        newSocket.onopen = () => {
            console.log('Соединение установлено')
        };
        newSocket.onclose = () => {
            console.log('Соединение потеряно')
        }
        // Закрытие соединения при размонтировании компонента
        return () => {
            newSocket.close();
        };
    }, [id, token]);

    const fetchMessages = async () => {
        const data = await getMessages(id, nextPage);
        if (!data) {
            return
        }
        setMessages((prevMessages) => [...prevMessages, ...data?.results]);
        setIsNewMessage(false)
        setNextPage(data?.next)
        setHasMore(!!data?.next);
    };

    useEffect(() => {
        if (!firstLoad) {
            setFirstLoad(true);
        }
    }, []);

    useEffect(() => {
        if (firstLoad && chatData) {
            console.log()
            fetchMessages();
        }
    }, [firstLoad]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                switch (data.command) {
                    case 'receive_message':
                        const messageData = {
                            ...data.message,
                            author: {
                                ...data.message.author,
                                avatar: `${URL}${data.message.author.avatar}`
                            }
                        };
                        setMessages(prevMessages => [messageData, ...prevMessages]);
                        if (data.message.author.id !== currentUser.id) {
                            socket.send(JSON.stringify({'command': 'read_messages'}));
                        }
                        setIsNewMessage(true)
                        break;
                    case 'typing':
                        setTypingUser(data?.user);
                        setTimeout(() => {
                            setTypingUser(null);
                        }, 2000);
                        break;
                    case 'read_messages':
                        if (messages) {
                            const updatedMessages = messages.map(message => {
                                if ((message.author.id !== data.user.id) && !message.is_readed) {
                                    return {
                                        ...message,
                                        is_readed: true
                                    };
                                }
                                return message;
                            });
                            setMessages(updatedMessages);
                        }
                        break;
                    default:
                        console.log(data);
                }
            };
        }
    }, [socket, currentUser.id, typingUser, messages]);

    return (
        <BasePageWithSidebar content={
            <div className={styles.messager}>
                <ChatHeader userInfo={interlocutorData}/>
                <MessagesList messages={messages} fetchData={fetchMessages} hasMore={hasMore}
                              isNewMessage={isNewMessage}/>
                <MessageInput socket={socket} setTypingUser={setTypingUser} typingUser={typingUser}/>
            </div>
        }/>
    );
}

export default ChatDetail;