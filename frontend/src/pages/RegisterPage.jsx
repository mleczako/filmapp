import { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');
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
        setMessage('');

        try {
            const response = await axios.post('/api/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            setMessage(response.data.message);
            setFormData({ username: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Wystąpił błąd podczas rejestracji');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <h2>Zarejestruj sie</h2>

            {message && <div>{message}</div>}
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
                        minLength="6"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Rejestrowanie...' : 'Zarejestruj się'}
                </button>
            </form>
        </div>
    );

}
export default RegisterPage