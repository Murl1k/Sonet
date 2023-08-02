import BasePageWithSidebar from "../../abstract-sreens/sitePage/BasePageWithSidebar";
import FriendItem from "../friendsList/components/FriendItem";
import GroupElement from "../groupsList/components/GroupElement";
import styles from "./search.module.css"
import ContentLeftSidebar from "../../site-components/contentSidebar/ContentLeftSidebar";
import {Link, useLocation} from "react-router-dom";
import {searchGroups, searchUsers} from "../../../redux/actions/searchAction";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";

function Search() {
    const location = useLocation()
    const query = new URLSearchParams(location.search).get('query');
    const type = new URLSearchParams(location.search).get('type');

    const [results, setResults] = useState([]);

    useEffect(() => {
        try {
            if (!query || !type) {
                return
            }
            if (type === 'users') {
                searchUsers(query)
                    .then(data => setResults(data));
            } else if (type === 'groups') {
                searchGroups(query)
                    .then(data => setResults(data));
            }
        } catch (e) {
            toast.error(e)
        }

    }, [query, type]);

    return (
        <BasePageWithSidebar content={
            <div className={styles.searchPage}>
                {query ? (
                    <>
                        <div className={styles.searchQuery}>По запросу <b>{query}</b> найдено:</div>
                        {results && results.length > 0 ? (
                            <div className={styles.result}>
                                {results.map((item) => {
                                    if (type === 'groups') {
                                        return (
                                            <GroupElement
                                                key={item.id}
                                                avatarUrl={item.avatar}
                                                id={item.id}
                                                groupName={item.name}
                                                membersCount={item.members_count}
                                            />
                                        );
                                    } else if (type === 'users') {
                                        return (
                                            <FriendItem
                                                key={item.id}
                                                avatarUrl={item.avatar}
                                                fullName={`${item.first_name} ${item.last_name}`}
                                                username={item.username}
                                            />
                                        );
                                    }
                                })}
                            </div>
                        ) : (
                            <div>Ничего не найдено</div>
                        )}
                        <ContentLeftSidebar classname={styles.sidebar} children={[
                            <Link to={'/search?type=users&query=' + query}>Люди</Link>,
                            <Link to={'/search?type=groups&query=' + query}>Группы</Link>
                        ]}/>
                    </>
                ) : (
                    <h3>Введите запрос</h3>
                )}
            </div>
        }/>
    );
}

export default Search