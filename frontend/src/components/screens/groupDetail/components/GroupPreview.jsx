import styles from './groupPreview.module.css'
import {useState} from "react";
import {followUnfollow} from "../../../../redux/actions/groupAction";
import {useSelector} from "react-redux";
import GroupForm from "../../groupEdit/components/GroupForm";
import {toast} from "react-toastify";

function GroupPreview({groupInfo, setGroupInfo}) {
    const userId = useSelector((state) => state.user.profile.id)
    const [followStatus, setFollowStatus] = useState(groupInfo.status)
    const isOwner = groupInfo.owner.id === userId
    const [showEditForm, setShowEditForm] = useState(false);

    const followUnfollowAction = async () => {
        try {
            const status = await followUnfollow(groupInfo.id)
            setFollowStatus(status)
        } catch (e) {
            toast.error(e)
        }

    }

    const renderFollowActions = () => {
        if (!followStatus) {
            return
        }

        switch (followStatus) {
            case 'followed':
                return <span onClick={() => followUnfollowAction()}>Отписаться</span>
            case 'unfollowed':
                return <span onClick={() => followUnfollowAction()}>Подписаться</span>
            default:
                return ''
        }
    }

    return (<div className={styles.groupPreview}>
        <img src={groupInfo.avatar} alt='user-avatar'/>
        <div className={styles.groupInfo}>
            <b>{groupInfo.name}</b>
            {groupInfo.description && (
                <span className={styles.groupDescription}>{groupInfo.description}</span>
            )}
        </div>
        <div className={styles.groupStats}>
            <span>Подписчики <b>{groupInfo.members_count}</b></span>
        </div>
        <div className={styles.actions}>
            {isOwner && (<span onClick={() => setShowEditForm(true)}> Редактировать</span>)}
            {renderFollowActions()}
        </div>

        {showEditForm && (
            <div className={styles.groupFormWrapper}>
                <div className={styles.groupFormBackground} onClick={() => setShowEditForm(false)}/>
                <div className={styles.groupFormContainer}>
                    <GroupForm id={groupInfo.id} setGroupData={setGroupInfo} groupData={groupInfo}/>
                </div>
            </div>
        )}
    </div>)
}

export default GroupPreview