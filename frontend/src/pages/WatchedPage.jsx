
import { useEffect, useState } from "react";
import axios from "axios";
import StarRatings from "react-star-ratings";

function WatchedPage() {
    const [watched, setWatched] = useState([]);
    const [editId, setEditId] = useState(null);  // ID aktualnie edytowanego filmu

    useEffect(() => {
        const storedUser = localStorage.getItem('filmapp_user');
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const userId = user.id;

        axios.get(`http://localhost:5000/api/watched/?user_id=${userId}`)
            .then((res) => setWatched(res.data))
            .catch((err) => console.error("Błąd pobierania obejrzanych:", err));
    }, []);

    const handleRatingChange = async (newRating, movieId) => {
        try {
            await axios.put(`http://localhost:5000/api/watched/${movieId}`, {
                rating: newRating
            });
            setWatched(prev =>
                prev.map((m) => (m.id === movieId ? { ...m, rating: newRating } : m))
            );
            setEditId(null);
        } catch (err) {
            alert("Błąd aktualizacji oceny");
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
            <h1>Obejrzane filmy</h1>
            <ul>
                {watched.map((movie) => (
                    <li key={movie.id}>
                        <strong>{movie.title}</strong> – 
                        <StarRatings
                            rating={movie.rating || 0}
                            starRatedColor="gold"
                            starHoverColor="orange"
                            changeRating={(rating) =>
                                editId === movie.id ? handleRatingChange(rating, movie.id) : null
                            }
                            numberOfStars={5}
                            name={`rating-${movie.id}`}
                            starDimension="24px"
                            starSpacing="2px"
                        />
                        {editId === movie.id ? (
                            <button onClick={() => setEditId(null)}>Anuluj</button>
                        ) : (
                            <button onClick={() => setEditId(movie.id)}>✏️ Edytuj</button>
                        )}
                        <button onClick={() => handleDelete(movie.id)}>🗑️ Usuń</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WatchedPage;
