import BasePageWithSidebar from "../../abstract-sreens/sitePage/BasePageWithSidebar"
import GroupPreview from "./components/GroupPreview"
import styles from './group.module.css'
import PostList from "./components/PostList";
import {useEffect, useState} from "react";
import {getGroupInfo} from "../../../redux/actions/groupAction";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";

function GroupDetail() {
    const [groupInfo, setGroupInfo] = useState(undefined)
    const {id} = useParams();

    useEffect(() => {
            const fetchGroupInfo = async () => {
                try {
                    const data = await getGroupInfo(id);
                    setGroupInfo(data)
                } catch (e) {
                    toast.error(e)
                }

            }
            fetchGroupInfo()
        },
        [id]
    )

    if (!groupInfo) {
        return <BasePageWithSidebar></BasePageWithSidebar>
    }

    return (<BasePageWithSidebar content={
        <div className={styles.groupPage}>
            <GroupPreview groupInfo={groupInfo} setGroupInfo={setGroupInfo}/>
            <PostList groupInfo={groupInfo}/>
        </div>
    }/>)
}

export default GroupDetail;