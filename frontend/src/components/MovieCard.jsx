function MovieCard({ movie }) {
    function onAddToWatchedClick() {
        alert("clik")
    }
    return (
        <div>
            <img src={movie.Poster} />
            <h3>{movie.Title}</h3>
            <h5>{movie.Year}</h5>
            <button onClick={onAddToWatchedClick}> <h4>Dodaj do obejrzanych</h4></button>
        </div>
    )
}
export default MovieCard