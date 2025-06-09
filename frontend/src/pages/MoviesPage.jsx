import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { getDefaultMovies, getMoviesBySearch } from "../services/Api";
import { Link } from 'react-router-dom'; // Importujemy Link do nawigacji
import '../css/MoviesPage.css';

function MoviesPage() {
    const [movies, setMovies] = useState([]); // Stan dla listy filmów
    const [error, setError] = useState(null); // Stan dla błędów
    const [loading, setLoading] = useState(true); // Stan ładowania
    const [searchQuery, setSearchQuery] = useState(""); // Stan dla zapytania wyszukiwania

    // Funkcja do wyszukiwania filmów
    const onSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return; // Jeśli pole tekstowe puste, nic nie wysyłamy
        setLoading(true);
        try {
            const fetchedMovies = await getMoviesBySearch(searchQuery); // Pobranie filmów na podstawie zapytania
            setMovies(fetchedMovies);
            setError(null);
        } catch (err) {
            console.log(err);
            setError("Błąd podczas ładowania filmów");
        } finally {
            setLoading(false);
        }
        setSearchQuery(""); // Czyszczenie pola wyszukiwania
    };

    // Ładowanie domyślnych filmów
    useEffect(() => {
        const setDefaultMovies = async () => {
            try {
                const fetchedMovies = await getDefaultMovies(); // Pobranie domyślnych filmów
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
            <h1>Filmy</h1>

            {/* Sekcja nawigacyjna */}
            <div className="nav-buttons">
                <Link to="/watched">
                    <button>Watched</button> {/* Przycisk do watched */}
                </Link>
                <Link to="/assistant"> {/* Przycisk do Asystenta Filmowego */}
                    <button>Asystent Filmowy</button>
                </Link>
            </div>

            {/* Formularz wyszukiwania */}
            <form onSubmit={onSearchSubmit} className="search-form">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Zmieniamy zapytanie w stanie
                    placeholder="Szukaj filmów..."
                />
                <button type="submit">Szukaj</button>
            </form>

            {/* Wyświetlanie błędów */}
            {error && <div className="error-message">{error}</div>}

            {/* Ładowanie filmów */}
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
