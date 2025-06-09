import "../css/MovieCard.css";

function MovieCard({ movie }) {
    function onAddToWatchedClick() {
        alert("clik")
    }
    return (
        <div className="movie-card">
            <img className="poster" src={movie.Poster} />
            <h3 className="title">{movie.Title}</h3>
            <h5 >{movie.Year}</h5>
            <button onClick={onAddToWatchedClick}> <h4>Dodaj do obejrzanych</h4></button>
        </div>
    )
}
export default MovieCard