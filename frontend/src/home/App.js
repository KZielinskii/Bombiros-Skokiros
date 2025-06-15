import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import LoginRegisterForm from './LoginRegisterForm';
import Score from './Score';
import GameForm from "./GameForm";
import GamePage from './GamePage';
import Carousel from './Carousel';

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
            localStorage.removeItem("username");
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
                                ? <Carousel />
                                : <LoginRegisterForm onLogin={setLoggedUser}/>
                        }
                    />
                    <Route path="/score" element={<Score/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                    <Route path="/game-form" element={<GameForm/>} />
                    <Route path="/play" element={<GamePage/>} />
                </Routes>
            </main>

            <Footer />
        </Router>
    );
}

export default App;
