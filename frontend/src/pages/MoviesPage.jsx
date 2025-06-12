import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { getDefaultMovies, getMoviesBySearch } from "../services/Api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/MoviesPage.css";

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

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
      const state = {
        searchQuery: ""
      }
      navigate(location.pathname, { state })
      setSearchQuery(previousSearchQuery)
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
          {movies ? (movies.map((movie) => (
            <MovieCard movie={movie} searchQuery={searchQuery} key={movie.imdbID} />
          ))) : <div> No results </div>}

        </div>
      )}
    </div>
  );
}

export default MoviesPage;
