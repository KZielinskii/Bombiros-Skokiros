import { useState } from 'react';

function LoginRegisterForm({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const url = isLogin ? 'http://localhost:8880/api/auth/login' : 'http://localhost:8880/api/auth/register';
        const body = { username, password };
        console.log(JSON.stringify(body));

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Logowanie nie powiodło się');
            }
        } catch (error) {
            console.error('Błąd podczas: POST request:', error);
            setError(error.message);
        }
    };

    return (
        <div>
        {
            isLogin ? (
                <div>
                    <h2>Logowanie</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Hasło"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Zaloguj się</button>
                    </form>
                    <div>
                        Nie posiadasz konta?
                        <button onClick={() => setIsLogin(!isLogin)}>Zarejestruj się</button>
                    </div>

                </div>
            ) : (
                <div>
                    <h2>Rejestracja</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Hasło"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Zarejestruj się</button>
                    </form>
                    <div>
                        Posiadasz już konto?
                        <button onClick={() => setIsLogin(!isLogin)}>Zaloguj się</button>
                    </div>
                </div>
            )
        }
        </div>
    );
}

export default LoginRegisterForm;
