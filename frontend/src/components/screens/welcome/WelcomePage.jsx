import styles from "./welcome.module.css";
import {Link} from "react-router-dom";

function WelcomePage() {
    return (
        <div className={styles.welcomePage}>
            <div className={styles.content}>
                <h1 className={styles.heading}>Sonet</h1>
                <p className={styles.subheading}>
                    Лучшая социальная сеть на моем компьютере.
                </p>
                <div className={styles.buttons}>
                    <Link to={'/login'} className={styles.login}>Войти</Link>
                    <Link to={'/register'} className={styles.register}>Регистрация</Link>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;
