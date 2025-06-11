import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { getDefaultMovies, getMoviesBySearch } from "../services/Api";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/MoviesPage.css";

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [watchedList, setWatchedList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const onSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const fetchedMovies = await getMoviesBySearch(searchQuery);
      setMovies(fetchedMovies);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Error loading movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const previousSearchQuery = location.state?.searchQuery
    console.log(previousSearchQuery)
    if (previousSearchQuery) {
      const onBackFromDetails = async (previousSearchQuery) => {
        setLoading(true);
        try {
          const fetchedMovies = await getMoviesBySearch(previousSearchQuery);
          setMovies(fetchedMovies);
          setError(null);
        } catch (err) {
          console.log(err);
          setError("Error loading movies");
        } finally {
          setLoading(false);
        }
      };
      onBackFromDetails(previousSearchQuery)
    } else {
      const setDefaultMovies = async () => {
        try {
          const fetchedMovies = await getDefaultMovies();
          setMovies(fetchedMovies);
        } catch (err) {
          console.log(err);
          setError("Error loading movies");
        } finally {
          setLoading(false);
        }
      };
      setDefaultMovies();
    }
  }, []);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("filmapp_user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    const userId = user.id;

    axios
      .get(`http://localhost:5000/api/watched/?user_id=${userId}`)
      .then((res) => setWatchedList(res.data))
      .catch((err) => console.error("Błąd ładowania obejrzanych:", err));
  }, []);


  return (
    <div>
      <br />
      <h1>Movies</h1>
      <form onSubmit={onSearchSubmit}>
        <input
          className="search-box"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find movie..."
        />
        <button type="submit" className="search-button">
          Find
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="movie-grid">
          {movies && movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard
                movie={movie}
                searchQuery={searchQuery}
                watchedList={watchedList}
                key={movie.imdbID}
              />
            ))
          ) : (
            <div>No results</div>
)}


        </div>
      )}
    </div>
  );
}

export default MoviesPage;
