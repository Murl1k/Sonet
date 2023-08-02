import styles from './searchElement.module.css'

function SearchElement({id, avatarUrl, innerContent}) {
    return (
        <div className={styles.searchElement} key={id}>
            <img alt='search' src={avatarUrl} className={styles.image}/>
            <div className={styles.description}>
                {innerContent}
            </div>
        </div>
    )
}

export default SearchElement