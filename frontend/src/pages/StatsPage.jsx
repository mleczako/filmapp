import { useEffect, useState } from "react";
import axios from "axios";

const STAT_TYPES = [
  { key: "genres", label: "Genres" },
  { key: "directors", label: "Directors" },
  { key: "actors", label: "Actors" },
  { key: "summary", label: "Intresting statistics" },
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
    if (idxs.length === 0) return <div>Brak filmów.</div>;
    return (
      <div className="selected-movies-list">
        <h3 style={{ color: "#800080", marginBottom: 16 }}>
          Filmy z {statType === "genres" && "gatunku"}
          {statType === "directors" && "reżyserem"}
          {statType === "actors" && "aktorem"}: <b>{selected}</b>
        </h3>
        <ul style={{ padding: 0 }}>
          {idxs.map((idx) => (
            <li
              key={watched[idx].id}
              className="movie-list-item"
              style={{
                color: "#1976d2",
                background: "#e3f0ff",
                borderRadius: 6,
                padding: "8px 12px",
                marginBottom: 6,
                listStyle: "none",
                fontWeight: "bold",
              }}
            >
              <strong>{watched[idx].title}</strong>
              {details[idx] && details[idx].Year && <> ({details[idx].Year})</>}
              {" – ocena: "}
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

  // Stylizacja inline i klasy CSS
  const styles = {
    statBtn: (active) => ({
      marginRight: 8,
      fontWeight: active ? "bold" : "normal",
      background: active ? "#1976d2" : "#e3e3e3",
      color: active ? "#fff" : "#222",
      border: "none",
      borderRadius: 6,
      padding: "8px 16px",
      cursor: "pointer",
      transition: "background 0.2s",
    }),
    sortBtn: (active) => ({
      marginRight: 8,
      fontWeight: active ? "bold" : "normal",
      background: active ? "#1976d2" : "#e3e3e3",
      color: active ? "#fff" : "#222",
      border: "none",
      borderRadius: 6,
      padding: "6px 12px",
      cursor: "pointer",
      transition: "background 0.2s",
    }),
    statList: {
      listStyle: "none",
      color: "#1976d2",
      padding: 0,
      margin: 0,
      maxWidth: 600,
    },
    statListItem: {
      background: "#f5f5f5",
      marginBottom: 8,
      borderRadius: 6,
      padding: "10px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    },
    statClickable: {
      background: "none",
      border: "none",
      color: "#800080",
      textDecoration: "underline",
      cursor: "pointer",
      font: "inherit",
      fontWeight: "bold",
      fontSize: "1em",
      padding: 0,
    },
    summaryBox: {
      background: "#f5f5f5",
      color: "#1976d2",
      borderRadius: 8,
      padding: 20,
      marginBottom: 24,
      boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      maxWidth: 600,
    },
    summaryTitle: {
      fontWeight: "bold",
      fontSize: "1.1em",
      marginBottom: 8,
      color: "#800080",
    },
  };

  // Najciekawsze statystyki
  const renderSummary = () => {
    const { genres, directors, actors, totalRuntime } = getSummaryStats();
    const topGenre = genres[0];
    const topDirector = directors[0];
    const topActor = actors[0];
    const bestGenre = genres.find((g) => g.count > 1) || genres[0];
    // Pomijamy N/A dla najlepszego reżysera
    const bestDirector =
      directors.find((d) => d.count > 1 && d.key !== "N/A") ||
      directors.find((d) => d.key !== "N/A") ||
      directors[0];
    const bestActor = actors.find((a) => a.count > 1) || actors[0];

    return (
      <div>
        <div style={styles.summaryBox}>
          <div style={styles.summaryTitle}>Most viewed genre:</div>
          {topGenre ? (
            <span>
              <b>{topGenre.key}</b> ({topGenre.count}{" "}
              {filmLabel(topGenre.count)}, {topGenre.runtime} min)
            </span>
          ) : (
            "No data"
          )}
        </div>
        <div style={styles.summaryBox}>
          <div style={styles.summaryTitle}>Most viewed director:</div>
          {topDirector ? (
            <span>
              <b>{topDirector.key}</b> ({topDirector.count}{" "}
              {filmLabel(topDirector.count)}, {topDirector.runtime} min)
            </span>
          ) : (
            "No data"
          )}
        </div>
        <div style={styles.summaryBox}>
          <div style={styles.summaryTitle}>Most viewed actor:</div>
          {topActor ? (
            <span>
              <b>{topActor.key}</b> ({topActor.count}{" "}
              {filmLabel(topActor.count)}, {topActor.runtime} min)
            </span>
          ) : (
            "No data"
          )}
        </div>
        <div style={styles.summaryBox}>
          <div style={styles.summaryTitle}>
            Highest rated genre (min. 2 movies):
          </div>
          {bestGenre ? (
            <span>
              <b>{bestGenre.key}</b> (Average: {bestGenre.avg.toFixed(2)})
            </span>
          ) : (
            "Brak danych"
          )}
        </div>
        <div style={styles.summaryBox}>
          <div style={styles.summaryTitle}>
            Highest rated director (min. 2 movies):
          </div>
          {bestDirector ? (
            <span>
              <b>{bestDirector.key}</b> (Average:{" "}
              {bestDirector.avg.toFixed(2)})
            </span>
          ) : (
            "No data"
          )}
        </div>
        <div style={styles.summaryBox}>
          <div style={styles.summaryTitle}>
            Highest rated actor (min. 2 movies):
          </div>
          {bestActor ? (
            <span>
              <b>{bestActor.key}</b> (Average: {bestActor.avg.toFixed(2)})
            </span>
          ) : (
            "No data"
          )}
        </div>
        <div style={styles.summaryBox}>
          <div style={styles.summaryTitle}>Total viewing time:</div>
          <span>
            <b>{totalRuntime}</b> minutes
          </span>
        </div>
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

  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "#1976d2" }}>Watched movies stats</h1>
      <div style={{ marginBottom: 16 }}>
        {STAT_TYPES.map((type) => (
          <button
            key={type.key}
            onClick={() => {
              setStatType(type.key);
              setSelected(null);
            }}
            style={styles.statBtn(statType === type.key)}
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
              style={styles.sortBtn(sortType === type.key)}
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
            <ul style={styles.statList}>
              {statsArr.map((item) => (
                <li
                  key={item.key}
                  style={{ ...styles.statListItem, minWidth: 500 }}
                >
                  <button
                    style={styles.statClickable}
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
      <style>{`
        .selected-movies-list {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          padding: 20px;
          margin-top: 24px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .movie-list-item {
          margin-bottom: 6px;
        }
        .close-list-btn {
          background: #1976d2;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 6px 16px;
          margin-top: 10px;
          cursor: pointer;
          font-weight: bold;
        }
        .close-list-btn:hover {
          background: #1253a2;
        }
      `}</style>
    </div>
  );
}

export default StatsPage;
