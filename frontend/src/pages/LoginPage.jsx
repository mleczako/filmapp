import { useState } from 'react';
import axios from 'axios';

function LoginPage({ onLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/login', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            onLogin(response.data.user);
            setFormData({ username: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Wystąpił błąd podczas logowania');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Zaloguj sie</h2>

            {error && <div>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Nazwa użytkownika:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Wprowadź nazwę użytkownika"
                    />
                </div>
                <div>
                    <label htmlFor="password">Hasło:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Wprowadź hasło"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Logowanie...' : 'Zaloguj się'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage