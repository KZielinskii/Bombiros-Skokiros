import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import LoginRegisterForm from './LoginRegisterForm';
import Score from './Score';

function App() {
    const [loggedUser, setLoggedUser] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem("loggedUser");
        if (user) {
            setLoggedUser(JSON.parse(user));
        }
    }, []);

    useEffect(() => {
        if (loggedUser) {
            localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
        } else {
            localStorage.removeItem("loggedUser");
        }
    }, [loggedUser]);

    return (
        <Router>
            <Header loggedUser={loggedUser} onLogout={() => setLoggedUser(null)} />

            <main>
                <Routes>
                    <Route
                        path="/"
                        element={
                            loggedUser
                                ? <h1>Witaj, {loggedUser.username}</h1>
                                : <LoginRegisterForm onLogin={setLoggedUser} />
                        }
                    />
                    <Route path="/score" element={<Score />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>

            <Footer />
        </Router>
    );
}

export default App;
