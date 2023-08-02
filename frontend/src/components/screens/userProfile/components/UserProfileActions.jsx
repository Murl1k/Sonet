import {
    acceptFriendRequest,
    deleteFriend,
    deleteFriendRequest,
    getRelationshipType,
    sendFriendRequest
} from "../../../../redux/actions/friendAction";
import {useEffect, useState} from 'react';
import styles from "./userPreview.module.css";
import {useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export function UserProfileActions({userId}) {
    const [relationship, setRelationship] = useState(null);
    const currUserId = useSelector((state) => state.user.profile.id);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRelationship = async () => {
            if (userId) {
                try {
                    const data = await getRelationshipType(userId);
                    setRelationship(data);
                } catch (e) {
                    toast.error(e)
                }

            }
        };
        fetchRelationship();

    }, [userId]);

    const handleAction = async (action) => {
        try {
            switch (action) {
                case 'SEND_REQUEST':
                    await sendFriendRequest(userId)
                    break
                case 'CANCEL_REQUEST':
                    await deleteFriendRequest(relationship.object.id)
                    break
                case 'ACCEPT_REQUEST':
                    await acceptFriendRequest(userId, currUserId)
                    break
                case 'REMOVE_FRIEND':
                    await deleteFriend(userId, currUserId)
                    break
                default:
                    return
            }
        } catch (e) {
            toast.error(JSON.stringify(e))
        }


        const updatedRelationship = await getRelationshipType(userId);
        setRelationship(updatedRelationship);

    }

    const renderActions = () => {
        if (!relationship) {
            return
        }

        switch (relationship.RELATIONSHIP_TYPE) {
            case 'MY_ACCOUNT':
                return <span><Link to={'/edit'}>Редактировать</Link></span>;
            case 'FRIEND':
                return <span onClick={() => handleAction('REMOVE_FRIEND')}>Удалить из друзей</span>;
            case 'FOLLOWING':
                return <span onClick={() => handleAction('CANCEL_REQUEST')}>Отменить заявку</span>;
            case 'FOLLOWER':
                return (
                    <>
                        <span onClick={() => handleAction('ACCEPT_REQUEST')}>Принять заявку</span>
                        <span onClick={() => handleAction('CANCEL_REQUEST')}>Отклонить заявку</span>
                    </>
                );
            case 'STRANGER':
                return <span onClick={() => handleAction('SEND_REQUEST')}>Добавить в друзья</span>;
            default:
                return '';
        }
    };

    return <div className={styles.userActions}>
        {renderActions()}
        {currUserId !== userId
            ? <span onClick={() => navigate(`/chats/${userId}`)}>В чат</span>
            : <></>
        }
    </div>;
}