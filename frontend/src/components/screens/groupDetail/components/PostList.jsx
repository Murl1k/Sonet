import Post from "../../../site-components/post/Post";
import {useEffect, useState} from "react";
import {getGroupPosts} from "../../../../redux/actions/postsAction";
import styles from '../group.module.css'
import {useParams} from "react-router-dom";
import {PostCreationForm} from "../../../site-components/postCreationForm/PostCreationForm";
import {useSelector} from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import {toast} from "react-toastify";

export default function PostList({groupInfo}) {
    const [posts, setPosts] = useState([]);
    const currUserId = useSelector((state) => state.user.profile.id);
    const {id} = useParams();
    const [nextPage, setNextPage] = useState(null);
    const [firstLoad, setFirstLoad] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async () => {
        try {
            const data = await getGroupPosts(id, nextPage)
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
    }, [firstLoad, id]);

    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={fetchData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
        >
            <div className={styles.posts}>
                {groupInfo.owner.id === currUserId ? (
                    <PostCreationForm postList={posts} setPosts={setPosts} groupId={id}/>
                ) : null}

                {posts.length > 0 ? (
                    posts.map(post => (
                        <Post key={post.id} postInfo={post}/>
                    ))
                ) : (
                    <p>Здесь пока ничего нет.</p>
                )}
            </div>
        </InfiniteScroll>
    )
}