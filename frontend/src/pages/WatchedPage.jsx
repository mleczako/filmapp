import { useEffect, useState } from "react";
import axios from "axios";
import StarRatings from "react-star-ratings";

function WatchedPage() {
  const [watched, setWatched] = useState([]);
  const [editId, setEditId] = useState(null); // ID aktualnie edytowanego filmu
  const [sortBy, setSortBy] = useState("date"); // "date", "title", "rating"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" lub "desc"

  useEffect(() => {
    const storedUser = localStorage.getItem("filmapp_user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    const userId = user.id;

    axios
      .get(`http://localhost:5000/api/watched/?user_id=${userId}`)
      .then((res) => setWatched(res.data))
      .catch((err) => console.error("Błąd pobierania obejrzanych:", err));
  }, []);

  const handleRatingChange = async (newRating, movieId) => {
    try {
      await axios.put(`http://localhost:5000/api/watched/${movieId}`, {
        rating: newRating,
      });
      setWatched((prev) =>
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

  // Sortowanie
  const sortedWatched = [...watched].sort((a, b) => {
    if (sortBy === "title") {
      if (a.title < b.title) return sortOrder === "asc" ? -1 : 1;
      if (a.title > b.title) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
    if (sortBy === "rating") {
      if ((a.rating || 0) < (b.rating || 0))
        return sortOrder === "asc" ? -1 : 1;
      if ((a.rating || 0) > (b.rating || 0))
        return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
    // Domyślnie po dacie dodania (id rosnąco/ malejąco)
    if ((a.id || 0) < (b.id || 0)) return sortOrder === "asc" ? -1 : 1;
    if ((a.id || 0) > (b.id || 0)) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <h1>Obejrzane filmy</h1>
      <div style={{ marginBottom: 16 }}>
        Sortuj po:&nbsp;
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Dacie dodania</option>
          <option value="title">Tytule</option>
          <option value="rating">Ocenie</option>
        </select>
        &nbsp;
        <button
          onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
        >
          {sortOrder === "asc" ? "⬆️ Rosnąco" : "⬇️ Malejąco"}
        </button>
      </div>
      <ul>
        {sortedWatched.map((movie) => (
          <li key={movie.id}>
            <strong>{movie.title}</strong> –
            <StarRatings
              rating={movie.rating || 0}
              starRatedColor="gold"
              starHoverColor="orange"
              changeRating={(rating) =>
                editId === movie.id
                  ? handleRatingChange(rating, movie.id)
                  : null
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
