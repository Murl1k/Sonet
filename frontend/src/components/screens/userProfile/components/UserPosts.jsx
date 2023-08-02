import {useEffect, useState} from "react";
import {getUserPosts} from "../../../../redux/actions/postsAction";
import styles from "../userProfile.module.css"
import Post from "../../../site-components/post/Post";
import {PostCreationForm} from "../../../site-components/postCreationForm/PostCreationForm";
import {useSelector} from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import {toast} from "react-toastify";

export default function UserPosts({userId}) {
    const [posts, setPosts] = useState([]);
    const currUserId = useSelector((state) => state.user.profile.id);
    const [nextPage, setNextPage] = useState(null);
    const [firstLoad, setFirstLoad] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async () => {
        try {
            const data = await getUserPosts(userId, nextPage);
            setPosts((prevPosts) => [...prevPosts, ...data.results]);
            setNextPage(data.next)
            setHasMore(!!data.next);
        } catch (e) {
            toast.error(e)
        }

    };

    useEffect(() => {
        if (!firstLoad) {
            setPosts([])
            setFirstLoad(true);
        }
    }, []);

    useEffect(() => {
        if (firstLoad) {
            fetchData();
        }
    }, [firstLoad, userId]);

    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={fetchData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
        >
            <div className={styles.userPosts}>
                {userId === currUserId ? (
                    <PostCreationForm postList={posts} setPosts={setPosts}/>
                ) : null}
                {posts.length > 0 ? (
                    posts.map((post) => <Post key={post.id} postInfo={post}/>)
                ) : (
                    <p>Здесь пока ничего нет.</p>
                )}
            </div>
        </InfiniteScroll>
    );
}