import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ loggedUser, onLogout }) {
    const navigate = useNavigate();

    const toGlobalScore = () => navigate("/score");
    const goToGameForm = () => navigate("/game-form");
    const goToHome = () => navigate("/");
    const goToInfo = () => navigate("/info");
    const logout = () => {
        onLogout();
        navigate("/");
    };


    return (
        <header className="header">
            <h2 onClick={goToHome} className="header-title clickable">
                Bombiros Skokiros
            </h2>
            <div className="header-content">
                {loggedUser && (
                    <>
                        <div className="dropdown">
                            <button onClick={goToHome} className="dropdown-btn">
                                Menu
                            </button>
                            <div className="dropdown-content">
                                <button onClick={goToGameForm} className="button-menu">Gra</button>
                                <button onClick={toGlobalScore} className="button-menu">Statystyki</button>
                            </div>
                        </div>
                        <button onClick={goToInfo} className="dropdown-btn">
                            Informacje
                        </button>
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
