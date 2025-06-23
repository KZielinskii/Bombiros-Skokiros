import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Score.css";

const PAGE_SIZE = 5;

function Score() {
    const [scores, setScores] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchInput, setSearchInput] = useState(""); // to co użytkownik wpisuje
    const [searchQuery, setSearchQuery] = useState(""); // to co trafia do zapytania
    const [loading, setLoading] = useState(false);

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
            const response = await axios.get(`/api/scores/top`, {
                params: {
                    page,
                    size: PAGE_SIZE,
                    username: searchQuery || undefined // tylko jeśli coś podano
                }
            });

            const data = response.data;
            setScores(data.content || data); // zależy od backendu
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error("Błąd przy pobieraniu wyników:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScores();
    }, [page, searchQuery]);

    const handleDelete = async (id) => {
        if (!window.confirm("Na pewno chcesz usunąć wynik?")) return;
        await axios.delete(`/api/scores/${id}`);
        fetchScores();
    };

    const handleSearchClick = () => {
        setPage(0); // resetuj stronę przy nowym wyszukiwaniu
        setSearchQuery(searchInput);
    };

    return (
        <div className="score-container">
            <h1 className="score-title">Tablica wyników</h1>

            <div className="score-search-bar">
                <input
                    type="text"
                    placeholder="🔍 Szukaj po nazwie użytkownika..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="score-input"
                />
                <button onClick={handleSearchClick} className="save-btn">Szukaj</button>
            </div>

            {loading ? (
                <p className="score-loading">Ładowanie...</p>
            ) : (
                <div className="score-table-wrapper">
                    <table className="score-table">
                        <thead>
                        <tr>
                            <th>#</th>
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
