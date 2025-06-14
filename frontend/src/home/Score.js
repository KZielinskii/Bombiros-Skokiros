import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Score.css";

const PAGE_SIZE = 10;

function Score() {
    const [scores, setScores] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchUsername, setSearchUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');


    const fetchScores = async () => {
        setLoading(true);
        try {
            const response = searchUsername
                ? await axios.get(`/api/scores/user/${searchUsername}`)
                : await axios.get(`/api/scores/top?page=${page}&size=${PAGE_SIZE}`);

            const data = response.data;

            setScores(data.content || data);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error("Błąd przy pobieraniu wyników:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScores();
    }, [page, searchUsername]);

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
            const response = await axios.post("/api/scores", {
                score: 10
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
                onChange={(e) => {
                    setSearchUsername(e.target.value);
                    setPage(0);
                }}
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
                        {scores.map((score, index) => (
                            <tr key={score.id}>
                                <td>{page * PAGE_SIZE + index + 1}</td>
                                <td>{score.username}</td>
                                <td>{score.score}</td>
                                <td>{new Date(score.dateTime).toLocaleDateString('pl-PL')}</td>
                                <td>{new Date(score.dateTime).toLocaleTimeString('pl-PL')}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => alert("Edit not implemented yet")}>
                                        Edytuj
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(score.id)}>
                                        Usuń
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!searchUsername && (
                <div className="score-pagination">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage((p) => p - 1)}
                        className="pagination-btn"
                    >
                        ⬅ Poprzednia
                    </button>
                    <span>
                        Strona {page + 1} z {totalPages}
                    </span>
                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage((p) => p + 1)}
                        className="pagination-btn"
                    >
                        Następna ➡
                    </button>
                </div>
            )}
        </div>
    );
}

export default Score;
