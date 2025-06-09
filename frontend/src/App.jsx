import React, { useState, useEffect } from 'react';
import './css/App.css';
import { Routes, Route } from "react-router-dom"
import MoviesPage from './pages/MoviesPage';
import WatchedMoviesPage from './pages/WatchedPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AssistantPage from './pages/AssistantPage';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('filmapp_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('filmapp_user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('filmapp_user', JSON.stringify(userData));
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('filmapp_user');
  };

  if (user) {
    return (
      <div>
        <nav className='navbar'>
          <Link reloadDocument to="/">
            Home
          </Link>
          <Link to="/watched">
            Watched
          </Link>
          <Link to="/assistant">
            Asystent Filmowy
          </Link>
          <button onClick={handleLogout}>
            Wyloguj się
          </button>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<MoviesPage />} />
            <Route path="/watched" element={<WatchedMoviesPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div>
      <nav className='navbar'>
        <Link to="/login">
          Logowanie
        </Link>
        <Link to="/register">
          Rejestracja
        </Link>
      </nav>
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


// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
