import BasePageWithSidebar from "../../abstract-sreens/sitePage/BasePageWithSidebar";
import GroupForm from "./components/GroupForm";
import GroupCreateForm from './components/GroupCreateForm'
import {useParams} from "react-router-dom";

export default function GroupEdit() {
    const {id} = useParams();

    return (
        <BasePageWithSidebar
            content={
                id ? <GroupForm id={id}/> : <GroupCreateForm/>
            }
        />
    );
}