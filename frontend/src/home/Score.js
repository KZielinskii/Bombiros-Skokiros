import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Score.css";

const PAGE_SIZE = 5;

function Score() {
    const [allScores, setAllScores] = useState([]);  // pełna lista
    const [scores, setScores] = useState([]);        // wyniki po filtrze + stronicowaniu
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchUsername, setSearchUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');

    const [editingScore, setEditingScore] = useState(null);
    const [editValue, setEditValue] = useState("");

    const startEdit = (score) => {
        setEditingScore(score);
        setEditValue(score.score);
    };

    const cancelEdit = () => {
        setEditingScore(null);
        setEditValue("");
    };

    const saveEdit = async () => {
        try {
            await axios.put(`/api/scores/${editingScore.id}`, {
                ...editingScore,
                score: editValue
            });
            setEditingScore(null);
            await fetchScores();
        } catch (err) {
            console.error("Błąd przy edycji wyniku:", err);
            alert("Nie udało się zaktualizować wyniku");
        }
    };

    const fetchScores = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/scores/top?page=0&size=1000`);
            const data = response.data;
            const scores = data.content || data;
            setAllScores(scores);
        } catch (err) {
            console.error("Błąd przy pobieraniu wyników:", err);
        } finally {
            setLoading(false);
        }
    };

    // Efekt do aktualizacji widocznych wyników przy zmianie allScores, searchUsername lub page
    useEffect(() => {
        // Filtrowanie lokalne po username
        const filtered = searchUsername
            ? allScores.filter(s =>
                s.username.toLowerCase().includes(searchUsername.toLowerCase())
            )
            : allScores;

        // Obliczamy totalPages dla aktualnego filtra
        const pages = Math.ceil(filtered.length / PAGE_SIZE);
        setTotalPages(pages);

        // Pobieramy tylko wyniki dla aktualnej strony
        const start = page * PAGE_SIZE;
        const pagedScores = filtered.slice(start, start + PAGE_SIZE);

        setScores(pagedScores);
    }, [allScores, searchUsername, page]);

    // Gdy zmienia się searchUsername resetujemy stronę na 0
    useEffect(() => {
        setPage(0);
    }, [searchUsername]);

    useEffect(() => {
        fetchScores();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Na pewno chcesz usunąć wynik?")) return;
        await axios.delete(`/api/scores/${id}`);
        fetchScores();
    };

    const handleAddScore = async () => {
        if (!username) {
            alert("Musisz być zalogowany, aby dodać wynik!");
            return;
        }

        try {
            await axios.post("/api/scores", {
                score: 10,
                username: username
            });
            alert("Dodano 10 punktów!");
            await fetchScores();
        } catch (err) {
            console.error("Błąd przy dodawaniu wyniku:", err);
            alert("Nie udało się dodać wyniku");
        }
    };

    return (
        <div className="score-container">
            <h1 className="score-title">Tablica wyników</h1>

            <input
                type="text"
                placeholder="🔍 Szukaj po nazwie użytkownika..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                className="score-input"
            />

            {username && (
                <button onClick={handleAddScore} className="add-score-btn">
                    Dodaj 10 punktów
                </button>
            )}

            {loading ? (
                <p className="score-loading">Ładowanie...</p>
            ) : (
                <div className="score-table-wrapper">
                    <table className="score-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Użytkownik</th>
                            <th>Wynik</th>
                            <th>Data</th>
                            <th>Godzina</th>
                            <th>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {scores.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: "center" }}>
                                    Brak wyników
                                </td>
                            </tr>
                        ) : (
                            scores.map((score, index) => (
                                <tr key={score.id}>
                                    <td>{page * PAGE_SIZE + index + 1}</td>
                                    <td>{score.username}</td>
                                    <td>
                                        {editingScore?.id === score.id ? (
                                            <input
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="edit-input"
                                            />
                                        ) : (
                                            score.score
                                        )}
                                    </td>

                                    <td>{new Date(score.dateTime).toLocaleDateString('pl-PL')}</td>
                                    <td>{new Date(score.dateTime).toLocaleTimeString('pl-PL')}</td>
                                    <td>
                                        {editingScore?.id === score.id ? (
                                            <>
                                                <button className="save-btn" onClick={saveEdit}>Zapisz</button>
                                                <button className="cancel-btn" onClick={cancelEdit}>Anuluj</button>
                                            </>
                                        ) : (
                                            <button className="edit-btn" onClick={() => startEdit(score)}>Edytuj</button>
                                        )}
                                        <button className="delete-btn" onClick={() => handleDelete(score.id)}>
                                            Usuń
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="score-pagination">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="pagination-btn"
                >
                    ⬅ Poprzednia
                </button>
                <span>
                    Strona {totalPages === 0 ? 0 : page + 1} z {totalPages}
                </span>
                <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                    className="pagination-btn"
                >
                    Następna ➡
                </button>
            </div>
        </div>
    );
}

export default Score;
