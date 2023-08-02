import React, {useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import styles from './registration.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser} from '../../../redux/actions/authAction';
import {toast} from "react-toastify";

function RegisterPage() {
    const dispatch = useDispatch()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('');
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)


    const handleSubmit = async (event) => {
        event.preventDefault();

        dispatch(registerUser({username: username, password: password, firstName: firstName, lastName: lastName}))
            .unwrap()
            .catch((errors) => {
                errors.map((error) => toast.error(error))
            });

    }

    if (isAuthenticated) {
        return <Navigate to={'/main'}/>
    }

    return (
        <div className={styles.page}>
            <div className={styles.accountForm}>
                <h1 className={styles.heading}>Регистрация</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Логин"
                        required
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Имя"
                        required
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Фамилия"
                        required
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Пароль"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <button type="submit" className={styles.accountButton}>
                        Зарегистрироваться
                    </button>
                </form>
                <h3 className={styles.noAccount}>
                    Уже есть аккаунт? <Link to="/login">Войти.</Link>
                </h3>
            </div>
        </div>
    );
}

export default RegisterPage;