import BasePageWithSidebar from "../../abstract-sreens/sitePage/BasePageWithSidebar"
import UserPreview from "./components/UserPreview"
import styles from './userProfile.module.css'
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getProfileByUsername} from "../../../redux/actions/userAction";
import UserPosts from "./components/UserPosts";
import {toast} from "react-toastify";


function UserProfile() {
    const {username} = useParams();
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getProfileByUsername(username);
                setProfile(data);
            } catch (error) {
                toast.error(error)
            }
        };
        loadProfile();
    }, [username, navigate]);

    if (!profile) {
        return <BasePageWithSidebar></BasePageWithSidebar>;
    }

    return (<BasePageWithSidebar content={
            <div className={styles.userProfile}>
                <UserPreview userInfo={profile}/>
                <UserPosts userId={profile.id}/>
            </div>
        }/>
    )
}

export default UserProfile