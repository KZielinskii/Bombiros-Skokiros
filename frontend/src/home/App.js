import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoginRegisterForm from './LoginRegisterForm';

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
        <div>
            <Header loggedUser={loggedUser} onLogout={() => setLoggedUser(null)}/>

            <main>
                {loggedUser ? (
                        <h1>Witaj, {loggedUser.username}</h1>
                ) : (
                    <LoginRegisterForm onLogin={setLoggedUser} />
                )}
            </main>

            <Footer />
        </div>
    );
}

export default App;
