import axios from "axios";
import "../css/MovieCard.css";
import { useState, useEffect } from "react";
import StarRatings from "react-star-ratings";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie, searchQuery, watchedList = [] }) {
  const [showRating, setShowRating] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const alreadyWatched = watchedList.some((m) => m.title === movie.Title);
    setIsWatched(alreadyWatched);
  }, [watchedList, movie.Title]);

  const onInfoClick = () => {
    //alert("info clik");
    const state = {
      searchQuery: searchQuery
    }
    navigate(`/${movie.imdbID}`, { state })
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
      setIsWatched(true);
      setHighlighted(true);
      setTimeout(() => setHighlighted(false), 3000);
    } catch (error) {
      /* if (error.response && error.response.status === 409) {
         setIsWatched(true);
         setShowRating(false);
       } else {*/
      console.error("Błąd dodawania:", error);
      alert("Błąd dodawania filmu");
    }
    // }   
  };

  return (
    <div
      className={`movie-card ${highlighted ? "highlight" : ""}`}
      onClick={onInfoClick}
    >
      <img
        className="poster-card"
        src={movie.Poster || ""}
        alt={movie.Title || "Brak tytułu"}
      />
      <div>
        {isWatched ? (
          <button className="watched-label" disabled>
            <h4>watched</h4>
          </button>
        ) : (
          <button
            className="watched-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowRating(!showRating);
            }}
          >
            <h4>add to watched</h4>
          </button>
        )}
        {showRating && (
          <div className="rating-stars" onClick={(e) => e.stopPropagation()}>
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
      <h3 className="title-card">{movie.Title || "Brak tytułu"}</h3>
      <h5>{movie.Year || "Brak daty"}</h5>
    </div>
  );
}

export default MovieCard;
