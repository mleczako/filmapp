import { useEffect, useState } from "react";
import axios from "axios";

function WatchedPage() {
    const [watched, setWatched] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('filmapp_user');
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const userId = user.id;

        axios.get(`http://localhost:5000/api/watched/?user_id=${userId}`)
            .then((res) => setWatched(res.data))
            .catch((err) => console.error("Błąd pobierania obejrzanych:", err));
    }, []);

    const handleEdit = async (id) => {
        const newRating = prompt("Podaj nową ocenę (1–10):");
        if (!newRating) return;

        try {
            await axios.put(`http://localhost:5000/api/watched/${id}`, {
                rating: parseFloat(newRating)
            });
            setWatched(prev =>
                prev.map((m) => (m.id === id ? { ...m, rating: parseFloat(newRating) } : m))
            );
        } catch (err) {
            alert("Błąd edytowania oceny");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/watched/${id}`);
            setWatched((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
            alert("Błąd usuwania filmu");
        }
    };

    return (
        <div>
            <h1>Watched Movies</h1>
            <ul>
                {watched.map((movie) => (
                    <li key={movie.id}>
                        {movie.title} – ocena: {movie.rating}{" "}
                        <button onClick={() => handleEdit(movie.id)}>Edytuj</button>{" "}
                        <button onClick={() => handleDelete(movie.id)}>Usuń</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WatchedPage;
