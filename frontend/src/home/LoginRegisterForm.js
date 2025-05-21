import { useState } from 'react';
import './LoginRegisterForm.css';

function LoginRegisterForm({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const url = isLogin
            ? 'http://localhost:8880/api/auth/login'
            : 'http://localhost:8880/api/auth/register';

        const body = { username, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Błąd logowania/rejestracji');
            }

            const user = await response.json();

            if (isLogin) {
                onLogin(user);
            } else {
                const loginResponse = await fetch('http://localhost:8880/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (loginResponse.ok) {
                    const newUser = await loginResponse.json();
                    onLogin(newUser);
                } else {
                    setIsLogin(true);
                }
            }
        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <div className="container">
            <div className="form-box">
                <h2>{isLogin ? 'Logowanie' : 'Rejestracja'}</h2>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="input"
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input"
                    />
                    <button type="submit" className="submit-btn">
                        {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
                    </button>
                </form>

                <div className="switch-mode">
                    {isLogin ? 'Nie posiadasz konta?' : 'Posiadasz już konto?'}{' '}
                    <button onClick={() => setIsLogin(!isLogin)} className="switch-btn">
                        {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginRegisterForm;
