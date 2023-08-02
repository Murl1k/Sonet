import styles from '../groupEdit.module.css'
import {useState} from "react";
import {createGroup} from "../../../../redux/actions/groupAction";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export default function GroupCreateForm() {
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [groupAvatar, setGroupAvatar] = useState(undefined);

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
            const groupId = await createGroup(formData);
            if (groupId) {
                navigate(`/groups/${groupId}/`);
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