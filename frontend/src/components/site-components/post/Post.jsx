import styles from './post.module.css'
import {Link} from "react-router-dom";
import moment from 'moment';
import {useState} from "react";
import {likeUnlike} from "../../../redux/actions/postsAction";
import PostActions from "./components/PostActions";
import {toast} from "react-toastify";

function Post({postInfo}) {
    const [likes, setLikes] = useState(postInfo.likes_count);
    const [isLiked, setIsLiked] = useState(postInfo.liked_by_current_user);
    const [isPostDeleted, setIsPostDeleted] = useState(false);

    let authorFullName;
    let authorAvatar;
    let authorUrl;

    if (postInfo.group) {
        authorFullName = postInfo.group.name
        authorAvatar = postInfo.group.avatar
        authorUrl = `/groups/${postInfo.group.id}`
    } else {
        authorFullName = `${postInfo.author.first_name} ${postInfo.author.last_name}`
        authorAvatar = postInfo.author.avatar
        authorUrl = `/users/${postInfo.author.username}/`
    }

    const handlePostDelete = () => {
        setIsPostDeleted(true);
    };

    if (isPostDeleted) {
        return null;
    }

    const handleLikeClick = async () => {
        try {
            const data = await likeUnlike(postInfo.id);
            setLikes(data.likes_count);
            setIsLiked(data.liked_by_current_user);
        } catch (e) {
            toast.error(e)
        }

    };

    return (
        <div className={styles.post}>
            <div className={styles.postHeader}>
                <Link to={authorUrl} className={styles.postAuthorAvatarWrapper}>
                    <img className={styles.postAuthorAvatar} src={authorAvatar} alt="post_avatar"></img>
                </Link>
                <b>
                    <Link to={authorUrl}>
                        {authorFullName}
                    </Link>
                </b>
                <span className={styles.postDate}>
                    {moment(postInfo.created_at).format('DD.MM.YYYY HH:mm')}
                </span>
            </div>
            <PostActions postInfo={postInfo} onDelete={handlePostDelete}/>
            <span className={styles.content}>
                {postInfo.content}
            </span>
            {postInfo.image &&
                <div className={styles.postImage}>
                    <img src={postInfo.image} alt="post_image"></img>
                </div>
            }
            <div className={styles.postReactions}>
                <div className={styles.likes} onClick={handleLikeClick}>
                    <span>{likes}</span>
                    <i className="material-icons">
                        {isLiked ? 'favorite' : 'favorite_border'}
                    </i>
                </div>
            </div>
        </div>
    );
}

export default Post