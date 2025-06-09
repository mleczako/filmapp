import { useEffect, useState } from "react"
import MovieCard from "../components/MovieCard"
import { getDefaultMovies, getMoviesBySearch } from "../services/Api"
import '../css/MoviesPage.css';


function MoviesPage() {
    const [movies, setMovies] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const onSearchSubmit = async (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return
        if (loading) return
        setLoading(true)
        try {
            const fetchedMovies = await getMoviesBySearch(searchQuery)
            setMovies(fetchedMovies)
            setError(null)
        } catch (err) {
            console.log(err)
            setError(err)
        } finally {
            setLoading(false)
        }
        setSearchQuery("")
    }

    useEffect(() => {
        const setDefaultMovies = async () => {
            try {
                const fetchedMovies = await getDefaultMovies()
                setMovies(fetchedMovies)
            } catch (err) {
                console.log(err)
                setError("error while loading movies")
            } finally {
                setLoading(false)
            }
        }
        setDefaultMovies()
    }, [])

    return (
        <div>
            <h1>Movies</h1>
            <form onSubmit={onSearchSubmit}>
                <input type="text" value={searchQuery} onChange={(e) => (setSearchQuery(e.target.value))} />
                <button type="submit">
                    Search
                </button>
            </form>

            {error && <div>Error occurred</div>}
            {loading ?
                <div>
                    Loading..
                </div> :
                <div className="movie-grid">
                    {movies.map((movie) => (<MovieCard movie={movie} key={movie.imdbID} />))}
                </div>
            }
        </div>
    )

}

export default MoviesPage