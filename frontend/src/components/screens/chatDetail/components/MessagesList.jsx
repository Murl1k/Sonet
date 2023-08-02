import styles from "../chatDetail.module.css";
import Message from "./Message";
import {useEffect, useRef} from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export function MessagesList({messages, fetchData, hasMore, isNewMessage}) {
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current && isNewMessage) {
            const {scrollHeight, clientHeight} = messagesContainerRef.current;
            messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className={styles.messagesArea}>
            <div className={styles.messages} id="messages-container" ref={messagesContainerRef}>
                <InfiniteScroll
                    dataLength={messages.length}
                    next={fetchData}
                    hasMore={hasMore}
                    inverse={true}
                    style={{display: 'flex', flexDirection: 'column-reverse'}}
                    scrollableTarget="messages-container"
                >
                    {messages.length > 0 ? (
                        messages.map((message) => <Message messageInfo={message} key={message.id}/>)
                    ) : (
                        <div>Начните общение прямо сейчас!</div>
                    )}
                </InfiniteScroll>
            </div>
        </div>
    );
}