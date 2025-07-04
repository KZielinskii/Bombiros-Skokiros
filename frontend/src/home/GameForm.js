import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameForm.css';

const initialPlayer = { name: '', character: '' };
const characters = ['Zielony', 'Czerwony', 'Niebieski'];


function GameForm() {
    const [players, setPlayers] = useState([]);
    const [player, setPlayer] = useState(initialPlayer);
    const [error, setError] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const navigate = useNavigate();

    const mapCharacterToColor = {
        'Zielony': 'green',
        'Czerwony': 'red',
        'Niebieski': 'blue'
    };

    const handleChange = (e) => {
        setPlayer({ ...player, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!player.name.trim() || !player.character) {
            setError('Wszystkie pola są wymagane.');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (editIndex === null) {
            if (players.length >= 1) {
                setError('Niestety na tym etapie produkcji możesz zagrać tylko 1 graczem :(.');
                return;
            }
            setPlayers([...players, player]);
        } else {
            const updated = [...players];
            updated[editIndex] = player;
            setPlayers(updated);
            setEditIndex(null);
        }

        setPlayer(initialPlayer);
        setError('');
    };

    const handleEdit = (index) => {
        setPlayer(players[index]);
        setEditIndex(index);
        setError('');
    };

    const handleDelete = (index) => {
        const updated = players.filter((_, i) => i !== index);
        setPlayers(updated);
        setError('');
        if (editIndex === index) {
            setEditIndex(null);
            setPlayer(initialPlayer);
        }
    };

    return (
        <div className="game-form-container">
            <h2 className="title">Wybierz swoją postać</h2>
            <form onSubmit={handleSubmit} className="form">
                <label className="label">
                    Nazwa gracza:
                    <input
                        type="text"
                        name="name"
                        value={player.name}
                        onChange={handleChange}
                        className="input"
                        placeholder="Wpisz nazwę"
                    />
                </label>
                <label className="label">
                    Wybierz postać:
                    <select
                        name="character"
                        value={player.character}
                        onChange={handleChange}
                        className="select"
                    >
                        <option value="">Wybierz postać...</option>
                        {characters.map((char) => (
                            <option key={char} value={char}>
                                {char}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit" className="button">
                    {editIndex === null ? 'Dodaj gracza' : 'Zaktualizuj gracza'}
                </button>
                {error && <p className="error">{error}</p>}
            </form>

            <h3 className="subtitle">Uczestnicy gry:</h3>
            {players.length === 0 ? (
                <p className="no-players">Brak dodanych graczy.</p>
            ) : (
                <ul className="player-list">
                    {players.map((p, i) => (
                        <li key={i} className="player-item">
                            <span>
                                <strong>{p.name}</strong> jako <em>{p.character}</em>
                            </span>
                            <div>
                                <button onClick={() => handleEdit(i)} className="small-button">
                                    Edytuj
                                </button>{' '}
                                <button onClick={() => handleDelete(i)} className="small-button delete-button">
                                    Usuń
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <button
                className="button"
                type="button"
                onClick={() => {
                    if (players.length > 0) {
                        const colors = players.map(p => mapCharacterToColor[p.character] || 'green');
                        navigate('/play', { state: { players, colors } });
                    } else {
                        setError('Dodaj co najmniej jednego gracza, aby rozpocząć grę.');
                    }
                }}
            >
                Wejdź do gry
            </button>

        </div>
    );
}

export default GameForm;
