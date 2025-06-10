import axios from "axios";
import "../css/MovieCard.css";
import { useState } from "react";
import StarRatings from "react-star-ratings";

function MovieCard({ movie }) {
  const [showRating, setShowRating] = useState(false);
  const [highlighted, setHighlighted] = useState(false);

  const onInfoClick = () => {
    alert("info clik");
  };

  const handleRatingSelect = async (rating) => {
    const storedUser = localStorage.getItem("filmapp_user");
    if (!storedUser || !movie?.Title) {
      alert("Zaloguj się, aby dodać film.");
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.id;

    try {
      await axios.post(
        "http://localhost:5000/api/watched/",
        {
          user_id: userId,
          title: movie.Title,
          rating: rating,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setShowRating(false);
      setHighlighted(true);
      setTimeout(() => setHighlighted(false), 3000);
    } catch (error) {
      console.error("Błąd dodawania:", error);
      alert("Błąd dodawania filmu");
    }
  };

  return (
    <div
      className={`movie-card ${highlighted ? "highlight" : ""}`}
      onClick={onInfoClick}
    >
      <img
        className="poster"
        src={movie.Poster || ""}
        alt={movie.Title || "Brak tytułu"}
      />
      <div>
        <button
          className="watched-button"
          onClick={(e) => {
            e.stopPropagation();
            setShowRating(!showRating);
          }}
        >
          <h4>dodaj do obejrzanych</h4>
        </button>
        {showRating && (
          <div className="rating-stars">
            <StarRatings
              rating={0}
              starRatedColor="gold"
              starHoverColor="orange"
              changeRating={(rating) => handleRatingSelect(rating)}
              numberOfStars={5}
              name={`rating-${movie.imdbID}`}
              starDimension="24px"
              starSpacing="2px"
            />
          </div>
        )}
      </div>
      <h3 className="title">{movie.Title || "Brak tytułu"}</h3>
      <h5>{movie.Year || "Brak daty"}</h5>
    </div>
  );
}

export default MovieCard;
