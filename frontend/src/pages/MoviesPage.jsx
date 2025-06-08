import { useEffect, useState } from "react"
import MovieCard from "../components/MovieCard"
import { getDefaultMovies } from "../services/Api"


function MoviesPage() {
    const [movies, setMovies] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const setDefaultMovies = async () => {
            try {
                const fetchedMovies = await getDefaultMovies()
                setMovies(fetchedMovies)
            } catch (e) {
                console.log(e)
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
            <div>
                {movies.map((movie) => (<MovieCard movie={movie} key={movie.imdbID} />))}
            </div>
        </div>
    )

}

export default MoviesPage