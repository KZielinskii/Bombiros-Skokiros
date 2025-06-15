import './GameInfo.css';

const GameInfo = () => {
    return (
        <div className="game-info-container">
            <div className="game-card">
                <h1>Informacje o grze</h1>
                <p><strong>Autor:</strong> Kacper Zieliński</p>
                <p><strong>Przedmiot:</strong> Budowanie bogatego interfejsu użytkownika 24/25</p>
                <p><strong>Status:</strong> Gra jest w trakcie budowy.</p>

                <div className="section">
                    <h2>Opis</h2>
                    <p>
                        Aktualnie w grę można grać tylko jednym graczem, ale w przyszłości planowana jest możliwość rozgrywki wieloosobowej ze znajomymi.
                    </p>
                </div>

                <div className="section">
                    <h2>Instrukcja gry</h2>
                    <ul>
                        <li><kbd>A</kbd> – ruch w lewo</li>
                        <li><kbd>D</kbd> – ruch w prawo</li>
                        <li><kbd>W</kbd> – skok</li>
                    </ul>
                    <p>
                        Gracz ma na celu unikanie spadających bomb oraz lecących strzał. Po trafieniu gra się kończy, a wynik gracza (czas przeżycia) zapisywany jest do statystyk.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GameInfo;
