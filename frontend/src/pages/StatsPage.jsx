import { useEffect, useState } from "react";
import axios from "axios";
import "../css/StatsPage.css";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const STAT_TYPES = [
  { key: "genres", label: "Genres" },
  { key: "directors", label: "Directors" },
  { key: "actors", label: "Actors" },
  { key: "summary", label: "Interesting statistics" },
];

const SORT_TYPES = [
  { key: "count", label: "Most movies" },
  { key: "avg", label: "Highest average rating" },
];

function StatsPage() {
  const [watched, setWatched] = useState([]);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statType, setStatType] = useState("genres");
  const [sortType, setSortType] = useState("count");
  const [selected, setSelected] = useState(null); // wybrany element (gatunek/reżyser/aktor)

  useEffect(() => {
    const fetchStats = async () => {
      const storedUser = localStorage.getItem("filmapp_user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const userId = user.id;

      // Pobierz obejrzane filmy użytkownika
      const res = await axios.get(
        `http://localhost:5000/api/watched/?user_id=${userId}`
      );
      setWatched(res.data);

      // Pobierz szczegóły każdego filmu z OMDB
      const promises = res.data.map((movie) =>
        axios.get(
          `https://www.omdbapi.com/?t=${encodeURIComponent(
            movie.title
          )}&apikey=a2b35948`
        )
      );
      const detailsRes = await Promise.all(promises);
      setDetails(detailsRes.map((r) => r.data));
      setLoading(false);
    };
    fetchStats();
  }, []);

  // Pomocnicze funkcje do statystyk
  const getGenres = () => {
    const genres = {};
    watched.forEach((movie, idx) => {
      const detail = details[idx];
      if (!detail || !detail.Genre) return;
      detail.Genre.split(",")
        .map((g) => g.trim())
        .forEach((genre) => {
          genres[genre] = genres[genre] || {
            count: 0,
            sum: 0,
            ratings: [],
            idxs: [],
            runtime: 0,
          };
          genres[genre].count += 1;
          genres[genre].sum += movie.rating || 0;
          genres[genre].ratings.push(movie.rating || 0);
          genres[genre].idxs.push(idx);
          const min = detail.Runtime ? parseInt(detail.Runtime) : 0;
          if (!isNaN(min)) genres[genre].runtime += min;
        });
    });
    return genres;
  };

  const getDirectors = () => {
    const directors = {};
    watched.forEach((movie, idx) => {
      const detail = details[idx];
      if (!detail || !detail.Director) return;
      detail.Director.split(",")
        .map((d) => d.trim())
        .forEach((director) => {
          directors[director] = directors[director] || {
            count: 0,
            sum: 0,
            ratings: [],
            idxs: [],
            runtime: 0,
          };
          directors[director].count += 1;
          directors[director].sum += movie.rating || 0;
          directors[director].ratings.push(movie.rating || 0);
          directors[director].idxs.push(idx);
          const min = detail.Runtime ? parseInt(detail.Runtime) : 0;
          if (!isNaN(min)) directors[director].runtime += min;
        });
    });
    return directors;
  };

  const getActors = () => {
    const actors = {};
    watched.forEach((movie, idx) => {
      const detail = details[idx];
      if (!detail || !detail.Actors) return;
      detail.Actors.split(",")
        .map((a) => a.trim())
        .forEach((actor) => {
          actors[actor] = actors[actor] || {
            count: 0,
            sum: 0,
            ratings: [],
            idxs: [],
            runtime: 0,
          };
          actors[actor].count += 1;
          actors[actor].sum += movie.rating || 0;
          actors[actor].ratings.push(movie.rating || 0);
          actors[actor].idxs.push(idx);
          const min = detail.Runtime ? parseInt(detail.Runtime) : 0;
          if (!isNaN(min)) actors[actor].runtime += min;
        });
    });
    return actors;
  };

  const getTotalRuntime = () => {
    let total = 0;
    details.forEach((detail) => {
      if (detail && detail.Runtime) {
        const min = parseInt(detail.Runtime);
        if (!isNaN(min)) total += min;
      }
    });
    return total;
  };

  // Sortowanie z N/A na końcu
  const sortStats = (statsObj) => {
    const arr = Object.entries(statsObj).map(([key, data]) => ({
      key,
      count: data.count,
      avg: data.count ? data.sum / data.count : 0,
      idxs: data.idxs,
      runtime: data.runtime,
    }));
    // N/A na koniec
    const notNA = arr.filter((item) => item.key !== "N/A");
    const na = arr.filter((item) => item.key === "N/A");
    if (sortType === "count") {
      notNA.sort((a, b) => b.count - a.count);
    } else if (sortType === "avg") {
      notNA.sort((a, b) => b.avg - a.avg);
    }
    return [...notNA, ...na];
  };

  // Najciekawsze statystyki
  const getSummaryStats = () => {
    const genres = sortStats(getGenres());
    const directors = sortStats(getDirectors());
    const actors = sortStats(getActors());
    return {
      genres,
      directors,
      actors,
      totalRuntime: getTotalRuntime(),
    };
  };

  if (loading) return <div>Stats loading...</div>;

  let statsArr = [];
  let statsObj = {};
  if (statType === "genres") {
    statsObj = getGenres();
    statsArr = sortStats(statsObj);
  }
  if (statType === "directors") {
    statsObj = getDirectors();
    statsArr = sortStats(statsObj);
  }
  if (statType === "actors") {
    statsObj = getActors();
    statsArr = sortStats(statsObj);
  }

  // Wyświetlanie filmów dla wybranego elementu
  const renderSelectedMovies = () => {
    if (!selected) return null;
    const idxs = statsObj[selected]?.idxs || [];
    if (idxs.length === 0) return <div>No movies.</div>;
    return (
      <div className="selected-movies-list">
        <h3 className="selected-movies-title">
          Movies with {statType === "genres" && "genre"}
          {statType === "directors" && "director"}
          {statType === "actors" && "actor"}: <b>{selected}</b>
        </h3>
        <ul style={{ padding: 0 }}>
          {idxs.map((idx) => (
            <li key={watched[idx].id} className="movie-list-item">
              <strong>{watched[idx].title}</strong>
              {details[idx] && details[idx].Year && <> ({details[idx].Year})</>}
              {" – rating: "}
              {watched[idx].rating}
            </li>
          ))}
        </ul>
        <button className="close-list-btn" onClick={() => setSelected(null)}>
          Close list
        </button>
      </div>
    );
  };

  // Funkcja do poprawnej odmiany słowa "film"
  function filmLabel(count) {
    if (count === 1) return "movie";
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100))
      return "movies";
    return "movies";
  }

  // Przygotuj dane do wykresu kołowego udziału procentowego gatunków
  const renderSummary = () => {
    const { genres, directors, actors, totalRuntime } = getSummaryStats();
    const topGenre = genres[0];
    const topDirector = directors[0];
    const topActor = actors[0];
    const bestGenre = genres.find((g) => g.count > 1) || genres[0];
    const bestDirector =
      directors.find((d) => d.count > 1 && d.key !== "N/A") ||
      directors.find((d) => d.key !== "N/A") ||
      directors[0];
    const bestActor = actors.find((a) => a.count > 1) || actors[0];

    // Doughnut chart for genre percentage share
    const genreLabels = genres.map((g) => g.key);
    const genreCounts = genres.map((g) => g.count);
    const doughnutData = {
      labels: genreLabels,
      datasets: [
        {
          data: genreCounts,
          backgroundColor: [
            "#1976d2",
            "#800080",
            "#ff9800",
            "#43a047",
            "#e53935",
            "#00838f",
            "#fbc02d",
            "#6d4c41",
            "#8e24aa",
            "#3949ab",
          ],
        },
      ],
    };
    const doughnutOptions = {
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: { color: "#222", font: { weight: "bold" } },
        },
        title: {
          display: true,
          text: "Genre percentage share",
          color: "#1976d2",
          font: { size: 18, weight: "bold" },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const value = context.parsed;
              const percent = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${value} (${percent}%)`;
            },
          },
        },
      },
    };

    // Bar chart for top 5 genres by average rating (min. 2 movies)
    const topGenresByAvg = genres
      .filter((g) => g.count > 1)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);
    const barData = {
      labels: topGenresByAvg.map((g) => g.key),
      datasets: [
        {
          label: "Average rating",
          data: topGenresByAvg.map((g) => g.avg.toFixed(2)),
          backgroundColor: "#43a047",
        },
      ],
    };
    const barOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Top 5 genres by average rating",
          color: "#43a047",
          font: { size: 18, weight: "bold" },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#333",
            font: { weight: "bold" },
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#333",
            font: { weight: "bold" },
          },
        },
      },
    };

    return (
      <div>
        <div
          className="summary-box"
          style={{
            padding: 0,
            background: "none",
            boxShadow: "none",
            marginBottom: 0,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 24,
              marginBottom: 32,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              maxWidth: 700,
            }}
          >
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 24,
              marginBottom: 32,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              maxWidth: 700,
            }}
          >
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        {/* Statystyki w białych boxach */}
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div
            className="summary-box"
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 20,
              marginBottom: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="summary-title"
              style={{ color: "#800080", fontWeight: "bold", fontSize: 18 }}
            >
              Most watched genre:
            </div>
            {topGenre ? (
              <span style={{ color: "#1976d2" }}>
                <b>{topGenre.key}</b> ({topGenre.count}{" "}
                {filmLabel(topGenre.count)}, {topGenre.runtime} min)
              </span>
            ) : (
              <span style={{ color: "#1976d2" }}>No data</span>
            )}
          </div>
          <div
            className="summary-box"
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 20,
              marginBottom: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="summary-title"
              style={{ color: "#800080", fontWeight: "bold", fontSize: 18 }}
            >
              Most watched director:
            </div>
            {topDirector ? (
              <span style={{ color: "#1976d2" }}>
                <b>{topDirector.key}</b> ({topDirector.count}{" "}
                {filmLabel(topDirector.count)}, {topDirector.runtime} min)
              </span>
            ) : (
              <span style={{ color: "#1976d2" }}>No data</span>
            )}
          </div>
          <div
            className="summary-box"
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 20,
              marginBottom: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="summary-title"
              style={{ color: "#800080", fontWeight: "bold", fontSize: 18 }}
            >
              Most watched actor:
            </div>
            {topActor ? (
              <span style={{ color: "#1976d2" }}>
                <b>{topActor.key}</b> ({topActor.count}{" "}
                {filmLabel(topActor.count)}, {topActor.runtime} min)
              </span>
            ) : (
              <span style={{ color: "#1976d2" }}>No data</span>
            )}
          </div>
          <div
            className="summary-box"
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 20,
              marginBottom: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="summary-title"
              style={{ color: "#800080", fontWeight: "bold", fontSize: 18 }}
            >
              Highest rated genre (min. 2 movies):
            </div>
            {bestGenre ? (
              <span style={{ color: "#1976d2" }}>
                <b>{bestGenre.key}</b> (Average: {bestGenre.avg.toFixed(2)})
              </span>
            ) : (
              <span style={{ color: "#1976d2" }}>No data</span>
            )}
          </div>
          <div
            className="summary-box"
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 20,
              marginBottom: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="summary-title"
              style={{ color: "#800080", fontWeight: "bold", fontSize: 18 }}
            >
              Highest rated director (min. 2 movies):
            </div>
            {bestDirector ? (
              <span style={{ color: "#1976d2" }}>
                <b>{bestDirector.key}</b> (Average:{" "}
                {bestDirector.avg.toFixed(2)})
              </span>
            ) : (
              <span style={{ color: "#1976d2" }}>No data</span>
            )}
          </div>
          <div
            className="summary-box"
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 20,
              marginBottom: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="summary-title"
              style={{ color: "#800080", fontWeight: "bold", fontSize: 18 }}
            >
              Highest rated actor (min. 2 movies):
            </div>
            {bestActor ? (
              <span style={{ color: "#1976d2" }}>
                <b>{bestActor.key}</b> (Average: {bestActor.avg.toFixed(2)})
              </span>
            ) : (
              <span style={{ color: "#1976d2" }}>No data</span>
            )}
          </div>
          <div
            className="summary-box"
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 20,
              marginBottom: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="summary-title"
              style={{ color: "#800080", fontWeight: "bold", fontSize: 18 }}
            >
              Total viewing time:
            </div>
            <span style={{ color: "#1976d2" }}>
              <b>{totalRuntime}</b> minutes
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "#fff",
          marginTop: 0,
          marginBottom: 24,
          fontWeight: "bold",
          fontSize: 24,
        }}
      >
        Watched movies stats
      </h1>
      <div style={{ marginBottom: 16 }}>
        {STAT_TYPES.map((type) => (
          <button
            key={type.key}
            onClick={() => {
              setStatType(type.key);
              setSelected(null);
            }}
            className={`stat-btn${statType === type.key ? " active" : ""}`}
          >
            {type.label}
          </button>
        ))}
      </div>
      {statType !== "summary" && (
        <div style={{ marginBottom: 16 }}>
          Sort by:{" "}
          {SORT_TYPES.map((type) => (
            <button
              key={type.key}
              onClick={() => setSortType(type.key)}
              className={`sort-btn${sortType === type.key ? " active" : ""}`}
            >
              {type.label}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {statType === "summary" ? (
          renderSummary()
        ) : (
          <>
            <ul className="stat-list">
              {statsArr.map((item) => (
                <li
                  key={item.key}
                  className="stat-list-item"
                  style={{ minWidth: 500 }}
                >
                  <button
                    className="stat-clickable"
                    onClick={() => setSelected(item.key)}
                  >
                    {item.key}
                  </button>
                  <span>
                    {item.count} {filmLabel(item.count)}, Average rating:{" "}
                    {item.avg.toFixed(2)}, {item.runtime} min
                  </span>
                </li>
              ))}
            </ul>
            {renderSelectedMovies()}
          </>
        )}
      </div>
    </div>
  );
}

export default StatsPage;
