import React, { useEffect, useState } from "react";
import axios from "axios";

const PAGE_SIZE = 10;

function Score() {
    const [scores, setScores] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchUsername, setSearchUsername] = useState("");
    const [loading, setLoading] = useState(false);

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

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Wyniki</h1>

            <input
                type="text"
                placeholder="Szukaj po nazwie użytkownika"
                value={searchUsername}
                onChange={(e) => {
                    setSearchUsername(e.target.value);
                    setPage(0);
                }}
                className="p-2 border rounded mb-4 w-full"
            />

            {loading ? (
                <p>Ładowanie...</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">#</th>
                        <th className="border p-2">Użytkownik</th>
                        <th className="border p-2">Wynik</th>
                        <th className="border p-2">Data</th>
                        <th className="border p-2">Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {scores.map((score, index) => (
                        <tr key={score.id}>
                            <td className="border p-2">{page * PAGE_SIZE + index + 1}</td>
                            <td className="border p-2">{score.username}</td>
                            <td className="border p-2">{score.value}</td>
                            <td className="border p-2">{new Date(score.createdAt).toLocaleString()}</td>
                            <td className="border p-2 space-x-2">
                                <button className="text-blue-600" onClick={() => alert("Edit not implemented yet")}>
                                    Edit
                                </button>
                                <button className="text-red-600" onClick={() => handleDelete(score.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {!searchUsername && (
                <div className="flex justify-between mt-4">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Poprzednia
                    </button>
                    <span>Strona {page + 1} z {totalPages}</span>
                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Następna
                    </button>
                </div>
            )}
        </div>
    );
}

export default Score;
