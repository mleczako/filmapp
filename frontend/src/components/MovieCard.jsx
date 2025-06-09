import "../css/MovieCard.css";

function MovieCard({ movie }) {
    const onAddToWatchedClick = (e) => {
        e.stopPropagation()
        alert("watched clik")
    }
    const onInfoClick = () => {
        alert("info clik")
    }

    return (
        <div className="movie-card" onClick={onInfoClick}>
            <img className="poster" src={movie.Poster} />
            <div><button className="watched-button" onClick={onAddToWatchedClick}> <h4>add to watched</h4></button></div>
            <h3 className="title">{movie.Title}</h3>
            <h5 >{movie.Year}</h5>
        </div>
    )
}
export default MovieCard