import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ loggedUser, onLogout }) {
    const navigate = useNavigate();

    const toGlobalScore = () => navigate("/score");
    const goToHome = () => navigate("/");
    const logout = () => onLogout();

    return (
        <header className="header">
            <h2 onClick={goToHome} className="header-title clickable">
                Moja Aplikacja
            </h2>
            <div className="header-content">
                {loggedUser && (
                    <>
                        <div className="dropdown">
                            <button className="dropdown-btn">
                                Menu
                            </button>
                            <div className="dropdown-content">
                                <button className="button">Twoje</button>
                                <button onClick={toGlobalScore} className="button">Statystyki</button>
                            </div>
                        </div>
                        <div className="logout">
                            <button onClick={logout} className="dropdown-btn">
                                Wyloguj się
                            </button>
                        </div>
                    </>
                )}
            </div>

        </header>
    );
}

export default Header;
