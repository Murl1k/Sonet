import styles from '../groupEdit.module.css'
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getGroupInfo, updateGroup} from "../../../../redux/actions/groupAction";
import {toast} from "react-toastify";
import {Navigate, useNavigate} from "react-router-dom";

export default function GroupForm({id, setGroupData, groupData}) {
    const navigate = useNavigate()
    const userId = useSelector((state) => state.user.profile.id)
    const [groupInfo, setGroupInfo] = useState(undefined)
    const [groupName, setGroupName] = useState('')
    const [groupDescription, setGroupDescription] = useState('')
    const [groupAvatar, setGroupAvatar] = useState(undefined)

    useEffect(() => {
        const fetchGroupInfo = async () => {
            try {
                const data = await getGroupInfo(id)

                setGroupInfo(data)
                setGroupName(data.name)
                setGroupDescription(data.description)
            } catch (e) {
                toast.error(e)
            }

        }

        if (!groupData) {
            fetchGroupInfo()
        } else {
            setGroupInfo(groupData)
            setGroupName(groupData.name)
            setGroupDescription(groupData.description)
        }
    }, [id, groupData])

    if (!groupInfo) {
        return ''
    }

    if (groupInfo.owner.id !== userId) {
        toast.error('Запрещено')
        return <Navigate to={'/groups/'}></Navigate>
    }

    const handleNameChange = (e) => {
        setGroupName(e.target.value);
    };
    const handleDescriptionChange = (e) => {
        setGroupDescription(e.target.value);
    };
    const handleAvatarChange = (e) => {
        setGroupAvatar(e.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', groupName);
        formData.append('description', groupDescription);
        if (groupAvatar) {
            formData.append('avatar', groupAvatar);
        }

        try {
            const data = await updateGroup(groupInfo.id, formData);

            if (window.location.pathname === `/groups/${groupInfo.id}`) {
                setGroupData(data)
            } else {
                navigate(`/groups/${groupInfo.id}`);
            }
        } catch (e) {
            toast.error(e)
        }


    };

    return (<form className={styles.groupForm} onSubmit={handleSubmit}>
        <div>
            <label>Имя группы</label>
            <input maxLength={50} type={"text"} value={groupName} onChange={handleNameChange}/>
        </div>
        <div>
            <label>Описание группы</label>
            <input maxLength={255} type={"text"} value={groupDescription} onChange={handleDescriptionChange}/>
        </div>
        <div>
            <label>Аватар</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange}/>
        </div>

        <button type={"submit"}>Сохранить</button>
    </form>)
}