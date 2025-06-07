function MovieCard({ movie }) {
    function onAddToWatchedClick() {
        alert("clik")
    }
    return (
        <div>
            <img src="" alt={movie.title} />
            <button onClick={onAddToWatchedClick}> Dodaj do obejrzanych</button>
            <h3>{movie.title}</h3>
            <h5>{movie.release_date}</h5>
        </div>
    )
}
export default MovieCard