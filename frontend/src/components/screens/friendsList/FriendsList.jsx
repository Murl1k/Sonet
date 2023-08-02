import BasePageWithSidebar from "../../abstract-sreens/sitePage/BasePageWithSidebar";
import FriendItem from "./components/FriendItem";
import FriendRequestRecieved from "./components/FriendRequestRecieved";
import FriendRequestSent from "./components/FriendRequestSent";
import styles from './friendsList.module.css'
import ContentLeftSidebar from "../../site-components/contentSidebar/ContentLeftSidebar";
import {NavLink, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {getFriendList, getFriendRequests} from "../../../redux/actions/friendAction";
import {toast} from "react-toastify";

function FriendsList() {
    const dispatch = useDispatch();
    const currUserId = useSelector((state) => state.user.profile.id);
    const [friends, setFriends] = useState(undefined);

    const location = useLocation();
    const userIdParam = new URLSearchParams(location.search).get('user_id');
    const userId = userIdParam || currUserId;
    const typeParam = new URLSearchParams(location.search).get('type');
    const isCurrentUserFriendlist = JSON.stringify(currUserId) === userId;

    useEffect(() => {
        const fetchFriends = async () => {
            let data;
            try {
                if (!typeParam) {
                    data = await getFriendList(userId);
                } else {
                    data = await getFriendRequests(userId, typeParam);
                }
            } catch (e) {
                toast.error(e)
            }

            setFriends(data);
        };
        fetchFriends();
    }, [dispatch, userId, typeParam]);

    return (
        <BasePageWithSidebar
            content={
                <div className={styles.friendsList}>
                    <h1>Список друзей</h1>
                    {friends && friends.length > 0 ? (
                        <div className={styles.friends}>
                            {friends.map((item) => {
                                if (typeParam === 'recieved') {
                                    return (
                                        <FriendRequestRecieved
                                            key={item.user.id}
                                            friendRequestId={item.id}
                                            userId={item.user.id}
                                            avatarUrl={item.user.avatar}
                                            fullName={`${item.user.first_name} ${item.user.last_name}`}
                                            username={item.user.username}
                                            isCurrentUserFriendsList={isCurrentUserFriendlist}
                                        />
                                    );
                                } else if (typeParam === 'sent') {
                                    return (
                                        <FriendRequestSent
                                            key={item.id}
                                            friendRequestId={item.id}
                                            avatarUrl={item.user.avatar}
                                            fullName={`${item.user.first_name} ${item.user.last_name}`}
                                            username={item.user.username}
                                            isCurrentUserFriendlist={isCurrentUserFriendlist}
                                        />
                                    );
                                } else {
                                    return (
                                        <FriendItem
                                            key={item.user.id}
                                            avatarUrl={item.user.avatar}
                                            fullName={`${item.user.first_name} ${item.user.last_name}`}
                                            username={item.user.username}
                                        />
                                    );
                                }
                            })}
                        </div>
                    ) : (
                        <div>Не найдено</div>
                    )}
                    <ContentLeftSidebar
                        children={[
                            <NavLink key={'friends'} to={{
                                pathname: location.pathname,
                                search: `?user_id=${userId}&type=`
                            }}>Друзья</NavLink>,
                            <NavLink key={'followers'}
                                     to={{pathname: location.pathname, search: `?user_id=${userId}&type=recieved`}}>Входящие
                                заявки</NavLink>,
                            <NavLink key={'following'}
                                     to={{pathname: location.pathname, search: `?user_id=${userId}&type=sent`}}>Исходящие
                                заявки</NavLink>,
                        ]}
                    />
                </div>
            }/>
    );
}

export default FriendsList;
