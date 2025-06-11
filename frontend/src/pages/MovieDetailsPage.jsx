import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { getMovieById } from "../services/Api";
import "../css/MovieDetailsPage.css"

function MovieDetailsPage() {
    const params = useParams();
    const parId = params.id;
    const [movieId] = useState(parId);
    const [movie, setMovie] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const getMovieDetails = async () => {
            try {
                const movie = await getMovieById(movieId)
                setMovie(movie)
            } catch (err) {
                console.log(err);
                setError("Error loading movies");
            } finally {
                setLoading(false);
            }
        }
        getMovieDetails()
    }, [])

    return (<div>
        <br />
        <h1>Movie Details</h1>
        {error && <div className="error-message">{error}</div>}

        {loading ? (
            <div>Loading...</div>
        ) : (<div className="details-box">
            <div className="details-box2">
                <img
                    className="poster-det"
                    src={movie.Poster || ""}
                    alt={movie.Title || "Brak tytułu"}
                />
            </div>
            <div className="details-box2">
                <p><p className="title-label">
                    {movie.Title || "No data"}</p></p>
                <p><p className="detail-label">Year: </p>
                    {movie.Year || "No data"}</p>
                <p><p className="detail-label">Rated: </p>
                    {movie.Rated || "No data"}</p>
                <p><p className="detail-label">Released: </p>
                    {movie.Released || "No data"}</p>
                <p><p className="detail-label">Runtime: </p>
                    {movie.Runtime || "No data"}</p>
                <p><p className="detail-label">Genre: </p>
                    {movie.Genre || "No data"}</p>
                <p><p className="detail-label">Director: </p>
                    {movie.Director || "No data"}</p>
                <p><p className="detail-label">Writer: </p>
                    {movie.Writer || "No data"}</p>
                <p><p className="detail-label">Actors: </p>
                    {movie.Actors || "No data"}</p>
                <p><p className="detail-label">Plot: </p>
                    {movie.Plot || "No data"}</p>
                <p><p className="detail-label">Country: </p>
                    {movie.Country || "No data"}</p>
                <p><p className="detail-label">Awards: </p>
                    {movie.Awards || "No data"}</p>
                <p><p className="detail-label">Box Office: </p>
                    {movie.BoxOffice || "No data"}</p>
            </div>
        </div>)}
    </div>)
}
export default MovieDetailsPage