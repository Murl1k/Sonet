import BasePageWithSidebar from "../../abstract-sreens/sitePage/BasePageWithSidebar";
import styles from './chats.module.css'
import ChatElement from "./components/ChatElement";
import {getChats} from "../../../redux/actions/chatAction";
import {useEffect, useState} from "react";
import {SHORT_URL, URL} from "../../../config";

function Chats() {
    const [chats, setChats] = useState([]);
    const [socket, setSocket] = useState(null)
    const token = localStorage.getItem("token");


    useEffect(() => {
        const newSocket = new WebSocket(`ws://${SHORT_URL}/chatlist/?token=${token}`);
        setSocket(newSocket);
        newSocket.onopen = () => {
            console.log('Соединение установлено')
        };
        newSocket.onclose = () => {
            console.log('Соединение потеряно')
        }

        const fetchChats = async () => {
            const result = await getChats();
            setChats(result)
        };
        fetchChats();

        return () => {
            newSocket.close();
        };
    }, [token]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                data.chat.user.avatar = `${URL}${data.chat.user.avatar}`;
                switch (data.command) {
                    case 'chat_list_message':
                        setChats(prevChats => {
                            const updatedChats = prevChats.filter(chat => chat.id !== data.chat.id);
                            return [data.chat, ...updatedChats];
                        });
                        break;
                    case 'chat_list_typing':
                        setChats(prevChats => {
                            const updatedChats = prevChats.map(chat => {
                                if (chat.id === data.chat.id) {
                                    return {
                                        ...chat,
                                        is_typing: true
                                    };
                                }
                                return chat;
                            });
                            return updatedChats;
                        });
                        setTimeout(() => {
                            setChats(prevChats => {
                                const updatedChats = prevChats.map(chat => {
                                    if (chat.id === data.chat.id) {
                                        return {
                                            ...chat,
                                            is_typing: false
                                        };
                                    }
                                    return chat;
                                });
                                return updatedChats;
                            });
                        }, 2000);
                        break;
                    default:
                        console.log(data);
                }
            };
        }
    }, [socket]);


    return (
        <BasePageWithSidebar
            content={
                <div className={styles.chats}>
                    <h1>Чаты</h1>
                    {chats.length > 0 ? (
                        <div className={styles.chatsList}>
                            {chats.map((chat) => (
                                <ChatElement key={chat.id} chatInfo={chat}/>
                            ))}
                        </div>
                    ) : (<div>Найдите друзей, чтобы начать общение!</div>)

                    }
                </div>
            }
        />
    );
}

export default Chats