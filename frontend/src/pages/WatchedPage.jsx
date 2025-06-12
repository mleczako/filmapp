import { useEffect, useState } from "react";
import axios from "axios";
import StarRatings from "react-star-ratings";
import "../css/WatchedPage.css";

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
      .catch((err) => console.error("Error loading watched movies:", err));
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
      alert("Error updating rating");
    }
  };

  const handleExport = () => {
  const storedUser = localStorage.getItem("filmapp_user");
  if (!storedUser) return;
  const user = JSON.parse(storedUser);
  const userId = user.id;
  window.open(`http://localhost:5000/api/watched/export?user_id=${userId}`, "_blank");
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/watched/${id}`);
      setWatched((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert("Error deleting movie");
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
      <h1>Watched movies</h1>
      <div style={{ marginBottom: 16 }}>
        Sort by:&nbsp;
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Date added</option>
          <option value="title">Title</option>
          <option value="rating">Rating</option>
        </select>
        &nbsp;
        <button
          onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
        >
          {sortOrder === "asc" ? "⬆️ Ascending" : "⬇️ Descending"}
        </button>
        <button onClick={handleExport}>
        📁 Eksportuj do CSV
        </button>

      </div>
       <div className="movie-list">
        {sortedWatched.map((movie) => (
          <div className="movie-row" key={movie.id}>
            <div className="movie-title">
              <strong>{movie.title}</strong>
            </div>
            <div className="movie-stars">
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
                starDimension="22px"
                starSpacing="2px"
              />
            </div>
            <div className="movie-buttons">
              {editId === movie.id ? (
                <button onClick={() => setEditId(null)}>Cancel</button>
              ) : (
                <button onClick={() => setEditId(movie.id)}>✏️ Edit</button>
              )}
              <button onClick={() => handleDelete(movie.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default WatchedPage;
