import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (user) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Witaj, {user.username}!</h1>
          <button onClick={handleLogout}>Wyloguj się</button>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Film App</h1>
        <nav>
          <button
            onClick={() => setCurrentView('login')}
            className={currentView === 'login' ? 'active' : ''}
          >
            Logowanie
          </button>
          <button
            onClick={() => setCurrentView('register')}
            className={currentView === 'register' ? 'active' : ''}
          >
            Rejestracja
          </button>
        </nav>
      </header>

      <main>
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