import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ loggedUser, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => setIsOpen(!isOpen);
    const toGlobalScore = () => {
        navigate('/global-scores');
    };

    const logout = () => onLogout();

    return (
        <header className="header">
            <h2>Moja Aplikacja</h2>
            {loggedUser && (
                <>
                    <div className="dropdown">
                        <button onClick={toggleDropdown} className="dropdown-btn">
                            Statystyki
                        </button>
                        {isOpen && (
                            <div className="dropdown-content">
                                <button className="button">Twoje</button>
                                <button onClick={toGlobalScore} className="button">Globalne</button>
                            </div>
                        )}
                    </div>
                    <div className="logout">
                        <button onClick={logout} className="dropdown-btn">
                            Wyloguj się
                        </button>
                    </div>
                </>
            )}
        </header>
    );
}

export default Header;
