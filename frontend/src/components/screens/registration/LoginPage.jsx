import {Link, Navigate} from 'react-router-dom';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {handleLogin} from '../../../redux/actions/authAction.js';
import styles from "./registration.module.css";
import {toast} from "react-toastify";


function LoginPage() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        dispatch(handleLogin({username, password}))
            .unwrap()
            .catch((errors) => {
                errors.map((error) => toast.error(error))
            });
    };

    if (isAuthenticated) {
        return <Navigate to={'/main'}/>
    }

    return (
        <div className={styles.page}>
            <div className={styles.accountForm}>
                <h1 className={styles.heading}>Вход в аккаунт</h1>
                <form onSubmit={handleFormSubmit}>
                    <input
                        className={styles.input}
                        type="text"
                        name="login"
                        placeholder="Логин"
                        required
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <button type="submit" className={styles.accountButton}>
                        Войти
                    </button>
                </form>
                <h3 className={styles.noAccount}>
                    Нет аккаунта? <Link to="/register">Зарегистрируйся.</Link>
                </h3>
            </div>
        </div>
    );
}

export default LoginPage;
