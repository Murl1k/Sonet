import {deletePost} from "../../../../redux/actions/postsAction";
import styles from '../post.module.css'
import {useSelector} from "react-redux";
import {toast} from "react-toastify";

export default function PostActions({postInfo, onDelete}) {
    const currUserId = useSelector((state) => state.user.profile.id)

    const handleDeleteClick = async () => {
        try {
            await deletePost(postInfo.id)
            onDelete()
        } catch (e) {
            toast.error(e)
        }

    };

    const isCurrentUserOwner = postInfo.author.id === currUserId;

    return (
        <div className={styles.postActions}>
            {isCurrentUserOwner && (
                <div onClick={handleDeleteClick}>
                    <i className="material-icons">clear</i>
                </div>
            )}
        </div>
    );
}