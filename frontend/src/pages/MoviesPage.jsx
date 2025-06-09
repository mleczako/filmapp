import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { getDefaultMovies, getMoviesBySearch } from "../services/Api";
import { Link } from 'react-router-dom';
import '../css/MoviesPage.css';

function MoviesPage() {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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
            setError("Błąd podczas ładowania filmów");
        } finally {
            setLoading(false);
        }
        setSearchQuery("");
    };


    useEffect(() => {
        const setDefaultMovies = async () => {
            try {
                const fetchedMovies = await getDefaultMovies();
                setMovies(fetchedMovies);
            } catch (err) {
                console.log(err);
                setError("Błąd podczas ładowania filmów");
            } finally {
                setLoading(false);
            }
        };
        setDefaultMovies();
    }, []);

    return (
        <div>
            <h1>Movies</h1>
            <form onSubmit={onSearchSubmit}>
                <input
                    className="search-box"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj filmów..."
                />
                <button type="submit" className="search-button">Szukaj</button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div>Ładowanie...</div>
            ) : (
                <div className="movie-grid">
                    {movies.map((movie) => (
                        <MovieCard movie={movie} key={movie.imdbID} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default MoviesPage;
