import BasePageWithSidebar from "../../abstract-sreens/sitePage/BasePageWithSidebar"
import styles from './userFeed.module.css'
import InfiniteScroll from "react-infinite-scroll-component";
import {useEffect, useState} from "react";
import {getUserFeed} from "../../../redux/actions/postsAction";
import Post from "../../site-components/post/Post";
import {toast} from "react-toastify";

function UserFeed() {
    const [posts, setPosts] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [firstLoad, setFirstLoad] = useState(false);

    const fetchPosts = async () => {
        try {
            const data = await getUserFeed(nextPage);
            setNextPage(data.next)
            setHasMore(!!data.next);
            setPosts((prevPosts) => [...prevPosts, ...data.results]);
        } catch (e) {
            toast.error(e)
        }

    };

    useEffect(() => {
        if (!firstLoad) {
            setFirstLoad(true);
        }
    }, []);

    useEffect(() => {
        if (firstLoad) {
            fetchPosts();
        }
    }, [firstLoad]);

    return (
        <BasePageWithSidebar
            content={
                <div>
                    <h1 className={styles.title}>Новости</h1>
                    <InfiniteScroll
                        dataLength={posts.length}
                        next={fetchPosts}
                        hasMore={hasMore}
                        loader={<></>}
                    >
                        <div className={styles.userFeed}>
                            {posts.length > 0 ? (
                                posts.map((post) => <Post key={`post-${post.id}`} postInfo={post}/>)
                            ) : (
                                <p>Здесь пока ничего нет.</p>
                            )}
                        </div>
                    </InfiniteScroll>
                </div>
            }
        />
    );
}

export default UserFeed