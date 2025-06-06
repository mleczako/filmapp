import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');

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
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('filmapp_user');
  };

  const switchView = (view) => {
    setCurrentView(view);
  };

  if (user) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="user-info">
            <h1>Film App</h1>
            <p>Witaj, <strong>{user.username}</strong>!</p>
            <button onClick={handleLogout} className="logout-btn">
              Wyloguj się
            </button>
          </div>
        </header>

        <main className="dashboard">
          <div className="dashboard-content">
            <h2>Dashboard</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Film App</h1>
        <nav className="auth-nav">
          <button
            onClick={() => switchView('login')}
            className={`nav-btn ${currentView === 'login' ? 'active' : ''}`}
          >
            Logowanie
          </button>
          <button
            onClick={() => switchView('register')}
            className={`nav-btn ${currentView === 'register' ? 'active' : ''}`}
          >
            Rejestracja
          </button>
        </nav>
      </header>

      <main className="auth-main">
        {currentView === 'login' ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Register />
        )}
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
