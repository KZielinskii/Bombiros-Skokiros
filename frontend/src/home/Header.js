import { useState } from 'react';
import './Header.css';

function Header({ loggedUser, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
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
                                <div className="tile">Twoje</div>
                                <div className="tile">Globalne</div>
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
