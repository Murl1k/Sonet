import styles from './contentSidebar.module.css'
import React from 'react';

function ContentLeftSidebar({children}) {
    return (
        <div className={styles.contentSidebar}>
            {children}
        </div>
    );
}

export default ContentLeftSidebar