import React, { useState, useEffect } from "react";
import "./css/App.css";
import { Routes, Route } from "react-router-dom";
import MoviesPage from "./pages/MoviesPage";
import WatchedMoviesPage from "./pages/WatchedPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AssistantPage from "./pages/AssistantPage";
import StatsPage from "./pages/StatsPage";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./assets/logo_no_background.png";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem("filmapp_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("filmapp_user");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("filmapp_user", JSON.stringify(userData));
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("filmapp_user");
  };

  if (user) {
    return (
      <div>
        <nav className="navbar">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <Link reloadDocument to="/">
            Home
          </Link>
          <Link to="/watched">Watched</Link>
          <Link to="/assistant">Film Assistant</Link>
          <Link to="/stats">Stats</Link>
          <button onClick={handleLogout}>Log out</button>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<MoviesPage />} />
            <Route path="/watched" element={<WatchedMoviesPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <Link to="/login">Log in</Link>
        <Link to="/register">Register</Link>
      </nav>
      {location.pathname === "/" && (
        <div className="logo-container">
          <img src={logo} alt="Logo" className="app-logo" />
        </div>
      )}
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;