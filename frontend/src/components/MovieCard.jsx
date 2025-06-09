import axios from "axios";
import "../css/MovieCard.css";

function MovieCard({ movie }) {
    const onInfoClick = () => {
        alert("info clik")
    }

    async function onAddToWatchedClick(e) {
        e.stopPropagation()
        const storedUser = localStorage.getItem('filmapp_user');
        if (!storedUser) {
            alert("Zaloguj się, aby dodać film.");
            return;
        }

        const user = JSON.parse(storedUser);
        const userId = user.id;
        const rating = prompt("Podaj ocenę (1–10):");

        if (!rating || !movie?.Title) {
            alert("Brakuje danych filmu.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/watched/", {
                user_id: userId,
                title: movie.Title,
                rating: parseFloat(rating),
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            alert("Film dodany!");
        } catch (error) {
            console.error("Błąd dodawania:", error);
            alert("Błąd dodawania filmu");
        }
    }

    return (
        <div className="movie-card" onClick={onInfoClick}>
            <img className="poster" src={movie.Poster || ""} alt={movie.Title || "Brak tytułu"} />
            <div><button className="watched-button" onClick={onAddToWatchedClick}> <h4>add to watched</h4></button></div>
            <h3 className="title">{movie.Title || "Brak tytułu"}</h3>
            <h5>{movie.Year || "Brak daty"}</h5>
        </div>
    );
}

export default MovieCard;
