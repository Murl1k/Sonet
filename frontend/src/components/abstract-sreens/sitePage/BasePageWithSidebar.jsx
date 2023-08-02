import BasePage from "../basePage/BasePage"
import Sidebar from '../../site-components/sidebar/Sidebar'
import styles from './sitePage.module.css'

function BasePageWithSidebar({content}) {
    return (
        <BasePage
            pageContent={
                <div className={styles.pageContent}>
                    <Sidebar/>
                    <div className={styles.content}>{content}</div>
                </div>
            }
        />
    )
}

export default BasePageWithSidebar