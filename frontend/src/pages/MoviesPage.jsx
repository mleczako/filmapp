import MovieCard from "../components/MovieCard"

function MoviesPage() {
    return (
        <div>
            <h1>Movies</h1>
            <MovieCard movie={{ title: "title", release_date: "2013" }} />
            <MovieCard movie={{ title: "title", release_date: "2013" }} />
            <MovieCard movie={{ title: "title", release_date: "2013" }} />
            <MovieCard movie={{ title: "title", release_date: "2013" }} />
        </div>
    )

}

export default MoviesPage