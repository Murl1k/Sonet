import BasePageWithSidebar from "../../abstract-sreens/sitePage/BasePageWithSidebar"
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateProfile} from '../../../redux/actions/userAction';
import styles from './userProfileCustomize.module.css';
import {toast} from "react-toastify";

function UserProfileCustomize() {
    const user = useSelector((state) => state.user.profile);
    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [status, setStatus] = useState(user.status);
    const [avatar, setAvatar] = useState(null);

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };
    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };
    const handleAvatarChange = (event) => {
        setAvatar(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('status', status);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        dispatch(updateProfile({
            userId: user.id,
            profile: formData
        })).unwrap().catch((e) => toast.error(JSON.stringify(e)));
    };

    return (
        <BasePageWithSidebar content={
            <div className={styles.editPage}>
                <h1>Редактирование страницы</h1>
                <form onSubmit={handleSubmit} className={styles.editUserForm}>
                    <div>
                        <label>Имя:</label>
                        <input maxLength={30} type="text" value={firstName} onChange={handleFirstNameChange}/>
                    </div>
                    <div>
                        <label>Фамилия:</label>
                        <input maxLength={30} type="text" value={lastName} onChange={handleLastNameChange}/>
                    </div>
                    <div>
                        <label>Статус:</label>
                        <input maxLength={256} type="text" value={status} onChange={handleStatusChange}/>
                    </div>
                    <div>
                        <label>Аватар:</label>
                        <input type="file" accept="image/*" onChange={handleAvatarChange}/>
                    </div>
                    <button type="submit">Отредактировать</button>
                </form>
            </div>
        }/>
    );
}

export default UserProfileCustomize;