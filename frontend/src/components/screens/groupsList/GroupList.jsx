import BasePageWithSidebar from "../../abstract-sreens/sitePage/BasePageWithSidebar";
import GroupElement from "./components/GroupElement";
import styles from './groupList.module.css'
import ContentLeftSidebar from "../../site-components/contentSidebar/ContentLeftSidebar"
import {NavLink, useLocation} from "react-router-dom"
import {useEffect, useState} from "react";
import {getGroupsByUser} from "../../../redux/actions/groupAction";
import {useSelector} from "react-redux";
import GroupCreateForm from "../groupEdit/components/GroupCreateForm";
import {toast} from "react-toastify";

function GroupList() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [groups, setGroups] = useState([]);
    const userId = useSelector((state) => state.user.profile.id);
    const location = useLocation();
    const isOwner = new URLSearchParams(location.search).get('is-owner');

    useEffect(() => {
        async function fetchGroups() {
            try {
                const data = await getGroupsByUser(userId, isOwner);
                setGroups(data);
            } catch (e) {
                toast.error(e)
            }

        }

        fetchGroups();
    }, [userId, isOwner]);

    return (
        <BasePageWithSidebar
            content={
                <div className={styles.groupsPage}>
                    <h1>Группы</h1>
                    {groups && groups.length > 0 ? (
                        <div className={styles.groups}>
                            {groups.map((group) => (
                                <GroupElement
                                    key={group.id}
                                    avatarUrl={group.avatar}
                                    id={group.id}
                                    groupName={group.name}
                                    membersCount={group.members_count}
                                />
                            ))}
                        </div>
                    ) : (
                        <div>Не найдено</div>
                    )}

                    <div className={styles.sidebar}>
                        <ContentLeftSidebar
                            children={[
                                <NavLink
                                    key={'following-groups'} to={{pathname: location.pathname, search: `?is-owner=0`}}
                                >
                                    Все группы
                                </NavLink>,
                                <NavLink
                                    key={'owning-groups'} to={{pathname: location.pathname, search: `?is-owner=1`}}
                                >
                                    Владение группами
                                </NavLink>,
                            ]}
                        />
                        <span onClick={() => setShowCreateForm(true)}
                              className={styles.createGroup}>Создать группу</span>
                    </div>

                    {showCreateForm && (
                        <div className={styles.groupFormWrapper}>
                            <div className={styles.groupFormBackground} onClick={() => setShowCreateForm(false)}/>
                            <div className={styles.groupFormContainer}><GroupCreateForm/></div>
                        </div>
                    )}
                </div>
            }
        />
    );
}

export default GroupList