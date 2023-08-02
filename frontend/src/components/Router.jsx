import {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {loadUser} from '../redux/actions/userAction.js';
import WelcomePage from './screens/welcome/WelcomePage'
import LoginPage from './screens/registration/LoginPage'
import RegisterPage from './screens/registration/RegisterPage'
import UserFeed from './screens/userFeed/UserFeed';
import UserProfile from './screens/userProfile/UserProfile';
import UserProfileCustomize from './screens/userProfileCustomize/UserProfileCustomize.jsx';
import GroupDetail from './screens/groupDetail/GroupDetail';
import GroupList from './screens/groupsList/GroupList';
import Search from './screens/search/Search';
import FriendsList from './screens/friendsList/FriendsList';
import Chats from './screens/chats/Chats';
import ChatDetail from './screens/chatDetail/ChatDetail';
import Notifications from './screens/notifications/Notifications';
import GroupEdit from "./screens/groupEdit/GroupEdit";
import {PopUpNotificationList} from "./site-components/popUpNotificationList/PopUpNotificationList";


const Router = () => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

    useEffect(() => {
        dispatch(loadUser())
            .then(() => setIsLoading(false))
            .catch(() => setIsLoading(false));
    }, [dispatch, isAuthenticated]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<WelcomePage/>} path=''/>
                <Route element={<LoginPage/>} path='/login'/>
                <Route element={<RegisterPage/>} path='/register'/>
                <Route element={<UserProfile/>} path='/users/:username'/>
                <Route element={<UserProfileCustomize/>} path='/edit'/>
                <Route element={<UserFeed/>} path='/main'/>
                <Route element={<Chats/>} path='/chats'/>
                <Route element={<ChatDetail/>} path='/chats/:id'/>
                <Route element={<GroupDetail/>} path='/groups/:id'/>
                <Route element={<GroupEdit/>} path={'/group-create'}/>
                <Route element={<GroupEdit/>} path={'/group-edit/:id'}/>
                <Route element={<GroupList/>} path='/groups'/>
                <Route element={<FriendsList/>} path='/friends'/>
                <Route element={<Search/>} path='/search'/>
                <Route element={<Notifications/>} path='/notifications'/>
                <Route path='*' element={<div>Not found</div>}/>
            </Routes>
            <PopUpNotificationList/>
        </BrowserRouter>)
}


export default Router